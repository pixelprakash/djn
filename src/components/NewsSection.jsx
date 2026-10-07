import { useState } from 'react'
import Reveal from './Reveal'
import PostCard from './PostCard'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import './NewsSection.css'

// How many cards show before the "show all" toggle. Anything past this stays
// one click away instead of pushing the portfolio further down the page.
const VISIBLE = 4

// LinkedIn's own embed of a post, shown first. Add more ids here.
const LINKEDIN_EMBEDS = [
  { id: 'urn:li:ugcPost:7390652751124439040', height: 1468 },
]

/* News, updates and announcements -- admissions windows, awards, talks,
   workshops, newly published work -- laid out like the LinkedIn posts they
   come from (PostCard), right under the hero so time-sensitive news is seen
   before the portfolio, not after. Entries are "News, update or
   announcement" documents in Sanity (see /studio); pinned ones come first,
   then newest. Blog articles are a separate thing and live on /blogs. */
export default function NewsSection() {
  const [all, setAll] = useState(false)
  const { data: feed } = useCms('feed', FEED_QUERY, mapFeed, [])

  const items = [
    ...LINKEDIN_EMBEDS.map(e => ({ kind: 'embed', key: e.id, ...e })),
    ...feed.map(post => ({ kind: 'post', key: post.id, post })),
  ]
  if (!items.length) return null

  const shown = all ? items : items.slice(0, VISIBLE)
  const extra = items.length - VISIBLE

  return (
    <section className="ns" aria-labelledby="ns-heading">
      <div className="ns-inner">
        <div className="ns-head">
          <h2 className="ns-heading" id="ns-heading">News &amp; Updates</h2>
          <p className="ns-sub">Announcements, admissions, talks, and recent work.</p>
          <a
            className="ns-follow"
            href="https://www.linkedin.com/in/deepak-john-mathew-b079ab1a/"
            target="_blank"
            rel="noreferrer"
          >
            Follow on LinkedIn <span aria-hidden="true">&#8599;</span>
          </a>
        </div>

        <div className="ns-grid">
          {shown.map((item, i) => (
            <Reveal className="ns-cell" key={item.key} delay={(i % 2) * 0.05}>
              {item.kind === 'embed' ? (
                <div className="ns-embed">
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${item.id}`}
                    title="LinkedIn post by Deepak John Mathew"
                    loading="lazy"
                    height={item.height}
                    allowFullScreen
                  />
                </div>
              ) : (
                <PostCard post={item.post} />
              )}
            </Reveal>
          ))}
        </div>

        {extra > 0 && (
          <button
            type="button"
            className="ns-more"
            aria-expanded={all}
            onClick={() => setAll(v => !v)}
          >
            {all ? 'Show fewer' : `Show all ${items.length} updates`}
          </button>
        )}
      </div>
    </section>
  )
}
