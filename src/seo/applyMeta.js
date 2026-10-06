import { SITE, HOME_TITLE, NAME, DEFAULT_IMAGE } from './routes'

/* Writes a page's title, description, canonical URL, social-preview tags and
   structured data into <head> (single-page app: there is only one HTML file,
   so each navigation has to update it). Mirrors what scripts/prerender.mjs
   writes into the static copy of each page. */

const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function applyMeta(meta) {
  const title = meta.title ? `${meta.title} — ${NAME}` : HOME_TITLE
  const url = SITE + meta.path
  const image = meta.image
    ? (meta.image.startsWith('http') ? meta.image : SITE + meta.image)
    : DEFAULT_IMAGE

  document.title = title
  setMeta('name', 'description', meta.description)
  setMeta('name', 'robots', meta.noindex ? 'noindex, follow' : 'index, follow')

  let canon = document.head.querySelector('link[rel="canonical"]')
  if (!canon) {
    canon = document.createElement('link')
    canon.rel = 'canonical'
    document.head.appendChild(canon)
  }
  canon.href = url

  setMeta('property', 'og:type', meta.type === 'article' ? 'article' : meta.type === 'profile' ? 'profile' : 'website')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', meta.description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', image)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', meta.description)
  setMeta('name', 'twitter:image', image)

  // Page-specific structured data (the site-wide Person data stays in index.html).
  let ld = document.getElementById('ld-page')
  if (meta.ld && meta.ld.length) {
    if (!ld) {
      ld = document.createElement('script')
      ld.id = 'ld-page'
      ld.type = 'application/ld+json'
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(meta.ld.length === 1 ? meta.ld[0] : meta.ld)
  } else if (ld) {
    ld.remove()
  }
}
