// The one list of his social profiles. Used by About.jsx (hero), Footer.jsx,
// the Contact page and the Resume page, so they can never drift apart.
// `handle` is what the Contact page shows beside the name.
export const SOCIALS = [
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ',   icon: 'scholar',   handle: 'View publications' },
  { label: 'LinkedIn',       href: 'https://www.linkedin.com/in/deepak-john-mathew-b079ab1a/',        icon: 'linkedin',  handle: 'Deepak John Mathew' },
  { label: 'Instagram',      href: 'https://www.instagram.com/deepakjohnmathew/',                    icon: 'instagram', handle: '@deepakjohnmathew' },
  { label: 'Facebook',       href: 'https://www.facebook.com/deepakjohnmathew/',                     icon: 'facebook',  handle: 'Deepak John Mathew' },
]

export const social = label => SOCIALS.find(s => s.label === label)
