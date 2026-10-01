import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import './WorksTimeline.css'

const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23d8d8d8' width='400' height='300'/%3E%3C/svg%3E"

// Fixed cycle of relative heights, same idea as a contact sheet laid out
// by hand — frames land at different sizes instead of a uniform grid.
const SIZE_CYCLE = ['lg', 'sm', 'md', 'sm', 'lg', 'md']

/* cover + a handful of real gallery photos per project (never more than
   PER_PROJECT) — enough to feel like "continuously changing" images as
   you move through the rail, without pulling in a project's full 20-40
   image gallery and making the scroll absurdly long. */
const PER_PROJECT = 4

// How much faster the rail pans than the user actually scrolls -- 1 would
// be a literal 1:1 (scroll exactly as many px as the rail moves), which
// for a rail this size means scrolling several screens' worth just to
// reach the last project. Compressing the pinned section's own height by
// this factor keeps every photo reachable without that long a scroll.
const SCROLL_SPEED = 1.5

/* One deep, muted tone per project -- all close to the same dark depth as
   the old flat --ink backdrop (so title-card/photo contrast never
   suffers), but different enough in hue that the room you're "in"
   visibly changes project to project. Cycles if there are ever more than
   5 projects. */
const PROJECT_COLORS = [
  '#16242e', // Doob Gaya Hum -- water, blue-slate
  '#241a2e', // Trespass -- interiors, violet-plum
  '#2e1f16', // Lost and Found -- objects, warm umber
  '#1e2a1c', // Roti Kapada Makan -- everyday life, forest
  '#1a1814', // In Loving Memory Of -- the original ink
]

/* One rail item per project, always first in its group: a text card, not
   a photo -- the clearest possible way to say "a new project starts
   here" is to actually put its name in the strip, not just a small
   ruler label underneath that's easy to miss while looking at images. */
function buildRailItems(projects) {
  let n = 0
  const items = []
  projects.forEach((p, pIndex) => {
    items.push({
      type: 'title',
      key: `${p.slug}-title`,
      project: p,
      index: pIndex + 1,
      color: PROJECT_COLORS[pIndex % PROJECT_COLORS.length],
    })

    const gallery = (p.sections || []).flatMap(s => s.images || [])
    const seen = new Set()
    const sources = [p.cover, ...gallery].filter(src => {
      if (!src || seen.has(src)) return false
      seen.add(src)
      return true
    }).slice(0, PER_PROJECT)

    sources.forEach(src => {
      items.push({
        type: 'image',
        key: `${p.slug}-${n}`,
        src,
        size: SIZE_CYCLE[n % SIZE_CYCLE.length],
        project: p,
      })
      n += 1
    })
  })
  return items
}

/* Scroll-driven filmstrip: vertical page scroll pans a horizontal rail of
   photos drawn from all 5 projects, with a tick-mark timeline (one label
   per project) scrubbing in sync underneath -- the home-page "Works"
   section, rebuilt around a reference the user pointed to (a horizontal
   scroll-jacked lookback reel) rather than a static grid.

   Deliberately NOT implemented as true scroll-jacking (no wheel
   preventDefault, no scroll-capture): the section is a tall spacer with a
   `position: sticky` viewport inside it, and horizontal position is just
   `translateX` driven by how far the page has scrolled through that
   spacer. Normal document scroll -- wheel, trackpad, touch, keyboard,
   scrollbar drag -- all drive it identically, and nothing can ever trap
   the user's scroll. Below the tablet breakpoint, and whenever the OS
   reduced-motion setting is on, it drops to a plain native horizontally
   -scrollable row instead -- scroll-linked pinning over a tall spacer is
   a poor fit for a short mobile viewport, and reduced-motion users
   shouldn't be asked to scroll past a long pinned section just to reach
   the rest of the page. */
export default function WorksTimeline({ projects }) {
  const outerRef = useRef(null)
  const railRef = useRef(null)
  const firstItemRefs = useRef({})
  const reduceMotion = useReducedMotion()

  const items = useMemo(() => buildRailItems(projects), [projects])
  // Same items, grouped by project -- used only for the native-scroll
  // fallback, where each group gets wrapped in its own colored block
  // (there's no scroll position to drive a shared backdrop there).
  const groups = useMemo(() => {
    const bySlug = new Map()
    items.forEach(item => {
      if (!bySlug.has(item.project.slug)) bySlug.set(item.project.slug, [])
      bySlug.get(item.project.slug).push(item)
    })
    return projects.map((p, i) => ({
      project: p,
      color: PROJECT_COLORS[i % PROJECT_COLORS.length],
      items: bySlug.get(p.slug) || [],
    }))
  }, [items, projects])

  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 860
  )
  const [metrics, setMetrics] = useState({ scrollDistance: 0, railWidth: 0, viewportWidth: 0, labels: [] })
  const [offset, setOffset] = useState(0)

  const recalc = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const railWidth = rail.scrollWidth
    const viewportWidth = window.innerWidth
    const scrollDistance = Math.max(0, railWidth - viewportWidth)
    const labels = projects.map((p, i) => {
      const el = firstItemRefs.current[p.slug]
      return el ? { slug: p.slug, title: p.title, x: el.offsetLeft, color: PROJECT_COLORS[i % PROJECT_COLORS.length] } : null
    }).filter(Boolean)
    setMetrics({ scrollDistance, railWidth, viewportWidth, labels })
    setIsNarrow(viewportWidth <= 860)
  }, [projects])

  useEffect(() => {
    recalc()
    window.addEventListener('resize', recalc)
    let ro
    if (railRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(recalc)
      ro.observe(railRef.current)
    }
    // Images arrive async and change the rail's natural width as they do;
    // recalc again once everything currently in the DOM has settled.
    const imgs = railRef.current ? railRef.current.querySelectorAll('img') : []
    imgs.forEach(img => { if (!img.complete) img.addEventListener('load', recalc, { once: true }) })
    return () => {
      window.removeEventListener('resize', recalc)
      if (ro) ro.disconnect()
    }
  }, [recalc])

  const pinned = !reduceMotion && !isNarrow && metrics.scrollDistance > 0
  // The pinned section's own scrollable height -- shorter than
  // scrollDistance by SCROLL_SPEED, so the rail finishes panning before
  // the user has scrolled the rail's full pixel width. See SCROLL_SPEED.
  const pinHeight = metrics.scrollDistance / SCROLL_SPEED

  useEffect(() => {
    if (!pinned) { setOffset(0); return }
    // The page's actual scroll container is #root (html/body are
    // overflow:hidden, see src/index.css) -- window never fires a
    // 'scroll' event here, so listening on window would silently never
    // run this at all.
    const scroller = document.getElementById('root') || window
    function onScroll() {
      const sec = outerRef.current
      if (!sec) return
      const rect = sec.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / pinHeight))
      setOffset(progress * metrics.scrollDistance)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [pinned, pinHeight, metrics.scrollDistance])

  // Which project is "active" right now -- the backdrop switches to its
  // color a little before its title card actually reaches the left edge
  // (viewport's own half-width as a lead-in), so the room changes as you
  // arrive rather than only after you've already scrolled past the card.
  let activeColor = PROJECT_COLORS[0]
  if (metrics.labels.length) {
    const threshold = offset + metrics.viewportWidth * 0.5
    metrics.labels.forEach(l => { if (l.x <= threshold) activeColor = l.color })
  }

  function renderItem(item) {
    if (item.type === 'title') {
      return (
        <Link
          to={`/work/${item.project.slug}`}
          key={item.key}
          className="wt-title-card"
          ref={el => { firstItemRefs.current[item.project.slug] = el }}
        >
          <span className="wt-title-card-index">{String(item.index).padStart(2, '0')}</span>
          <span className="wt-title-card-meta">{item.project.category} · {item.project.year}</span>
          <h3 className="wt-title-card-name">{item.project.title}</h3>
          <span className="wt-title-card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </Link>
      )
    }
    return (
      <Link
        to={`/work/${item.project.slug}`}
        key={item.key}
        className={`wt-item wt-item--${item.size}`}
      >
        <img
          src={item.src}
          alt={`${item.project.title} — ${item.project.category}`}
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={e => { if (e.currentTarget.src !== PH) e.currentTarget.src = PH }}
        />
      </Link>
    )
  }

  return (
    <section
      ref={outerRef}
      className="wt"
      aria-labelledby="wt-heading"
      // Matches .wt-sticky's own height (100vh - the fixed nav's 64px) +
      // pinHeight worth of extra scroll -- see the comment on .wt-sticky.
      style={pinned ? { height: `calc(100vh - 64px + ${pinHeight}px)` } : undefined}
    >
      <div
        className={`wt-sticky${pinned ? '' : ' wt-sticky--static'}`}
        // Pinned: one shared backdrop that crossfades as the active
        // project changes (see activeColor above). Static/mobile fallback
        // has no scroll position to drive that from, so each project
        // group carries its own color instead -- see .wt-group below.
        style={pinned ? { backgroundColor: activeColor } : undefined}
      >
        <div className="wt-head">
          <h2 className="wt-heading" id="wt-heading">Works</h2>
          <Link to="/work" className="wt-viewall">View all work</Link>
        </div>

        <div className={`wt-rail-viewport${pinned ? '' : ' wt-rail-viewport--scroll'}`}>
          {pinned ? (
            <div
              className="wt-rail"
              ref={railRef}
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {items.map(renderItem)}
            </div>
          ) : (
            <div className="wt-rail" ref={railRef}>
              {groups.map(g => (
                <div className="wt-group" key={g.project.slug} style={{ backgroundColor: g.color }}>
                  {g.items.map(renderItem)}
                </div>
              ))}
            </div>
          )}
        </div>

        {pinned && (
          <div className="wt-ruler" aria-hidden="true">
            <div className="wt-ruler-track" style={{ width: metrics.railWidth, transform: `translateX(-${offset}px)` }}>
              {metrics.labels.map(l => (
                <span className="wt-ruler-label" key={l.slug} style={{ left: l.x }}>{l.title}</span>
              ))}
            </div>
            <div className="wt-ruler-playhead" />
          </div>
        )}
      </div>
    </section>
  )
}
