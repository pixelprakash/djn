import { useEffect, useState } from 'react'

// Content for News & Updates (home page) and the Blog comes from Sanity (the studio in
// /studio, deployed separately). Reading is public -- the project id below
// is not a secret, and no token is shipped with the site.
//
// Every read is fetched once per page load and shared (NewsSection, Blog
// and BlogPost all ask for what they need through the same cache). The
// built-in copy in src/pages/blogData.js stays in place as the Blog's
// fallback: it renders immediately, and is swapped for the live content
// when it arrives. News has no built-in copy: nothing published, nothing
// shown.
//
// A plain fetch against Sanity's public query endpoint (the CDN one) rather
// than the @sanity/client package: same result, a fraction of the bundle.
const API = 'https://q6natj20.apicdn.sanity.io/v2025-01-01/data/query/production'

async function query(groq) {
  const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`)
  if (!res.ok) throw new Error(`Sanity ${res.status}`)
  return (await res.json()).result
}

const cache = new Map() // key -> { data, promise }

// The last good answer for each query is kept in localStorage, so a returning
// visitor sees their content immediately and it is refreshed in the
// background (stale-while-revalidate) instead of waiting on the network.
// Bump STORE's version if the shape the maps produce ever changes.
const STORE = 'djm-cms:v3:'
const readStored = key => {
  try { const raw = localStorage.getItem(STORE + key); return raw ? JSON.parse(raw) : null } catch { return null }
}
const writeStored = (key, data) => {
  try {
    if (data) localStorage.setItem(STORE + key, JSON.stringify(data))
    else localStorage.removeItem(STORE + key)
  } catch { /* private mode or storage full: just skip caching */ }
}

// What this browser last saw for the news feed (instant, no network): lets the
// page transition name an update before its page has loaded.
export const peekFeed = () => readStored('feed') || []

function load(key, groq, map) {
  let entry = cache.get(key)
  if (!entry) {
    entry = {}
    const stored = readStored(key)
    if (stored) entry.data = stored // usable at once
    entry.promise = query(groq)
      .then(rows => {
        // Nothing published yet counts as "no live content".
        const fresh = Array.isArray(rows) && rows.length ? map(rows) : null
        entry.data = fresh
        writeStored(key, fresh)
        return fresh
      })
      .catch(() => {
        // Offline or blocked: keep whatever we already had.
        if (!('data' in entry)) entry.data = null
        return entry.data
      })
    cache.set(key, entry)
  }
  return entry
}

/* Live content if there is any, else `fallback`. `loading` is true until the
   first answer arrives (a page that must not show "not found" for a
   CMS-only item yet can wait on it) -- which is immediately, for anyone who
   has been here before. */
export function useCms(key, groq, map, fallback) {
  const known = load(key, groq, map)
  const [state, setState] = useState(() => ({
    data: 'data' in known ? known.data : undefined, // undefined = not answered yet
  }))

  useEffect(() => {
    let alive = true
    // Always via the promise, so state is only ever set from a callback.
    known.promise.then(data => { if (alive) setState(s => (s.data === data ? s : { data })) })
    return () => { alive = false }
    // key identifies the query; groq/map are module constants at call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const answered = state.data !== undefined
  return { data: state.data || fallback, loading: !answered, live: Boolean(state.data) }
}

/* ── Shaping what Sanity returns into what the pages already expect ── */

// Sanity's image CDN resizes and re-encodes on the fly via URL parameters.
export const sized = (url, w) => (url ? `${url}?w=${w}&auto=format&q=82` : url)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthYear = iso => {
  const [y, m] = (iso || '').split('-')
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : ''
}

export const POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
  "slug": slug.current, title, tag, publishedAt, venue, desc, originalHref, externalNote, body,
  "images": images[].asset->url
}`

export const mapPosts = rows => rows.map(r => ({
  slug: r.slug,
  title: r.title,
  tag: r.tag,
  date: monthYear(r.publishedAt),
  venue: r.venue || '',
  desc: r.desc,
  originalHref: r.originalHref || '',
  externalNote: r.externalNote || '',
  body: r.body || [],
  images: (r.images || []).map(u => sized(u, 1800)),
  thumbs: (r.images || []).map(u => sized(u, 900)),
}))

/* ── News, updates and announcements (LinkedIn-style posts) ── */
export const FEED_QUERY = `*[_type == "feedPost"] | order(coalesce(pinned, false) desc, publishedAt desc){
  _id, title, "slug": slug.current, text, publishedAt, linkedinUrl, topic, pinned,
  closesOn, ctaLabel, ctaUrl,
  "images": images[]{ "url": asset->url, alt }
}`

export const mapFeed = rows => rows.map(r => ({
  id: r._id,
  // Posts made before slugs existed fall back to their id, so every update
  // still has an address of its own.
  slug: r.slug || r._id,
  title: r.title || '',
  closesOn: r.closesOn || '',
  cta: r.ctaUrl ? { label: r.ctaLabel || 'Learn more', url: r.ctaUrl } : null,
  text: r.text || '',
  date: r.publishedAt,
  url: r.linkedinUrl || '',
  topic: r.topic || '',
  pinned: Boolean(r.pinned),
  images: (r.images || []).filter(i => i.url).map(i => ({
    src: sized(i.url, 1600),
    thumb: sized(i.url, 800),
    alt: i.alt || '',
  })),
}))


// Start the requests a page will need before React has even mounted, so the
// network round trip overlaps with loading and running the app's code.
export function prefetchFor(pathname) {
  if (pathname === '/' || pathname.startsWith('/about') || pathname.startsWith('/news')) load('feed', FEED_QUERY, mapFeed)
  if (pathname.startsWith('/blogs')) load('posts', POSTS_QUERY, mapPosts)
}
