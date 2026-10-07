import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PostCard from '../components/PostCard'
import usePageTitle from '../hooks/usePageTitle'
import useStackedLayers from '../hooks/useStackedLayers'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { Deadline, Cta } from '../components/NewsBits'
import { closingInfo, newsPath } from '../lib/news'
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
  const countFor = t => (t === 'All' ? feed.length : feed.filter(p => p.topic === t).length)

  // Calls that are still open (a deadline that has not passed), soonest first.
  const openNow = useMemo(
    () => feed
      .filter(p => p.closesOn && closingInfo(p.closesOn)?.state !== 'closed')
      .sort((a, b) => a.closesOn.localeCompare(b.closesOn)),
    [feed],
  )
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
        {openNow.length > 0 && (
          <section className="nw-open" aria-labelledby="nw-open-title">
            <h2 className="nw-open-title" id="nw-open-title">
              <span className="nw-open-dot" aria-hidden="true" />
              Open now
            </h2>
            <ul className="nw-open-list">
              {openNow.map(p => (
                <li className="nw-open-item" key={p.id}>
                  <div className="nw-open-text">
                    {p.topic && <span className="nw-open-topic">{p.topic}</span>}
                    <Link className="nw-open-name" to={newsPath(p)}>{p.title || p.text.split('\n')[0]}</Link>
                    <Deadline closesOn={p.closesOn} />
                  </div>
                  {p.cta
                    ? <Cta cta={p.cta} />
                    : <Link className="nw-open-more" to={newsPath(p)}>Details <span aria-hidden="true">&rarr;</span></Link>}
                </li>
              ))}
            </ul>
          </section>
        )}

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
                {t} <span className="nw-chip-n">{countFor(t)}</span>
              </button>
            ))}
          </div>
        )}

        <p className="nw-count" role="status" aria-live="polite">
          {loading ? '' : `${shown.length} ${shown.length === 1 ? 'update' : 'updates'}${current === 'All' ? '' : ` in ${current}`}`}
        </p>

        {shown.length > 0 ? (
          <div className="nw-grid">
            {shown.map((post, i) => {
              // With three or more, the first update leads: two columns wide,
              // picture beside text. The rest fill rows of equal-height cards.
              const lead = i === 0 && shown.length >= 3
              return (
                <div className={`nw-cell${lead ? ' nw-cell--lead' : ''}`} key={post.id}>
                  <PostCard post={post} wide={lead} />
                </div>
              )
            })}
          </div>
        ) : (
          !loading && <p className="nw-empty">Nothing here yet.</p>
        )}
      </div>
    </div>
  )
}
