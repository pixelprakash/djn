// Runs after `vite build` (see package.json). The site is a single-page app, so
// every address would otherwise be served the same index.html with the same
// title and description -- which is all that search engines and link previews
// (Slack, WhatsApp, LinkedIn...) read without running JavaScript. This writes
// a copy of index.html per page with that page's own <head> filled in, plus a
// short <noscript> summary, and regenerates sitemap.xml from the same list.
//
// Vercel serves dist/about.html at /about (cleanUrls) before falling back to
// the single-page app, so these are what a crawler receives. The app still
// takes over in the browser exactly as before.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE, NAME, HOME_TITLE, DEFAULT_IMAGE, CV_TITLES,
  homeMeta, workMeta, resumeMeta, blogsMeta, newsMeta, newsPostMeta, contactMeta, labMeta, cvMeta, projectMeta, postMeta,
} from '../src/seo/routes.js'
import { PROJECTS } from '../src/pages/projectData.js'
import { BLOG_POSTS } from '../src/pages/blogData.js'
import { srcSetFor, COVER_SIZES } from '../src/utils/imageSizes.js'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Blog posts published in the CMS (Sanity) are included if it can be reached.
// A post published later is still found by the app and gets its tags in the
// browser; it joins the static pages on the next deploy.
async function cmsPosts() {
  const API = 'https://q6natj20.apicdn.sanity.io/v2025-01-01/data/query/production'
  const groq = '*[_type=="blogPost" && defined(slug.current)]|order(publishedAt desc){"slug":slug.current,title,publishedAt,desc,"image":images[0].asset->url}'
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { result } = await res.json()
    return (result || []).map(p => ({
      slug: p.slug, title: p.title, desc: p.desc || '',
      iso: p.publishedAt ? p.publishedAt.slice(0, 10) : undefined,
      image: p.image ? `${p.image}?w=1200&h=630&fit=crop&auto=format` : undefined,
      cover: p.image,
    }))
  } catch (e) {
    console.warn(`[prerender] could not read the CMS (${e.message}); using the built-in posts only`)
    return []
  }
}

// News & updates published in the CMS get their own page too.
async function cmsNews() {
  const API = 'https://q6natj20.apicdn.sanity.io/v2025-01-01/data/query/production'
  const groq = '*[_type=="feedPost"]|order(publishedAt desc){"slug":coalesce(slug.current,_id),title,text,publishedAt,"image":images[0].asset->url}'
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { result } = await res.json()
    return (result || []).map(p => ({
      slug: p.slug, title: p.title || '', text: p.text || '',
      iso: p.publishedAt ? p.publishedAt.slice(0, 10) : undefined,
      image: p.image ? `${p.image}?w=1200&h=630&fit=crop&auto=format` : undefined,
    }))
  } catch (e) {
    console.warn(`[prerender] could not read the news (${e.message}); /news is written without per-update pages`)
    return []
  }
}

const live = await cmsPosts()
const news = await cmsNews()
const posts = [...live, ...BLOG_POSTS.filter(p => !live.some(l => l.slug === p.slug))]

const pages = [
  homeMeta(), workMeta(), resumeMeta(), blogsMeta(), newsMeta(), contactMeta(), labMeta(),
  ...Object.keys(CV_TITLES).map(cvMeta),
  ...PROJECTS.map(projectMeta),
  ...posts.map(p => ({ ...postMeta(p), cover: p.cover || (p.images && p.images[0]) })),
  ...news.map(newsPostMeta),
]

function swap(html, re, value, label) {
  if (!re.test(html)) { console.warn(`[prerender] template has no ${label}`); return html }
  return html.replace(re, () => value)
}

// The hero portrait is the largest thing on Home and Resume. It is only
// discovered once the app has run, so say so up front and it downloads in
// parallel with the app's code instead of after it.
const PORTRAIT_PAGES = new Set(['/about', '/resume'])
const portraitPreload = `    <link rel="preload" as="image" href="/profliepicnobg-900.webp" imagesrcset="/profliepicnobg-560.webp 560w, /profliepicnobg-900.webp 900w, /profliepicnobg.webp 1380w" imagesizes="(max-width: 860px) 300px, 560px" fetchpriority="high" />\n`

function render(meta) {
  const title = meta.title ? `${meta.title} — ${NAME}` : HOME_TITLE
  const url = SITE + meta.path
  const image = meta.image ? (meta.image.startsWith('http') ? meta.image : SITE + meta.image) : DEFAULT_IMAGE
  const kind = meta.type === 'article' ? 'article' : meta.type === 'profile' ? 'profile' : 'website'
  let h = template
  h = swap(h, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, '<title>')
  h = swap(h, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`, 'description')
  h = swap(h, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}" />`, 'robots')
  h = swap(h, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  h = swap(h, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${kind}" />`, 'og:type')
  h = swap(h, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`, 'og:title')
  h = swap(h, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(meta.description)}" />`, 'og:description')
  h = swap(h, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  h = swap(h, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}" />`, 'og:image')
  h = swap(h, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`, 'twitter:title')
  h = swap(h, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(meta.description)}" />`, 'twitter:description')
  h = swap(h, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(image)}" />`, 'twitter:image')

  // An article's cover is its largest element: start fetching it with the HTML.
  const coverSet = meta.cover && srcSetFor(meta.cover)
  if (coverSet) {
    h = h.replace('</head>', () => `    <link rel="preload" as="image" imagesrcset="${esc(coverSet)}" imagesizes="${COVER_SIZES}" fetchpriority="high" />\n  </head>`)
  }

  if (PORTRAIT_PAGES.has(meta.path)) h = h.replace('</head>', () => portraitPreload + '  </head>')

  if (meta.ld && meta.ld.length) {
    const json = JSON.stringify(meta.ld.length === 1 ? meta.ld[0] : meta.ld).replace(/</g, '\\u003c')
    h = h.replace('</head>', () => `    <script id="ld-page" type="application/ld+json">${json}</script>\n  </head>`)
  }

  // Visible only with JavaScript off (and read by crawlers that don't run it).
  const nav = [['About', '/about'], ['Work', '/work'], ['Resume', '/resume'], ['News', '/news'], ['Blogs', '/blogs'], ['Contact', '/contact']]
    .map(([n, p]) => `<a href="${p}">${n}</a>`).join(' · ')
  const body = `<noscript><main><h1>${esc(meta.title || NAME)}</h1><p>${esc(meta.description)}</p><nav>${nav}</nav></main></noscript>`
  h = h.replace('<div id="root"></div>', () => `<div id="root"></div>\n    ${body}`)
  return h
}

let written = 0
for (const meta of pages) {
  const html = render(meta)
  if (meta.path === '/about') writeFileSync(join(DIST, 'index.html'), html) // "/" redirects to /about
  const file = join(DIST, meta.path.replace(/^\//, '') + '.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  written++
}

const today = new Date().toISOString().slice(0, 10)
const urls = pages.map(m => `  <url><loc>${SITE}${m.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

console.log(`[prerender] wrote ${written} pages and sitemap.xml (${posts.length} blog posts, ${news.length} news updates, ${PROJECTS.length} projects, ${Object.keys(CV_TITLES).length} CV pages)`)
