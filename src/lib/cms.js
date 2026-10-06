import { useEffect, useState } from 'react'

// Content for News & Updates and the Blog comes from Sanity (the studio in
// /studio, deployed separately). Reading is public -- the project id below
// is not a secret, and no token is shipped with the site.
//
// Every read is fetched once per page load and shared (NewsSection, Blog
// and BlogPost all ask for what they need through the same cache). The
// built-in copies in src/data/newsData.js and src/pages/blogData.js stay in
// place as the fallback: they render immediately, and are swapped for the
// live content when it arrives. If the request fails -- or the dataset has
// nothing published yet -- they simply stay.
//
// A plain fetch against Sanity's public query endpoint (the CDN one) rather
// than the @sanity/client package: same result, a fraction of the bundle.
const API = 'https://q6natj20.apicdn.sanity.io/v2025-01-01/data/query/production'

async function query(groq) {
  const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`)
  if (!res.ok) throw new Error(`Sanity ${res.status}`)
  return (await res.json()).result
}

const cache = new Map() // key -> { data } once loaded, { promise } while loading

function load(key, groq, map) {
  let entry = cache.get(key)
  if (!entry) {
    entry = {
      promise: query(groq)
        .then(rows => {
          // Nothing published yet counts as "no live content".
          entry.data = Array.isArray(rows) && rows.length ? map(rows) : null
          return entry.data
        })
        .catch(() => {
          entry.data = null
          return null
        }),
    }
    cache.set(key, entry)
  }
  return entry
}

/* Live content if there is any, else `fallback`. `loading` is true until the
   first answer arrives (a page that must not show "not found" for a
   CMS-only item yet can wait on it). */
export function useCms(key, groq, map, fallback) {
  const known = cache.get(key)
  const [state, setState] = useState(() => ({
    data: known && 'data' in known ? known.data : undefined, // undefined = not answered yet
  }))

  useEffect(() => {
    let alive = true
    // Always via the promise (already-settled ones resolve on the next
    // tick), so state is only ever set from a callback, never synchronously.
    load(key, groq, map).promise.then(data => { if (alive) setState({ data }) })
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

export const NEWS_QUERY = `*[_type == "newsItem"] | order(publishedAt desc){
  title, tag, "date": dateLabel, desc, href
}`

export const mapNews = rows => rows.map(r => ({
  title: r.title,
  tag: r.tag,
  date: r.date,
  desc: r.desc || '',
  href: r.href || '',
}))

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

/* ── LinkedIn-style feed posts ── */
export const FEED_QUERY = `*[_type == "feedPost"] | order(publishedAt desc){
  _id, text, publishedAt, linkedinUrl, reactions, comments,
  "images": images[]{ "url": asset->url, alt }
}`

export const mapFeed = rows => rows.map(r => ({
  id: r._id,
  text: r.text || '',
  date: r.publishedAt,
  url: r.linkedinUrl || '',
  reactions: typeof r.reactions === 'number' ? r.reactions : null,
  comments: typeof r.comments === 'number' ? r.comments : null,
  images: (r.images || []).filter(i => i.url).map(i => ({
    src: sized(i.url, 1600),
    thumb: sized(i.url, 800),
    alt: i.alt || '',
  })),
}))

