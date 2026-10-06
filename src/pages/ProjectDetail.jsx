import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PROJECTS } from './projectData'
import Reveal from '../components/Reveal'
import { Slideshow, PhotoGrid } from '../components/PhotoGallery'
import usePageTitle from '../hooks/usePageTitle'
import { projectMeta, notFoundMeta } from '../seo/routes'
import './ProjectDetail.css'

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
  const location    = useLocation()

  const [slideshow, setSlideshow] = useState(null)  // { images, startIdx }
  const [stuck, setStuck]         = useState(false)

  /* Find project */
  const pIdx   = PROJECTS.findIndex(p => p.slug === slug)
  const project = PROJECTS[pIdx]
  usePageTitle(project ? projectMeta(project) : notFoundMeta())
  const prevP   = pIdx > 0 ? PROJECTS[pIdx - 1] : null
  const nextP   = pIdx < PROJECTS.length - 1 ? PROJECTS[pIdx + 1] : null

  /* All images flattened */
  const allImages = project ? project.sections.flatMap(s => s.images) : []

  /* Scroll to top on slug change */
  useEffect(() => { window.scrollTo({ top: 0 }) }, [slug])

  /* Arriving from a specific photo in the Home page's Works timeline
     (src/components/WorksTimeline.jsx) opens straight to that photo's
     slideshow instead of just landing on the hero -- same mechanism
     PhotoGrid's own onOpen already uses (a section's images + an index
     into it), just handed over via navigation state instead of a click.
     Keyed on location.key (unique per history entry, unlike slug) so it
     fires again if a second Works-timeline click lands on the same
     project from a different photo. */
  useEffect(() => {
    const openAt = location.state && location.state.openSlideshow
    if (openAt && openAt.images && openAt.images.length) {
      setSlideshow({ images: openAt.images, startIdx: openAt.startIdx || 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  /* Bar becomes "stuck" after hero scrolls past */
  useEffect(() => {
    const root = document.getElementById('root') || window
    const fn = () => setStuck((root.scrollTop || window.scrollY) > 48)
    root.addEventListener('scroll', fn, { passive: true })
    return () => root.removeEventListener('scroll', fn)
  }, [])

  // Hide TopNav on project detail for clean viewing
  useEffect(() => {
    document.documentElement.classList.add('hide-topnav')
    return () => document.documentElement.classList.remove('hide-topnav')
  }, [])

  if (!project) return (
    <div className="pd-404">
      Project not found. <Link to="/work">← Back to Work</Link>
    </div>
  )

  return (
    <div className="pd">
      {/* ── TOP NAV BAR ── */}
      <header className={`pd-bar${stuck ? ' stuck' : ''}`}>
        {/* Back */}
        <button
          className="pd-back"
          onClick={() => { if (location.key !== 'default') navigate(-1); else navigate('/work') }}
          aria-label="Go back"
        >
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
          decoding="async"
          fetchPriority="high"
        />
        <div className="pd-hero-grad" aria-hidden />
        <div className="pd-hero-info">
          <span className="pd-hero-tag">{project.category}</span>
          <h1 className="pd-hero-title">{project.title}</h1>
          <p className="pd-hero-venue">{project.venue} &middot; {project.year}</p>
        </div>
      </section>

      {/* ── EDITORIAL SECTIONS ── */}
      <div className="pd-body">
        {project.sections.map((sec, si) => (
          <Reveal
            as="article"
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
              label={project.title}
              images={sec.images}
              onOpen={i => setSlideshow({ images: sec.images, startIdx: i })}
            />

            {/* Thin separator between sections */}
            {si < project.sections.length - 1 && (
              <div className="pd-sep" aria-hidden />
            )}
          </Reveal>
        ))}
      </div>

      {/* ── PREV / NEXT ── */}
      <Reveal as="nav" className="pd-pn" aria-label="Adjacent projects">
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
      </Reveal>

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