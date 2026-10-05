import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { NEWS } from '../data/newsData'
import './NewsSection.css'

/* Compact list of time-sensitive updates -- admissions windows, open
   positions, talks, newly published or accepted work -- on the home
   page, between the portfolio (WorksTimeline) and the footer. See
   src/data/newsData.js to add entries; this component just renders
   whatever's there. */
export default function NewsSection() {
  if (!NEWS.length) return null

  return (
    <section className="ns" aria-labelledby="ns-heading">
      <div className="ns-inner">
        <div className="ns-head">
          <h2 className="ns-heading" id="ns-heading">News &amp; Updates</h2>
          <p className="ns-sub">Admissions, openings, talks, and recent work.</p>
        </div>

        <div className="ns-list">
          {NEWS.map((item, i) => {
            // Internal paths ("/cv/...") route through React Router's Link;
            // anything else is a plain external anchor. Items with no href
            // at all render as an inert row (an announcement with nowhere
            // to click through to).
            const external = Boolean(item.href) && !item.href.startsWith('/')
            const internal = Boolean(item.href) && !external

            return (
              <Reveal
                as={internal ? Link : external ? 'a' : 'div'}
                key={i}
                to={internal ? item.href : undefined}
                href={external ? item.href : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={`ns-item${item.href ? ' ns-item--link' : ''}`}
                delay={(i % 4) * 0.05}
              >
                <span className="ns-date">{item.date}</span>
                <div className="ns-body">
                  <span className="ns-tag">{item.tag}</span>
                  <h3 className="ns-title">{item.title}</h3>
                  {item.desc && <p className="ns-desc">{item.desc}</p>}
                </div>
                {item.href && (
                  <span className="ns-arrow" aria-hidden="true">
                    {external ? '↗' : '→'}
                  </span>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
