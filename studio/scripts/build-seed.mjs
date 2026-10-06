// Builds seed/content.ndjson from the site's current built-in content
// (src/data/newsData.js, src/pages/blogData.js) so it can be imported into
// Sanity instead of retyped:
//
//   node scripts/build-seed.mjs
//   npx sanity dataset import seed/content.ndjson production --replace
//
// Document ids are fixed (news-1, blog-<slug> ...), so re-running the import
// with --replace updates the same documents instead of duplicating them.
// Photos are referenced by URL; the importer downloads them into Sanity.
import {writeFileSync} from 'node:fs'
import {NEWS} from '../../src/data/newsData.js'
import {BLOG_POSTS} from '../../src/pages/blogData.js'

const key = (() => {
  let n = 0
  return () => `k${(++n).toString(36).padStart(4, '0')}`
})()

const MONTHS = {Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12}
const monthYearToDate = (label) => {
  const [m, y] = label.split(' ')
  return `${y}-${String(MONTHS[m]).padStart(2, '0')}-01`
}

const FEED_IMAGES = [
  "https://media.licdn.com/dms/image/v2/D5622AQGZexHYGEdsQw/feedshare-image-high-res/B56Z5pZDacGgAU-/0/1779884636275?e=2147483647&v=beta&t=2yM4iW_AD0N0R5gWqeR-Edn9uDR-Mup6LchHXi5Iem8",
  "https://media.licdn.com/dms/image/v2/D5622AQEQah1RrU_Tog/feedshare-image-high-res/B56Z5pZD1dGsAU-/0/1779884638002?e=2147483647&v=beta&t=K-dKJ_jFPwEmJO6y3eG04X_Tu7j_bzbtell_nB_8CJ0",
  "https://media.licdn.com/dms/image/v2/D5622AQEAuxyl1cR8TQ/feedshare-image-high-res/B56Z5pZEGaJIAU-/0/1779884643701?e=2147483647&v=beta&t=cWzWXZqWwFRKz57yFGUyFDiAR7lobE4LWGoVv1lhxxs",
  "https://media.licdn.com/dms/image/v2/D5622AQFFMFtWRmQj2w/feedshare-shrink_800/B56Z5pZEEyJsAc-/0/1779884642889?e=2147483647&v=beta&t=nezATuMq9Mms3S7rwDkJh7unvy_xVbiwR6JBQeR0hDs",
  "https://media.licdn.com/dms/image/v2/D5622AQH0AcfYmW6Vpg/feedshare-image-high-res/B56Z5pZEeCIsAU-/0/1779884643122?e=2147483647&v=beta&t=i6f_qjzouvabDqkrIsVDkg7MJmByBCol-Gfl8zxS9PQ"
]

const docs = []

// News: the site shows `date` as a label and keeps the array order, so
// ordering is preserved with descending timestamps within the label's year.
NEWS.forEach((n, i) => {
  const year = (n.date.match(/\d{4}/) || ['2026'])[0]
  docs.push({
    _id: `news-${i + 1}`,
    _type: 'newsItem',
    title: n.title,
    tag: n.tag,
    dateLabel: n.date,
    publishedAt: `${year}-01-01T${String(23 - i).padStart(2, '0')}:00:00Z`,
    ...(n.desc ? {desc: n.desc} : {}),
    ...(n.href ? {href: n.href} : {}),
  })
})

BLOG_POSTS.forEach((p) => {
  docs.push({
    _id: `blog-${p.slug}`,
    _type: 'blogPost',
    title: p.title,
    slug: {_type: 'slug', current: p.slug},
    tag: p.tag,
    publishedAt: monthYearToDate(p.date),
    ...(p.venue ? {venue: p.venue} : {}),
    desc: p.desc,
    images: p.images.map((url) => ({
      _type: 'image',
      _key: key(),
      alt: p.title,
      // The importer swaps this marker for a proper asset reference.
      _sanityAsset: `image@${url}`,
    })),
    body: p.paragraphs.map((text) => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: key(), text, marks: []}],
    })),
    ...(p.originalHref ? {originalHref: p.originalHref} : {}),
    ...(p.externalNote ? {externalNote: p.externalNote} : {}),
  })
})

// One real post as the first feed item: his LinkedIn announcement of a
// student's PhD completion (text, date, photos and counts as shown publicly
// on the post). Photos are fetched into Sanity by the importer.
docs.push({
  _id: 'feed-phd-ketan-2026-05',
  _type: 'feedPost',
  text:
    'One more down… happy to announce the successful PhD completion of Ketan today. Congratulations to Ketan and thank you prof Satyaki, Prof Apurva, Dr Mahesh and Dr Delwyn as examiners.\nAnd thanks to Prasad and prof Rajlakshmi for supporting him as DC members',
  publishedAt: '2026-05-27T12:24:06.041Z',
  linkedinUrl: 'https://lnkd.in/p/dAANfuq6',
  reactions: 473,
  comments: 38,
  images: FEED_IMAGES.map((url, i) => ({
    _type: 'image',
    _key: key(),
    alt: `Photo ${i + 1} from the PhD completion post`,
    _sanityAsset: `image@${url}`,
  })),
})

writeFileSync(new URL('../seed/content.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents (${NEWS.length} news, ${BLOG_POSTS.length} blog posts, 1 feed post).`)
