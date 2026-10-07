import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PROJECTS } from './projectData'
import Reveal from '../components/Reveal'
import { Slideshow } from '../components/PhotoGallery'
import MasonryGallery from '../components/MasonryGallery'
import usePageTitle from '../hooks/usePageTitle'
import { projectMeta, notFoundMeta } from '../seo/routes'
import './ProjectDetail.css'

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
  // Where to go next: the following project first, then the rest, wrapping
  // round, so the end of the list never dead-ends.
  const more = pIdx < 0 ? [] : [...PROJECTS.slice(pIdx + 1), ...PROJECTS.slice(0, pIdx)].slice(0, 4)

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
          <span>Slideshow</span>
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
          <button
            type="button"
            className="pd-hero-cta"
            onClick={() => setSlideshow({ images: allImages, startIdx: 0 })}
          >
            View all {allImages.length} photographs <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </section>

      {/* ── CHAPTERS: a short note, then its photographs ── */}
      <div className="pd-body">
        {project.sections.map((sec, si) => {
          const paras = sec.text ? sec.text.split('\n\n') : []
          const many = project.sections.length > 1
          return (
            <Reveal as="section" key={si} className="pd-ch" aria-label={many ? `Part ${si + 1} of ${project.sections.length}` : 'Photographs'}>
              {paras.length > 0 && (
                <div className="pd-ch-head">
                  <div className="pd-ch-meta">
                    {many && (
                      <span className="pd-ch-no" aria-hidden="true">
                        {String(si + 1).padStart(2, '0')}<span className="pd-ch-of"> / {String(project.sections.length).padStart(2, '0')}</span>
                      </span>
                    )}
                    <span className="pd-ch-count">{sec.images.length} photographs</span>
                    <button
                      type="button"
                      className="pd-ch-view"
                      onClick={() => setSlideshow({ images: sec.images, startIdx: 0 })}
                    >
                      <span className="pd-ch-dot" aria-hidden="true">
                        <svg width="8" height="9" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6V0z" /></svg>
                      </span>
                      View slideshow
                    </button>
                  </div>
                  <div className="pd-ch-text">
                    {paras.map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              )}
              <MasonryGallery
                label={project.title}
                images={sec.images}
                onOpen={i => setSlideshow({ images: sec.images, startIdx: i })}
              />
            </Reveal>
          )
        })}
      </div>

      {/* ── MORE PROJECTS ── */}
      {more.length > 0 && (
        <nav className="pd-more" aria-labelledby="pd-more-title">
          <div className="pd-more-head">
            <h2 id="pd-more-title">More projects</h2>
            <Link to="/work">All work <span aria-hidden="true">&rarr;</span></Link>
          </div>
          <div className="pd-more-grid">
            {more.map((p, i) => (
              <Link key={p.id} to={`/work/${p.slug}`} className="pd-more-card">
                <span className="pd-more-img">
                  <img src={p.cover} alt="" loading="lazy" decoding="async" />
                  {i === 0 && <span className="pd-more-next">Next</span>}
                </span>
                <span className="pd-more-meta">{p.category} &middot; {p.year}</span>
                <span className="pd-more-title">{p.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

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