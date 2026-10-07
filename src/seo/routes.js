/* One source of truth for what each page is called and described, used by
   - the browser (usePageTitle -> applyMeta) when you navigate, and
   - scripts/prerender.mjs at build time, which writes real HTML files with
     these tags in place for every page, so search engines and link previews
     (which don't run the site's JavaScript) see the right title, description
     and image for each URL.
   Pure JS on purpose: no React, no CSS imports, so Node can load it. */

export const SITE = 'https://djn.vercel.app'
export const NAME = 'Deepak John Mathew'
export const HOME_TITLE = 'Deepak John Mathew — Professor of Design, IIT Hyderabad'
export const DEFAULT_IMAGE = `${SITE}/og-image.jpg`
const WHO = 'Prof. Deepak John Mathew'

export const CV_TITLES = {
  'educational-qualifications': 'Educational Qualifications',
  'scholarships-awards': 'Scholarships & Awards',
  'professional-experience': 'Professional Experience',
  'teaching-experience': 'Teaching Experience & Permanent Posts',
  'thesis-guidance': 'Thesis Guidance',
  'visiting-appointments': 'Visiting Appointments',
  'sponsored-projects': 'Sponsored Projects',
  'solo-shows': 'Solo Shows',
  'selected-exhibitions': 'Selected Exhibitions',
  books: 'Books',
  'papers-publications': 'Papers & Publications',
  'training-programs': 'Training Programs',
  'conferences-journals': 'Conferences & Journals',
}

const clip = (t, n = 158) => {
  const s = (t || '').replace(/\s+/g, ' ').trim()
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'
}

// 'Nov 2013' -> '2013-11'  (partial ISO dates are valid for schema.org)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const isoFromLabel = label => {
  const [m, y] = String(label || '').split(' ')
  const i = MONTHS.indexOf(m)
  return y && i >= 0 ? `${y}-${String(i + 1).padStart(2, '0')}` : undefined
}

const crumbs = trail => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/about'], ...trail].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: SITE + path,
  })),
})

/* Every builder returns { title, description, path, type, image?, ld[] }.
   `title` is the page's own name (the site name is appended); null means the
   home page, which uses HOME_TITLE as is. */

export const homeMeta = () => ({
  title: null,
  description:
    'Deepak John Mathew is Professor and Founding Head of Design at IIT Hyderabad, specializing in digital heritage, AR/VR, photography and design innovation.',
  path: '/about',
  type: 'website',
  ld: [],
})

export const workMeta = () => ({
  title: 'Work',
  description:
    'Photography projects, sponsored research and exhibitions by Prof. Deepak John Mathew, spanning three decades of design research, digital heritage and image-making.',
  path: '/work',
  type: 'website',
  ld: [crumbs([['Work', '/work']])],
})

export const resumeMeta = () => ({
  title: 'Resume',
  description:
    'Résumé of Prof. Deepak John Mathew, Professor of Design at IIT Hyderabad: academic positions, education, awards, selected publications and research areas.',
  path: '/resume',
  type: 'profile',
  ld: [
    crumbs([['Resume', '/resume']]),
    { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@type': 'Person', name: NAME, url: SITE + '/' } },
  ],
})

export const blogsMeta = () => ({
  title: 'Blogs',
  description:
    'Notes, exhibitions, workshops and updates from Prof. Deepak John Mathew on photography, design research and education.',
  path: '/blogs',
  type: 'website',
  ld: [crumbs([['Blogs', '/blogs']])],
})

export const newsMeta = () => ({
  title: 'News & Updates',
  description:
    'Announcements, admissions, openings, talks and recent work from Prof. Deepak John Mathew at IIT Hyderabad.',
  path: '/news',
  type: 'website',
  ld: [crumbs([['News & Updates', '/news']])],
})

export const newsPostMeta = post => {
  const path = `/news/${post.slug}`
  const title = post.title || clip(post.text, 70)
  const iso = post.iso || (post.date ? String(post.date).slice(0, 10) : undefined)
  const image = post.image || (post.images && post.images[0] && post.images[0].src)
  return {
    title,
    description: clip(post.text),
    path,
    type: 'article',
    image,
    ld: [
      crumbs([['News & Updates', '/news'], [title, path]]),
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: clip(post.text),
        ...(iso ? { datePublished: iso } : {}),
        ...(image ? { image } : {}),
        author: { '@type': 'Person', name: NAME, url: SITE + '/' },
        mainEntityOfPage: SITE + path,
      },
    ],
  }
}

export const contactMeta = () => ({
  title: 'Contact',
  description:
    'Get in touch with Prof. Deepak John Mathew at IIT Hyderabad for research collaborations, speaking engagements and academic partnerships.',
  path: '/contact',
  type: 'website',
  ld: [crumbs([['Contact', '/contact']])],
})

export const labMeta = () => ({
  title: 'DIC Lab',
  description:
    'The Design Innovation Centre (DIC) at IIT Hyderabad: interdisciplinary design research and innovation.',
  path: '/lab',
  type: 'website',
  ld: [crumbs([['DIC Lab', '/lab']])],
})

export const cvMeta = slug => {
  const t = CV_TITLES[slug] || 'Résumé'
  const path = `/cv/${slug}`
  return {
    title: t,
    description: `${t}: part of the curriculum vitae of ${WHO}, Professor of Design at IIT Hyderabad.`,
    path,
    type: 'website',
    ld: [crumbs([['Resume', '/resume'], [t, path]])],
  }
}

export const projectMeta = p => {
  const path = `/work/${p.slug}`
  const kind = (p.category || 'project').toLowerCase()
  return {
    title: p.title,
    description: clip(`${p.title}${p.year ? ` (${p.year})` : ''}: a ${kind} by ${WHO}${p.venue ? `, ${p.venue}` : ''}.`),
    path,
    type: 'article',
    image: p.cover,
    ld: [
      crumbs([['Work', '/work'], [p.title, path]]),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: p.title,
        creator: { '@type': 'Person', name: NAME },
        ...(p.year ? { dateCreated: String(p.year) } : {}),
        ...(p.cover ? { image: p.cover } : {}),
        url: SITE + path,
      },
    ],
  }
}

export const postMeta = post => {
  const path = `/blogs/${post.slug}`
  const iso = post.iso || isoFromLabel(post.date)
  return {
    title: post.title,
    description: clip(post.desc),
    path,
    type: 'article',
    image: (post.images && post.images[0]) || post.image,
    ld: [
      crumbs([['Blogs', '/blogs'], [post.title, path]]),
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: clip(post.desc),
        ...(iso ? { datePublished: iso } : {}),
        ...((post.images && post.images[0]) || post.image ? { image: (post.images && post.images[0]) || post.image } : {}),
        author: { '@type': 'Person', name: NAME, url: SITE + '/' },
        mainEntityOfPage: SITE + path,
      },
    ],
  }
}

export const notFoundMeta = () => ({
  title: 'Page not found',
  description: 'This page could not be found.',
  path: '/404',
  type: 'website',
  noindex: true,
  ld: [],
})
