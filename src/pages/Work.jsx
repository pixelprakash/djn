import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SPONSORED, SOLO_SHOWS, EXHIBITIONS } from './exhibitionData'
import { useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'
import usePageTitle from '../hooks/usePageTitle'
import useStackedLayers from '../hooks/useStackedLayers'
import './Work.css'

const TABS = [
  ['projects',    'Photography Projects'],
  ['sponsored',   'Sponsored Projects'],
  ['exhibitions', 'Exhibitions'],
]

export default function Work() {
  usePageTitle('Work')
  const [tab, setTab] = useState('projects')
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const sheetTop = useRef(null)

  // The tabs stay pinned under the top bar while the lists scroll, so a visitor
  // can switch category from anywhere. Switching swaps in a list of a different
  // length, so if they are scrolled down, bring the new list back to its start
  // (just under the pinned tabs) instead of leaving them mid-way or past the end.
  // Arrow keys / Home / End move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = e => {
    const i = TABS.findIndex(([id]) => id === tab)
    let n = -1
    if (e.key === 'ArrowRight') n = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = TABS.length - 1
    if (n < 0) return
    e.preventDefault()
    chooseTab(TABS[n][0])
    document.getElementById(`tab-${TABS[n][0]}`)?.focus()
  }

  const chooseTab = id => {
    setTab(id)
    const root = document.getElementById('root')
    if (!root || !sheetTop.current) return
    const navH = window.matchMedia('(max-width: 640px)').matches ? 57 : 65
    const target = sheetTop.current.getBoundingClientRect().bottom + root.scrollTop - navH
    if (root.scrollTop > target) root.scrollTo({ top: target })
  }

  return (
    <div className="wp" ref={pageRef}>

      {/* -- HEADER -- */}
      <PageHero
        title="Selected Work"
        sub="Photography, research projects, and exhibitions spanning three decades."
      />

      {/* The page's rounded top edge over the hero (see PageHero.css). It is
          its own element, not the tab bar, so the pinned tabs stay square. */}
      <div className="wp-sheet-top" ref={sheetTop} aria-hidden="true" />

      {/* -- TABS -- */}
      <div className="tab-nav" role="tablist" aria-label="Work sections" onKeyDown={onTabKey}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            className={`tab-btn${tab === id ? ' active' : ''}`}
            aria-selected={tab === id}
            aria-controls="work-panel"
            tabIndex={tab === id ? 0 : -1}
            onClick={() => chooseTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* -- TAB BODY -- */}
      <div className="wp-body" id="work-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>

        {tab === 'projects' && (
          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <Reveal
                as={Link}
                key={p.id}
                to={`/work/${p.slug}`}
                className="proj-card"
                delay={(i % 2) * 0.06}
              >
                <div className="proj-img-wrap">
                  <img src={p.cover} alt={p.title} loading="lazy" decoding="async" />
                  <div className="proj-overlay"><span>View project &#8594;</span></div>
                </div>
                <div className="proj-info">
                  <div className="proj-meta-row">
                    <span className="proj-cat">{p.category}</span>
                    <span className="proj-year">{p.year}</span>
                  </div>
                  <h2 className="proj-title">{p.title}</h2>
                  <p className="proj-venue">{p.venue}</p>
                  <span className="proj-cta">Open project &#8594;</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {tab === 'sponsored' && (
          <div className="sp-list">
            {SPONSORED.map((s, i) => (
              <Reveal key={i} className="sp-row" delay={Math.min(i, 5) * 0.04}>
                <div className="sp-left">
                  <span className="sp-year">{s.year}</span>
                  <span className="sp-role">{s.role}</span>
                </div>
                <div className="sp-right">
                  <p className="sp-title">{s.title}</p>
                  <p className="sp-funder">{s.funder}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {tab === 'exhibitions' && (
          <div className="ex-wrap">
            <Reveal className="ex-section">
              <p className="seg-lbl">Solo Shows</p>
              <div className="solo-list">
                {SOLO_SHOWS.map((s, i) => (
                  <div key={i} className="solo-row">
                    <span className="solo-year">{s.year}</span>
                    <div className="solo-info">
                      <span className="solo-title">{s.title}</span>
                      <span className="solo-venue">{s.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="ex-section">
              <p className="seg-lbl">Selected Exhibitions</p>
              <div className="ex-list">
                {EXHIBITIONS.map((e, i) => (
                  <div key={i} className="ex-row">
                    <span className="ex-year">{e.year}</span>
                    <div className="ex-info">
                      <span className="ex-title">{e.title}</span>
                      <span className="ex-venue">{e.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

      </div>
    </div>
  )
}