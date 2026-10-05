// Shown on the home page's News & Updates section (see
// src/components/NewsSection.jsx) -- the place to post anything
// time-sensitive: admissions windows, open positions in the lab, talks,
// grants, press, newly published or accepted work. Newest first.
//
// Each entry:
//   date  -- short label, e.g. 'Mar 2026' or 'Open now'
//   tag   -- short category: 'Admissions', 'Opening', 'Publication',
//            'Patent', 'Talk', 'Announcement', 'Recognition' ...
//   title -- one line
//   desc  -- one short supporting sentence (optional)
//   href  -- optional link (internal "/cv/..." path or an external URL)
//
// Seeded for now with recent, verified publication/patent news pulled
// from the department's own publication records (see
// src/pages/CvPage.jsx's "papers-publications" entry) -- nothing here is
// placeholder copy. Add real admissions/opening entries as they come up.
export const NEWS = [
  {
    date: '2026',
    tag: 'Publication',
    title: 'Paper published in Visual Studies, Taylor & Francis',
    desc: 'Visual Ethnography of the Dandari Gusadi Festival of the Raj Gonds of Telangana, India.',
    href: '/cv/papers-publications',
  },
  {
    date: '2026',
    tag: 'Recognition',
    title: 'Cover photograph featured on Visual Studies, Vol. 41, Issue 2',
    desc: '“Gusai Mauk Dancing at the Dandari Gusadi Festival, Adilabad Telangana.”',
    href: '/cv/papers-publications',
  },
  {
    date: '2025',
    tag: 'Patent',
    title: 'Design patent granted — Autonomous Advanced Air Mobility',
    desc: 'Granted in India, with IIT Hyderabad and Ketan Madan Chaturmutha.',
    href: '/cv/papers-publications',
  },
  {
    date: '2024',
    tag: 'Patent',
    title: 'Design patent granted — Urban Air Mobility Aircraft',
    desc: 'Granted in India, with IIT Hyderabad and Ketan Madan Chaturmutha.',
    href: '/cv/papers-publications',
  },
]
