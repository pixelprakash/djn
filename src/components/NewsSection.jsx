import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { Deadline, Cta } from './NewsBits'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { fmtDate, newsPath, isOpen } from '../lib/news'
import { preloadForPath } from '../routePreload'
import './NewsSection.css'

// One lead story, then a short list. Everything else is on /news.
const LIST = 3

/* News, updates and announcements -- admissions windows, openings, awards,
   talks -- right under the hero so time-sensitive news is seen before the
   portfolio, not after. The pinned (else newest) update leads; the next few
   follow as compact rows. Anything whose "closes on" date has passed drops
   off here (it stays on /news, marked Closed). Entries are "News, update or
   announcement" documents in Sanity (see /studio). Blog articles are a
   separate thing and live on /blogs. */
export default function NewsSection() {
  const { data: feed } = useCms('feed', FEED_QUERY, mapFeed, [])
  const open = feed.filter(isOpen)
  if (!open.length) return null

  const [lead, ...rest] = open
  const rows = rest.slice(0, LIST)
  const cover = lead.images[0]

  return (
    <section className="ns" aria-labelledby="ns-heading">
      <div className="ns-head">
        <h2 className="ns-heading" id="ns-heading">News &amp; Updates</h2>
        <Link className="ns-follow" to="/news" onMouseEnter={() => preloadForPath('/news')} onFocus={() => preloadForPath('/news')}>
          All news <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className={`ns-layout${rows.length ? '' : ' ns-layout--solo'}`}>
        {/* The lead update: its picture on the signature gradient plate (like the
            hero photograph), then its label, title, summary and action. */}
        <Reveal as="article" className="ns-lead">
          {cover && (
            <Link className="ns-lead-fig" to={newsPath(lead)} tabIndex={-1} aria-hidden="true">
              <span className="ns-lead-media" style={{ '--ns-fill': `url("${cover.thumb}")` }}>
                <img src={cover.thumb} alt="" loading="lazy" decoding="async" />
              </span>
            </Link>
          )}
          <div className="ns-lead-body">
            <div className="ns-meta">
              {lead.pinned && <span className="ns-label ns-label--pin">Pinned</span>}
              {lead.topic && <span className="ns-label">{lead.topic}</span>}
              <time className="ns-date" dateTime={lead.date}>{fmtDate(lead.date)}</time>
              <Deadline closesOn={lead.closesOn} />
            </div>
            <h3 className="ns-lead-title">
              <Link to={newsPath(lead)}>{lead.title || lead.text.split('\n')[0]}</Link>
            </h3>
            <p className="ns-lead-text">{lead.text}</p>
            <div className="ns-lead-actions">
              <Cta cta={lead.cta} />
              <Link className="ns-details" to={newsPath(lead)}>
                Details<span className="ns-sr"> of {lead.title || 'this update'}</span> <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* The next few as a typographic list: label, title, one line, hairline rules. */}
        {rows.length > 0 && (
          <ul className="ns-rows">
            {rows.map((p, i) => (
              <Reveal as="li" className="ns-row" key={p.id} delay={0.05 * (i + 1)}>
                <Link className="ns-row-link" to={newsPath(p)}>
                  <span className="ns-meta">
                    {p.topic && <span className="ns-label">{p.topic}</span>}
                    <time className="ns-date" dateTime={p.date}>{fmtDate(p.date)}</time>
                  </span>
                  <span className="ns-row-title">{p.title || p.text.split('\n')[0]}</span>
                  <span className="ns-row-text">{p.text.replace(/\s+/g, ' ')}</span>
                  <Deadline closesOn={p.closesOn} />
                  <span className="ns-row-arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
