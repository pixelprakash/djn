import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SPONSORED, SOLO_SHOWS, EXHIBITIONS } from './exhibitionData'
import { useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'
import usePageTitle from '../hooks/usePageTitle'
import { workMeta } from '../seo/routes'
import useStackedLayers from '../hooks/useStackedLayers'
import './Work.css'

// A row of headline numbers at the top of a tab.
function Stats({ items }) {
  return (
    <dl className="wk-stats">
      {items.map(([label, value]) => (
        <div className="wk-stat" key={label}>
          <dd>{value}</dd>
          <dt>{label}</dt>
        </div>
      ))}
    </dl>
  )
}

// Consecutive entries with the same year share one year heading.
function byYear(list) {
  const groups = []
  for (const e of list) {
    const last = groups[groups.length - 1]
    if (last && last.year === e.year) last.items.push(e)
    else groups.push({ year: e.year, items: [e] })
  }
  return groups
}

const range = list => {
  const ys = list.map(x => Number(x.year)).filter(Boolean)
  return `${Math.min(...ys)}–${Math.max(...ys)}`
}

const TABS = [
  ['projects',    'Photography Projects'],
  ['sponsored',   'Sponsored Projects'],
  ['exhibitions', 'Exhibitions'],
]

export default function Work() {
  usePageTitle(workMeta())
  const [tab, setTab] = useState('projects')
  const [cat, setCat] = useState('All')
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const sheetTop = useRef(null)

  const cats = ['All', ...new Set(PROJECTS.map(p => p.category))]
  const shownProjects = cat === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === cat)
  const [lead, ...rest] = shownProjects

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
          <>
            <div className="wk-filters" role="group" aria-label="Filter projects by type">
              {cats.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`wk-chip${cat === c ? ' wk-chip--on' : ''}`}
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {c} <span className="wk-chip-n">{c === 'All' ? PROJECTS.length : PROJECTS.filter(p => p.category === c).length}</span>
                </button>
              ))}
            </div>

            {lead && (
              <Reveal as={Link} to={`/work/${lead.slug}`} className="wk-lead">
                <img src={lead.cover} alt="" loading="eager" decoding="async" fetchPriority="high" />
                <span className="wk-lead-shade" aria-hidden="true" />
                <span className="wk-lead-body">
                  <span className="wk-no" aria-hidden="true">01</span>
                  <span className="wk-meta">
                    <span className="wk-cat">{lead.category}</span>
                    <span className="wk-year">{lead.year}</span>
                  </span>
                  <h2 className="wk-lead-title">{lead.title}</h2>
                  <span className="wk-lead-venue">{lead.venue}</span>
                  <span className="wk-lead-cta">Open project <span aria-hidden="true">&rarr;</span></span>
                </span>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="wk-grid">
                {rest.map((p, i) => {
                  // An odd one out takes the full row, picture beside text.
                  const wide = rest.length % 2 === 1 && i === rest.length - 1
                  return (
                    <Reveal
                      as={Link}
                      key={p.id}
                      to={`/work/${p.slug}`}
                      className={`wk-card${wide ? ' wk-card--wide' : ''}`}
                      delay={(i % 2) * 0.06}
                    >
                      <span className="wk-card-img">
                        <img src={p.cover} alt="" loading="lazy" decoding="async" />
                        <span className="wk-no wk-no--card" aria-hidden="true">{String(i + 2).padStart(2, '0')}</span>
                      </span>
                      <span className="wk-card-body">
                        <span className="wk-meta">
                          <span className="wk-cat">{p.category}</span>
                          <span className="wk-year">{p.year}</span>
                        </span>
                        <h2 className="wk-card-title">{p.title}</h2>
                        <span className="wk-card-venue">{p.venue}</span>
                        <span className="wk-card-cta">Open project <span aria-hidden="true">&rarr;</span></span>
                      </span>
                    </Reveal>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === 'sponsored' && (
          <>
            <Stats items={[
              ['Funded projects', SPONSORED.length],
              ['As Principal Investigator', SPONSORED.filter(s => s.role === 'Principal Investigator').length],
              ['Years', range(SPONSORED)],
            ]} />
            <div className="sp-grid">
              {SPONSORED.map((s, i) => (
                <Reveal as="article" key={i} className="sp-card" delay={(i % 2) * 0.05}>
                  <div className="sp-top">
                    <span className="sp-year">{s.year}</span>
                    <span className="sp-role">{s.role}</span>
                  </div>
                  <h2 className="sp-title">{s.title}</h2>
                  <p className="sp-funder"><span className="sp-funder-lbl">Funded by</span> {s.funder}</p>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {tab === 'exhibitions' && (
          <div className="ex-wrap">
            <Stats items={[
              ['Solo shows', SOLO_SHOWS.length],
              ['Group exhibitions', EXHIBITIONS.length],
              ['Years', range([...SOLO_SHOWS, ...EXHIBITIONS])],
            ]} />

            <section aria-labelledby="solo-h">
              <h2 className="seg-lbl" id="solo-h">Solo Shows</h2>
              <div className="solo-grid">
                {SOLO_SHOWS.map((s, i) => {
                  // Rows of three; if the last row is short, its cards share the width.
                  const left = SOLO_SHOWS.length % 3
                  const tail = left && i >= SOLO_SHOWS.length - left
                  const span = tail ? (left === 1 ? ' solo-card--full' : ' solo-card--half') : ''
                  return (
                  <Reveal as="article" key={i} className={`solo-card${span}`} delay={(i % 3) * 0.05}>
                    <span className="solo-year">{s.year}</span>
                    <h3 className="solo-title">{s.title}</h3>
                    <p className="solo-venue">{s.venue}</p>
                  </Reveal>
                  )
                })}
              </div>
            </section>

            <section aria-labelledby="group-h">
              <h2 className="seg-lbl" id="group-h">Selected Exhibitions</h2>
              <div className="yr-list">
                {byYear(EXHIBITIONS).map(g => (
                  <Reveal key={g.year + g.items[0].title} className="yr-group">
                    <span className="yr-year">{g.year}</span>
                    <ul className="yr-items">
                      {g.items.map((e, i) => (
                        <li key={i} className="yr-item">
                          <span className="yr-title">{e.title}</span>
                          <span className="yr-venue">{e.venue}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  )
}