import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { NEWS as LOCAL_NEWS } from '../data/newsData'
import { useCms, NEWS_QUERY, mapNews } from '../lib/cms'
import './NewsSection.css'

// How many updates show before the "show all" toggle -- one row on a wide
// screen. Anything past this stays one click away instead of pushing the
// portfolio further down the page.
const VISIBLE = 4

/* Latest updates -- admissions windows, open positions, talks, newly
   published or accepted work -- as one compact band right under the hero,
   where a visitor sees time-sensitive news before they scroll into the
   portfolio, not after. Entries are edited in Sanity (see /studio); the
   built-in list in src/data/newsData.js is the fallback if that can't be
   reached. This component just renders whatever's there, newest first. */
export default function NewsSection() {
  const [all, setAll] = useState(false)
  // Text only, so showing the built-in list for the instant before the live
  // one arrives is invisible when they match.
  const { data: NEWS } = useCms('news', NEWS_QUERY, mapNews, LOCAL_NEWS)
  if (!NEWS.length) return null

  const shown = all ? NEWS : NEWS.slice(0, VISIBLE)
  const extra = NEWS.length - VISIBLE

  return (
    <section className="ns" aria-labelledby="ns-heading">
      <div className="ns-inner">
        <div className="ns-head">
          <h2 className="ns-heading" id="ns-heading">News &amp; Updates</h2>
          <p className="ns-sub">Admissions, openings, talks, and recent work.</p>
        </div>

        <div className="ns-grid">
          {shown.map((item, i) => {
            // Internal paths ("/cv/...") route through React Router's Link;
            // anything else is a plain external anchor. Items with no href
            // at all render as an inert card (an announcement with nowhere
            // to click through to).
            const external = Boolean(item.href) && !item.href.startsWith('/')
            const internal = Boolean(item.href) && !external

            return (
              <Reveal
                as={internal ? Link : external ? 'a' : 'div'}
                key={item.title}
                to={internal ? item.href : undefined}
                href={external ? item.href : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={`ns-item${item.href ? ' ns-item--link' : ''}`}
                delay={(i % 4) * 0.05}
              >
                <div className="ns-meta">
                  <span className="ns-tag">{item.tag}</span>
                  <span className="ns-date">{item.date}</span>
                </div>
                <h3 className="ns-title">{item.title}</h3>
                {item.desc && <p className="ns-desc">{item.desc}</p>}
                {item.href && (
                  <span className="ns-arrow" aria-hidden="true">
                    {external ? '↗' : '→'}
                  </span>
                )}
              </Reveal>
            )
          })}
        </div>

        {extra > 0 && (
          <button
            type="button"
            className="ns-more"
            aria-expanded={all}
            onClick={() => setAll(v => !v)}
          >
            {all ? 'Show fewer' : `Show all ${NEWS.length} updates`}
          </button>
        )}
      </div>
    </section>
  )
}
