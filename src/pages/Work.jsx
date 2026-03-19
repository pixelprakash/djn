import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SPONSORED, SOLO_SHOWS, EXHIBITIONS } from './exhibitionData'
import { useState } from 'react'
import './Work.css'

export default function Work() {
  const [tab, setTab] = useState('projects')

  return (
    <div className="wp">

      {/* ── HEADER ── */}
      <header className="wp-head">
        <h1 className="wp-heading">
          <span>Selected</span>
          <em>Work</em>
        </h1>
        <p className="wp-sub">Photography, research projects,<br/>and exhibitions spanning three decades.</p>
      </header>

      {/* ── TABS ── */}
      <nav className="tab-nav" aria-label="Work sections">
        {[
          ['projects',    'Photography Projects'],
          ['sponsored',   'Sponsored Projects'],
          ['exhibitions', 'Exhibitions'],
        ].map(([id, label]) => (
          <button
            key={id}
            className={`tab-btn${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
            aria-selected={tab === id}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── TAB BODY ── */}
      <div className="wp-body">

        {/* ══ PHOTOGRAPHY PROJECTS ══ */}
        {tab === 'projects' && (
          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <Link
                key={p.id}
                to={`/work/${p.slug}`}
                className="proj-card"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Cover image */}
                <div className="proj-img-wrap">
                  <img src={p.cover} alt={p.title} loading="lazy" decoding="async" />
                  <div className="proj-overlay"><span>View project →</span></div>
                </div>

                {/* Info */}
                <div className="proj-info">
                  <div className="proj-meta-row">
                    <span className="proj-cat">{p.category}</span>
                    <span className="proj-year">{p.year}</span>
                  </div>
                  <h2 className="proj-title">{p.title}</h2>
                  <p className="proj-venue">{p.venue}</p>
                  <span className="proj-cta">Open project →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ══ SPONSORED PROJECTS — no amount ══ */}
        {tab === 'sponsored' && (
          <div className="sp-list">
            {SPONSORED.map((s, i) => (
              <div
                key={i}
                className="sp-row"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Left: year + role */}
                <div className="sp-left">
                  <span className="sp-year">{s.year}</span>
                  <span className="sp-role">{s.role}</span>
                </div>

                {/* Right: title + funder — NO amount */}
                <div className="sp-right">
                  <p className="sp-title">{s.title}</p>
                  <p className="sp-funder">{s.funder}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ EXHIBITIONS ══ */}
        {tab === 'exhibitions' && (
          <div className="ex-wrap">

            {/* Solo Shows */}
            <div className="ex-section">
              <p className="seg-lbl">Solo Shows</p>
              <div className="solo-list">
                {SOLO_SHOWS.map((s, i) => (
                  <div
                    key={i}
                    className="solo-row"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <span className="solo-year">{s.year}</span>
                    <div className="solo-info">
                      <span className="solo-title">{s.title}</span>
                      <span className="solo-venue">{s.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Exhibitions */}
            <div className="ex-section">
              <p className="seg-lbl">Selected Exhibitions</p>
              <div className="ex-list">
                {EXHIBITIONS.map((e, i) => (
                  <div
                    key={i}
                    className="ex-row"
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    <span className="ex-year">{e.year}</span>
                    <div className="ex-info">
                      <span className="ex-title">{e.title}</span>
                      <span className="ex-venue">{e.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}