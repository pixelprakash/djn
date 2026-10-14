import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { preloadForPath } from '../routePreload'
import './HeroSlider.css'

/* The home hero as a slideshow of the selected works (home Option 2).

   - Advances by itself every SLIDE_MS, one work at a time, and loops.
   - Click a picture (or its title) to open the project.
   - Previous / Next, a Pause / Play button and one numbered segment per work
     (each fills as its slide runs). Swiping works on touch screens.
   - Stops while the pointer is over it or focus is inside it, while the tab is
     hidden or the slider is off screen, and always when the visitor pressed
     Pause. Visitors who prefer reduced motion get no auto-advance at all (they
     can still use the buttons, or press Play).
   - Markup follows the WAI-ARIA carousel pattern: only the current slide is
     exposed to assistive tech; the caption announces changes only while paused,
     never while it rotates by itself. */
const SLIDE_MS = 6000

export default function HeroSlider({ projects }) {
  const n = projects.length
  const [i, setI] = useState(0)
  const [userPaused, setUserPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hold, setHold] = useState(false)        // pointer over / focus inside
  const [visible, setVisible] = useState(true)   // on screen and tab visible
  const rootRef = useRef(null)
  const barRef = useRef(null)
  const elapsed = useRef(0)
  const touchX = useRef(null)

  const running = !userPaused && !hold && visible
  const go = useCallback(k => { elapsed.current = 0; setI(((k % n) + n) % n) }, [n])

  // One clock: advances `elapsed` while running, fills the active segment, moves on at SLIDE_MS.
  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = now => {
      elapsed.current += now - last
      last = now
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, elapsed.current / SLIDE_MS)})`
      if (elapsed.current >= SLIDE_MS) { elapsed.current = 0; setI(v => (v + 1) % n) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, n])

  // A new slide starts with an empty segment; the others go back to empty too.
  useEffect(() => {
    rootRef.current?.querySelectorAll('.hs-seg-fill').forEach(el => { el.style.transform = '' })
  }, [i])

  // Off screen or tab hidden: stand still.
  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let onScreen = true
    const sync = () => setVisible(onScreen && !document.hidden)
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync() }, { threshold: 0.25 })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])

  const p = projects[i]
  const next = projects[(i + 1) % n]

  return (
    <div
      className="hs hp-art"
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false) }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
      }}
    >
      <div className="hs-frame">
      <div
        className="hs-stage"
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX)
          touchX.current = null
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
        }}
      >
        {projects.map((q, k) => (
          <Link
            key={q.id}
            to={`/work/${q.slug}`}
            className={`hs-slide${k === i ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${k + 1} of ${n}: ${q.title}, ${q.year}`}
            aria-hidden={k !== i}
            tabIndex={k === i ? 0 : -1}
            onMouseEnter={() => preloadForPath(`/work/${q.slug}`)}
          >
            <img
              src={q.cover}
              alt=""
              width="1280"
              height="720"
              loading={k === 0 ? 'eager' : 'lazy'}
              fetchPriority={k === 0 ? 'high' : undefined}
              decoding="async"
            />
            {/* The cue: appears on hover / focus (always on touch screens). The link
                already has its own label, so this is decorative. */}
            <span className="hs-cue" aria-hidden="true">View project <span className="hs-cue-arrow">&rarr;</span></span>
          </Link>
        ))}
      </div>
      </div>

      <div className="hs-caption" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
        <div className="hs-cap-text">
          <span className="hs-kicker">Selected work &middot; {p.category} &middot; {p.year}</span>
          <Link className="hs-title" to={`/work/${p.slug}`} tabIndex={-1} aria-hidden="true">
            {p.title} <span className="hs-title-arrow" aria-hidden="true">&rarr;</span>
          </Link>
          <span className="hs-sr">{p.title}, {p.year}</span>
        </div>
      </div>

      <div className="hs-controls">
        <ol className="hs-segs">
          {projects.map((q, k) => (
            <li key={q.id}>
              <button
                type="button"
                className={`hs-seg${k === i ? ' is-active' : ''}`}
                aria-label={`Show ${q.title}`}
                aria-current={k === i ? 'true' : undefined}
                onClick={() => go(k)}
              >
                <span className="hs-seg-no">{String(k + 1).padStart(2, '0')}</span>
                <span className="hs-seg-bar"><span className="hs-seg-fill" ref={k === i ? barRef : null} /></span>
              </button>
            </li>
          ))}
        </ol>
        <div className="hs-btns">
          <button type="button" className="hs-btn" onClick={() => go(i - 1)} aria-label="Previous work">&larr;</button>
          <button type="button" className="hs-btn" onClick={() => go(i + 1)} aria-label={`Next work: ${next.title}`}>&rarr;</button>
          <button type="button" className="hs-btn hs-btn--text" onClick={() => setUserPaused(v => !v)} aria-pressed={!userPaused}>
            {userPaused ? 'Play' : 'Pause'}<span className="hs-sr"> the slideshow</span>
          </button>
        </div>
      </div>
    </div>
  )
}
