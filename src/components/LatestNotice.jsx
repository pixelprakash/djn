import { Link } from 'react-router-dom'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { closingInfo, isFresh, newsPath } from '../lib/news'
import './LatestNotice.css'

/* A slim one-line bar at the very top of the home page (Option 2) for the one
   update a visitor should not miss: a call that is still open (soonest deadline
   first), else the newest update if it is under three days old. Nothing current,
   nothing shown. It reads the same cached feed as the News section. */
export default function LatestNotice() {
  const { data: feed } = useCms('feed', FEED_QUERY, mapFeed, [])

  const open = feed
    .filter(p => p.closesOn && closingInfo(p.closesOn)?.state !== 'closed')
    .sort((a, b) => a.closesOn.localeCompare(b.closesOn))[0]
  const fresh = feed.filter(p => isFresh(p.date)).sort((a, b) => b.date.localeCompare(a.date))[0]
  const item = open || fresh
  if (!item) return null

  const c = open ? closingInfo(item.closesOn) : null
  return (
    <aside className="ln" aria-label="Latest news">
      <Link className="ln-link" to={newsPath(item)}>
        <span className="ln-tag">{open ? 'Open now' : 'New'}</span>
        <span className="ln-title">{item.title || item.text.split('\n')[0]}</span>
        {c && <span className="ln-when">{c.label}</span>}
        <span className="ln-go" aria-hidden="true">&rarr;</span>
      </Link>
    </aside>
  )
}
