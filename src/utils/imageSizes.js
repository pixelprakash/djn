/* Responsive sizes for big photographs that live on someone else's image
   service. Shared by the article page (BlogPost) and the build step that writes
   a <link rel="preload"> into each article's HTML (scripts/prerender.mjs), so
   both name exactly the same files and the browser reuses the early download.

   Sanity's image CDN and Blogger's both resize from the URL. Anything else
   (e.g. an old WordPress photo) returns undefined and is used as it is. */
export const COVER_WIDTHS = [640, 1024, 1600]
export const COVER_SIZES = '(max-width: 860px) 94vw, 1300px'

export function srcSetFor(url, widths = COVER_WIDTHS) {
  if (!url) return undefined
  if (url.includes('cdn.sanity.io')) {
    const base = url.split('?')[0]
    return widths.map(w => `${base}?w=${w}&auto=format&q=80 ${w}w`).join(', ')
  }
  if (/googleusercontent\.com\/.*\/s\d+\//.test(url)) {
    return widths.map(w => `${url.replace(/\/s\d+\//, `/s${w}/`)} ${w}w`).join(', ')
  }
  return undefined
}
