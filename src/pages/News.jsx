import { useMemo, useRef, useState } from 'react'
import PageHero from '../components/PageHero'
import PostCard from '../components/PostCard'
import usePageTitle from '../hooks/usePageTitle'
import useStackedLayers from '../hooks/useStackedLayers'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { newsMeta } from '../seo/routes'
import './News.css'

/* Every update, newest first (pinned on top), filterable by topic. The home
   page shows only the latest few that are still open; this is the full
   record, including closed calls (marked as such on their cards). */
export default function News() {
  usePageTitle(newsMeta())
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const [active, setActive] = useState('All')
  const { data: feed, loading } = useCms('feed', FEED_QUERY, mapFeed, [])

  const topics = useMemo(() => ['All', ...new Set(feed.map(p => p.topic).filter(Boolean))], [feed])
  // A topic that no longer exists (content changed under us) falls back to All.
  const current = topics.includes(active) ? active : 'All'
  const shown = current === 'All' ? feed : feed.filter(p => p.topic === current)

  return (
    <div className="nw" ref={pageRef}>
      <PageHero
        title="News &amp; Updates"
        sub="Announcements, admissions, openings, talks, and recent work."
      />

      <div className="nw-sheet">
        {topics.length > 2 && (
          <div className="nw-filters" role="group" aria-label="Filter by topic">
            {topics.map(t => (
              <button
                key={t}
                type="button"
                className={`nw-chip${current === t ? ' nw-chip--on' : ''}`}
                aria-pressed={current === t}
                onClick={() => setActive(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <p className="nw-count" role="status" aria-live="polite">
          {loading ? '' : `${shown.length} ${shown.length === 1 ? 'update' : 'updates'}${current === 'All' ? '' : ` in ${current}`}`}
        </p>

        {shown.length > 0 ? (
          <div className="nw-grid">
            {shown.map(post => (
              <div className="nw-cell" key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="nw-empty">Nothing here yet.</p>
        )}
      </div>
    </div>
  )
}
