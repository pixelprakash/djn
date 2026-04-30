import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { PROJECTS } from './projectData'
import './ProjectDetail.css'

/* ═══════════════════════════════════════════
   Custom cursor — follows mouse only while
   hovering photo grid cells (cursor: none)
═══════════════════════════════════════════ */
function PhotoCursor() {
  const el = useRef(null)

  useEffect(() => {
    const cursor = el.current
    if (!cursor) return
    const onMove = e => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="pd-cursor" ref={el} id="djm-cursor" aria-hidden>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg>
    </div>
  )
}

/* helpers to drive the cursor from photo cells */
function getCursor() { return document.getElementById('djm-cursor') }
function cursorOn()  { getCursor()?.classList.add('on') }
function cursorOff() { getCursor()?.classList.remove('on','pop') }
function cursorPop() {
  const c = getCursor()
  if (!c) return
  c.classList.add('pop')
  setTimeout(() => c.classList.remove('pop'), 220)
}

/* ═══════════════════════════════════════════
   Fullscreen Slideshow
═══════════════════════════════════════════ */
function Slideshow({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const total     = images.length
  const stripRef  = useRef(null)

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  /* keyboard */
  useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [prev, next, onClose])

  /* auto-scroll strip to active thumb */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const thumb = strip.children[idx]
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [idx])

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="ss-bg" onClick={onClose}>
      <div className="ss-wrap" onClick={e => e.stopPropagation()}>

        <button className="ss-x" onClick={onClose} aria-label="Close slideshow">✕</button>

        <div className="ss-stage">
          <button className="ss-btn" onClick={prev} aria-label="Previous photo">‹</button>
          <img
            key={idx}
            src={images[idx]}
            alt=""
            className="ss-photo"
            loading="eager"
          />
          <button className="ss-btn" onClick={next} aria-label="Next photo">›</button>
        </div>

        <div className="ss-foot">
          <span className="ss-idx">
            {String(idx + 1).padStart(2,'0')}
            <span style={{margin:'0 5px',opacity:.25}}>/</span>
            {String(total).padStart(2,'0')}
          </span>
          <div className="ss-strip" ref={stripRef}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`ss-tn${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Photo Grid — 4 layout variants
═══════════════════════════════════════════ */
function PhotoGrid({ images, onOpen }) {
  const variant =
    images.length === 1 ? 'pg-1' :
    images.length === 2 ? 'pg-2' :
    images.length <= 4  ? 'pg-4' :
    'pg-many'

  return (
    <div className={`pg ${variant}`}>
      {images.map((src, i) => (
        <div
          key={i}
          className="pg-item"
          onMouseEnter={cursorOn}
          onMouseLeave={cursorOff}
          onClick={() => { cursorPop(); onOpen(i) }}
          role="button"
          tabIndex={0}
          aria-label={`Open photo ${i + 1}`}
          onKeyDown={e => e.key === 'Enter' && onOpen(i)}
        >
          <img src={src} alt="" loading="lazy" decoding="async" />
          <div className="pg-veil" aria-hidden />
          <span className="pg-num">{String(i + 1).padStart(2,'0')}</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Notebook text block with ruled-paper effect
═══════════════════════════════════════════ */
function Notebook({ section, onSlideshow }) {
  return (
    <div className="nb">
      {/* Red margin rule */}
      <div className="nb-redline" aria-hidden />

      {/* Ruled paper with text */}
      <div className="nb-paper">
        {section.text.split('\n\n').map((para, i) => (
          <p key={i} className="nb-p">{para}</p>
        ))}
      </div>

      {/* Button row — below ruled area, aligned left */}
      <div className="nb-actions">
        <button
          className="nb-view-btn"
          onClick={() => onSlideshow(section.images)}
        >
          <span className="nb-play-dot">
            <svg width="8" height="9" viewBox="0 0 10 12" fill="currentColor">
              <path d="M0 0l10 6-10 6V0z"/>
            </svg>
          </span>
          <span>View slideshow</span>
          <span className="nb-count">— {section.images.length} photos</span>
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function ProjectDetail() {
  const { slug }    = useParams()
  const navigate    = useNavigate()

  const [slideshow, setSlideshow] = useState(null)  // { images, startIdx }
  const [stuck, setStuck]         = useState(false)

  /* Find project */
  const pIdx   = PROJECTS.findIndex(p => p.slug === slug)
  const project = PROJECTS[pIdx]
  const prevP   = pIdx > 0 ? PROJECTS[pIdx - 1] : null
  const nextP   = pIdx < PROJECTS.length - 1 ? PROJECTS[pIdx + 1] : null

  /* All images flattened */
  const allImages = project ? project.sections.flatMap(s => s.images) : []

  /* Scroll to top on slug change */
  useEffect(() => { window.scrollTo({ top: 0 }) }, [slug])

  /* Bar becomes "stuck" after hero scrolls past */
  useEffect(() => {
    const root = document.getElementById('root') || window
    const fn = () => setStuck((root.scrollTop || window.scrollY) > 48)
    root.addEventListener('scroll', fn, { passive: true })
    return () => root.removeEventListener('scroll', fn)
  }, [])

  if (!project) return (
    <div className="pd-404">
      Project not found. <Link to="/work">← Back to Work</Link>
    </div>
  )

  // Hide TopNav on project detail for clean viewing
  useEffect(() => {
    document.documentElement.classList.add('hide-topnav')
    return () => document.documentElement.classList.remove('hide-topnav')
  }, [])

  return (
    <div className="pd">
      <PhotoCursor />

      {/* ── TOP NAV BAR ── */}
      <header className={`pd-bar${stuck ? ' stuck' : ''}`} role="navigation">
        {/* Back */}
        <button className="pd-back" onClick={() => navigate('/work')} aria-label="Back to Work">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </button>

        {/* Breadcrumb */}
        <nav className="pd-crumb" aria-label="Breadcrumb">
          <Link to="/work">Work</Link>
          <span className="sep" aria-hidden>/</span>
          <Link to="/work">Photography</Link>
          <span className="sep" aria-hidden>/</span>
          <span className="cur">{project.title}</span>
        </nav>

        {/* Slide show CTA */}
        <button
          className="pd-ss-btn"
          onClick={() => setSlideshow({ images: allImages, startIdx: 0 })}
          aria-label="Open full slideshow"
        >
          <span className="pd-ss-dot">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </span>
          <span>Slide Show</span>
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="pd-hero" aria-label="Project hero">
        <img
          className="pd-hero-img"
          src={project.cover}
          alt={project.title}
          loading="eager"
        />
        <div className="pd-hero-grad" aria-hidden />
        <div className="pd-hero-info">
          <span className="pd-hero-tag">{project.category}</span>
          <h1 className="pd-hero-title">{project.title}</h1>
          <p className="pd-hero-venue">{project.venue} &middot; {project.year}</p>
        </div>
      </section>

      {/* ── EDITORIAL SECTIONS ── */}
      <main className="pd-body">
        {project.sections.map((sec, si) => (
          <article
            key={si}
            className={`pd-sec${si % 2 === 1 ? ' pd-sec-odd' : ''}`}
          >
            {/* Notebook text */}
            {sec.text && (
              <Notebook
                section={sec}
                onSlideshow={imgs => setSlideshow({ images: imgs, startIdx: 0 })}
              />
            )}

            {/* Photo grid */}
            <PhotoGrid
              images={sec.images}
              onOpen={i => setSlideshow({ images: sec.images, startIdx: i })}
            />

            {/* Thin separator between sections */}
            {si < project.sections.length - 1 && (
              <div className="pd-sep" aria-hidden />
            )}
          </article>
        ))}
      </main>

      {/* ── PREV / NEXT ── */}
      <nav className="pd-pn" aria-label="Adjacent projects">
        {/* Hidden inner separator line */}
        <div className="pd-pn-inner-sep" aria-hidden />

        {/* Previous */}
        <div className="pd-pn-cell">
          {prevP ? (
            <Link to={`/work/${prevP.slug}`} className="pd-pn-link" aria-label={`Previous: ${prevP.title}`}>
              <span className="pd-pn-dir">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Previous
              </span>
              <div className="pd-pn-thumb">
                <img src={prevP.cover} alt={prevP.title} loading="lazy" />
              </div>
              <span className="pd-pn-title">{prevP.title}</span>
            </Link>
          ) : (
            <div className="pd-pn-link pd-pn-empty">
              <span className="pd-pn-dir" style={{opacity:.2}}>— First project</span>
            </div>
          )}
        </div>

        {/* Next */}
        <div className="pd-pn-cell pd-pn-cell-right">
          {nextP ? (
            <Link to={`/work/${nextP.slug}`} className="pd-pn-link" aria-label={`Next: ${nextP.title}`}>
              <span className="pd-pn-dir">
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
              <div className="pd-pn-thumb">
                <img src={nextP.cover} alt={nextP.title} loading="lazy" />
              </div>
              <span className="pd-pn-title">{nextP.title}</span>
            </Link>
          ) : (
            <div className="pd-pn-link pd-pn-empty">
              <span className="pd-pn-dir" style={{opacity:.2}}>Last project —</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── SLIDESHOW OVERLAY ── */}
      {slideshow && (
        <Slideshow
          images={slideshow.images}
          startIdx={slideshow.startIdx}
          onClose={() => setSlideshow(null)}
        />
      )}
    </div>
  )
}