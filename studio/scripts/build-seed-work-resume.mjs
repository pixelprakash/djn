// Builds seed/work-resume.ndjson from what the Work, Resume and CV pages show
// today, so it can be loaded into Sanity instead of retyped:
//
//   node scripts/build-seed-work-resume.mjs
//   npx sanity dataset import seed/work-resume.ndjson production --replace
//
// Document ids are fixed (project-<slug>, resume-award-3 ...), so running the
// import again with --replace updates the same documents instead of duplicating
// them. Photos are referenced by URL; the importer downloads them into Sanity.
import {writeFileSync} from 'node:fs'
import {PROJECTS} from '../../src/pages/projectData.js'
import {SPONSORED, SOLO_SHOWS, EXHIBITIONS} from '../../src/pages/exhibitionData.js'
import {positions, education, awards, papers, researchAreas} from '../../src/pages/resumeData.js'
import {PAGES} from '../../src/pages/cvData.js'
import {SOCIALS} from '../../src/data/socials.js'
import {homeMeta} from '../../src/seo/routes.js'

const key = (() => {
  let n = 0
  return () => `k${(++n).toString(36).padStart(4, '0')}`
})()
const image = (url, extra = {}) => ({_type: 'image', _key: key(), _sanityAsset: `image@${url}`, ...extra})

const docs = []

/* ── Work: photography projects ── */
PROJECTS.forEach((p, i) => {
  docs.push({
    _id: `project-${p.slug}`,
    _type: 'project',
    title: p.title,
    slug: {_type: 'slug', current: p.slug},
    category: p.category,
    year: String(p.year),
    venue: p.venue,
    order: i + 1,
    cover: {_type: 'image', _sanityAsset: `image@${p.cover}`, alt: p.title},
    sections: p.sections.map((sec) => ({
      _type: 'part',
      _key: key(),
      ...(sec.text ? {text: sec.text} : {}),
      photos: [...new Set(sec.images)].map((u) => image(u)),
    })),
  })
})

/* ── Work: sponsored projects and exhibitions ── */
SPONSORED.forEach((s, i) => {
  docs.push({
    _id: `sponsored-${i + 1}`,
    _type: 'sponsoredProject',
    title: s.title,
    year: String(s.year),
    role: s.role,
    funder: s.funder,
    order: i + 1,
    ...(s.amount ? {amount: s.amount} : {}),
  })
})
SOLO_SHOWS.forEach((e, i) => {
  docs.push({_id: `exhibition-solo-${i + 1}`, _type: 'exhibition', kind: 'solo', title: e.title, year: String(e.year), venue: e.venue, order: i + 1})
})
EXHIBITIONS.forEach((e, i) => {
  docs.push({_id: `exhibition-group-${i + 1}`, _type: 'exhibition', kind: 'group', title: e.title, year: String(e.year), venue: e.venue, order: i + 1})
})

/* ── Whole-site pages: About (home) and Site settings ── */
docs.push({
  _id: 'aboutPage',
  _type: 'aboutPage',
  name: 'Prof. Deepak John Mathew',
  roleLine: [
    {
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [
        {_key: 'dept', _type: 'link', href: 'https://design.iith.ac.in'},
        {_key: 'inst', _type: 'link', href: 'https://www.iith.ac.in'},
      ],
      children: [
        {_type: 'span', _key: key(), text: 'Professor & Founding head of ', marks: []},
        {_type: 'span', _key: key(), text: 'Design Dept', marks: ['dept']},
        {_type: 'span', _key: key(), text: ' at ', marks: []},
        {_type: 'span', _key: key(), text: 'IIT Hyderabad', marks: ['inst']},
      ],
    },
  ],
  bio: 'A designer, researcher, and creative artist at heart \u2014 driven by curiosity, mentorship, and a hands-on love of experimentation.',
  interests: ['Photography', 'Painting & Printmaking', 'Design Education', 'Heritage Preservation', 'Design Research', 'VR & Immersive World', 'Sustainable Design'],
})
docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  place: 'Indian Institute of Technology Hyderabad',
  addressLines: 'Kandi, Sangareddy\nTelangana 502284, India',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Indian+Institute+of+Technology+Hyderabad+Kandi+Sangareddy',
  socials: [
    ...SOCIALS.map((s) => ({_key: key(), _type: 'social', label: s.label, url: s.href})),
    {_key: key(), _type: 'social', label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Deepak-Mathew-3'},
  ],
  siteDescription: homeMeta().description,
})

/* ── Resume page ── */
docs.push({
  _id: 'resumePage',
  _type: 'resumePage',
  nodalLine: 'Principal Investigator & Nodal Coordinator, Design Innovation Centre\nMinistry of Education, Govt. of India',
  researchAreas,
  headerLinks: [
    {_key: key(), text: 'deepakjohnmathew.net', url: 'https://deepakjohnmathew.net'},
    {_key: key(), text: 'IIT Profile', url: 'https://design.iith.ac.in/iitdesign_peoples/deepak-john-mathew-phd/'},
    {_key: key(), text: 'Scholar', url: 'https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ'},
    {_key: key(), text: 'LinkedIn', url: 'https://www.linkedin.com/in/deepak-john-mathew-b079ab1a/'},
  ],
  profileGroups: [
    {
      _key: key(),
      label: 'Academic',
      links: [
        {_key: key(), text: 'ResearchGate', url: 'https://www.researchgate.net/profile/Deepak-Mathew-3'},
        {_key: key(), text: 'Academia.edu', url: 'https://nid.academia.edu/DeepakMathew'},
      ],
    },
    {_key: key(), label: 'Gallery', links: [{_key: key(), text: 'Gallery Ragini', url: 'https://galleryragini.com/deepak-john-mathew/'}]},
    {
      _key: key(),
      label: 'Social',
      links: [
        {_key: key(), text: 'Instagram', url: 'https://www.instagram.com/deepakjohnmathew/'},
        {_key: key(), text: 'Facebook', url: 'https://www.facebook.com/deepakjohnmathew/'},
      ],
    },
  ],
})
positions.forEach((p, i) => docs.push({_id: `resume-position-${i + 1}`, _type: 'position', role: p.role, org: p.org, period: p.period, order: i + 1}))
education.forEach((e, i) =>
  docs.push({_id: `resume-education-${i + 1}`, _type: 'education', degree: e.degree, institution: e.inst, year: String(e.year), order: i + 1}),
)
awards.forEach((a, i) => docs.push({_id: `resume-award-${i + 1}`, _type: 'award', text: a.text, year: String(a.year), order: i + 1}))
papers.forEach((p, i) =>
  docs.push({_id: `resume-publication-${i + 1}`, _type: 'publication', title: p.title, venue: p.venue, year: String(p.year), order: i + 1}),
)

/* ── CV detail pages (/cv/<slug>) ── */
for (const [slug, page] of Object.entries(PAGES)) {
  docs.push({
    _id: `cv-${slug}`,
    _type: 'cvPage',
    title: page.title,
    slug: {_type: 'slug', current: slug},
    parent: page.parent.label.toLowerCase(),
    sections: page.sections.map((sec) => ({
      _type: 'cvSection',
      _key: key(),
      heading: sec.heading,
      items: sec.items.map((it) =>
        typeof it === 'string'
          ? {_type: 'cvItem', _key: key(), text: it}
          : {_type: 'cvItem', _key: key(), text: it.text, ...(it.href ? {link: it.href} : {})},
      ),
    })),
  })
}

writeFileSync(new URL('../seed/work-resume.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
const count = (t) => docs.filter((d) => d._type === t).length
console.log(
  `Wrote ${docs.length} documents: ${count('project')} projects, ${count('sponsoredProject')} sponsored, ${count('exhibition')} exhibitions, ` +
    `${count('position')} positions, ${count('education')} education, ${count('award')} awards, ${count('publication')} publications, ` +
    `${count('cvPage')} CV pages, 1 resume header, About page, site settings.`,
)
