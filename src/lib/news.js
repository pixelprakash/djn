// Small helpers shared by the home band, the /news archive, the per-update
// page and the card -- dates, deadlines, addresses.

export const fmtDate = iso => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const newsPath = post => `/news/${post.slug}`

/* Where an update stands against its optional "closes on" date (a plain
   YYYY-MM-DD, compared by calendar day in the visitor's time zone, so it is
   still open all day on the day itself).
   state: 'open' | 'soon' (two weeks or less) | 'closed'. */
export function closingInfo(closesOn) {
  if (!closesOn) return null
  const [y, m, d] = closesOn.split('-').map(Number)
  if (!y || !m || !d) return null
  const end = new Date(y, m - 1, d)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((end - today) / 86400000)
  const date = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  if (days < 0) return { state: 'closed', label: `Closed ${date}`, date }
  if (days === 0) return { state: 'soon', label: 'Closes today', date }
  if (days === 1) return { state: 'soon', label: 'Closes tomorrow', date }
  if (days <= 14) return { state: 'soon', label: `Closes in ${days} days`, date }
  return { state: 'open', label: `Closes ${date}`, date }
}

// Not yet past its closing date (or has none). The home page shows only
// these; the archive keeps everything, with a "Closed" label.
export const isOpen = post => {
  const c = closingInfo(post.closesOn)
  return !c || c.state !== 'closed'
}
