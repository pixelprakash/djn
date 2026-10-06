import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useReducedMotion } from "framer-motion"
import gsap from "gsap"
import TopNav     from "./components/TopNav"
import CustomCursor from "./components/CustomCursor"
import Footer from "./components/Footer"
import IntroLoader from "./components/IntroLoader"
import { routeImports, preloadAllRoutes } from "./routePreload"
// About is the default landing route ("/" redirects here), so it's imported
// eagerly — lazy-loading it would add a chunk-fetch round trip to the most
// common page load instead of saving one.
import About from "./pages/About"

import "./App.css"

const Work         = lazy(routeImports.work)
const ProjectDetail = lazy(routeImports.projectDetail)
const Resume       = lazy(routeImports.resume)
const Lab          = lazy(routeImports.lab)
const Blog         = lazy(routeImports.blog)
const BlogPost     = lazy(routeImports.blogPost)
const Contact      = lazy(routeImports.contact)
const CvPage       = lazy(routeImports.cv)

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span className="page-loader-mark">DJM</span>
    </div>
  )
}

/* The actual route table. */
function RouteSwitch({ location }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location}>
        {/* Default page → About */}
        <Route path="/"        element={<Navigate to="/about" replace />} />
        <Route path="/about"   element={<About />} />
        <Route path="/work"    element={<Work />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="/resume"  element={<Resume />} />
        <Route path="/lab"     element={<Lab />} />
        <Route path="/blog"    element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv/:slug" element={<CvPage />} />
      </Routes>
    </Suspense>
  )
}

/* What the curtain says while it's covering the screen: where you're
   going. CV sub-pages name themselves (titles match CvPage's PAGES -- kept
   here so the lazy CvPage chunk isn't pulled into the main bundle). */
const CV_TITLES = {
  'educational-qualifications': 'Educational Qualifications',
  'scholarships-awards': 'Scholarships & Awards',
  'professional-experience': 'Professional Experience',
  'teaching-experience': 'Teaching Experience & Permanent Posts',
  'thesis-guidance': 'Thesis Guidance',
  'visiting-appointments': 'Visiting Appointments',
  'sponsored-projects': 'Sponsored Projects',
  'solo-shows': 'Solo Shows',
  'selected-exhibitions': 'Selected Exhibitions',
  'books': 'Books',
  'papers-publications': 'Papers & Publications',
  'training-programs': 'Training Programs',
  'conferences-journals': 'Conferences & Journals',
}
function labelFor(pathname) {
  const [seg, slug] = pathname.split('/').filter(Boolean)
  switch (seg) {
    case 'work':    return 'Work'
    case 'resume':  return 'Resume'
    case 'lab':     return 'DIC Lab'
    case 'blog':    return 'Blog'
    case 'contact': return 'Contact'
    case 'cv':      return CV_TITLES[slug] || 'Resume'
    default:        return 'About'
  }
}

/* Page-to-page transition: a curved ink panel rises over the page, names
   the destination, and sweeps on up and off to reveal the new one -- one
   continuous upward motion, in and out.

   Only ever ONE page is mounted. Navigation changes the router's location
   immediately, but `shown` (what the route table actually renders) lags
   it: it's swapped at the single moment the panel fully covers the
   screen, along with the scroll reset, so nothing visibly jumps and no
   two pages ever have to overlap or be kept alive to animate out (the
   old crossfade needed both, plus absolute-positioning to hide the seam).
   A second navigation mid-transition just retargets the pending swap;
   one landing after the swap queues a fresh run when this one finishes.

   The panel's top and bottom edges are parallel curves, so the centre
   leads on the way in and clears first on the way out -- a flexing sheet
   rather than a flat wipe -- with a hairline of the brand blue along each
   edge. Skipped entirely under reduced motion: the page just swaps. */
function PageTransition() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(location)
  const shownRef = useRef(location)
  const latest = useRef(location)
  const busy = useRef(false)
  const playRef = useRef(() => {})
  const curtain = useRef(null)
  const panel = useRef(null)
  const label = useRef(null)
  const rule = useRef(null)
  const page = useRef(null)

  const commit = next => {
    shownRef.current = next
    flushSync(() => setShown(next))
    document.getElementById('root')?.scrollTo({ top: 0 })
  }

  // Re-pointed every render so the timeline's callbacks (below) never
  // close over a stale commit/latest.
  playRef.current = () => {
    busy.current = true
    const text = labelFor(latest.current.pathname)
    label.current.textContent = text
    label.current.dataset.long = text.length > 18 ? 'true' : 'false'

    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
        gsap.set(page.current, { clearProps: 'transform,opacity,overflow' })
        gsap.set(curtain.current, { autoAlpha: 0, pointerEvents: 'none' })
        // Something else was asked for while this ran.
        if (latest.current.pathname !== shownRef.current.pathname) playRef.current()
        else if (latest.current !== shownRef.current) commit(latest.current)
      },
    })

    tl.set(curtain.current, { autoAlpha: 1, pointerEvents: 'auto' })
      .set(panel.current, { yPercent: 78 })

      // In: the panel climbs over the page while the page dims beneath it.
      .to(panel.current, { yPercent: 0, duration: 0.55, ease: 'power4.inOut' }, 0)
      .to(page.current, { opacity: 0.45, duration: 0.55, ease: 'power2.in' }, 0)

      // The destination's name rises out of a mask, its rule draws under it.
      .fromTo(label.current, { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
      .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.out' }, 0.48)

      // Fully covered: swap the page underneath, unseen, and park it a
      // little low so it can rise into place as the panel leaves.
      .call(() => {
        commit(latest.current)
        gsap.set(page.current, { opacity: 1, y: 56, overflow: 'clip' })
      }, null, 0.62)

      // Out: the panel carries on upward and off; the name lifts away; the
      // new page settles up into position behind it.
      .to([label.current, rule.current], { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.84)
      .to(panel.current, { yPercent: -84, duration: 0.7, ease: 'power4.inOut' }, 0.84)
      .to(page.current, { y: 0, duration: 0.85, ease: 'power3.out' }, 0.84)
      .set([label.current, rule.current], { opacity: 1 })
  }

  useEffect(() => {
    latest.current = location
    const cur = shownRef.current
    if (location.pathname === cur.pathname) {
      // Same page -- a hash, query or state-only change: no ceremony,
      // but the page does need the new location (ProjectDetail reads
      // location.state to open a specific photo).
      if (location !== cur && !busy.current) { shownRef.current = location; setShown(location) }
      return
    }
    if (reduceMotion) { commit(location); return }
    if (!busy.current) playRef.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, reduceMotion])

  useEffect(() => () => gsap.killTweensOf([panel.current, label.current, rule.current, page.current]), [])

  return (
    <>
      <div ref={page}>
        <RouteSwitch location={shown} />
      </div>

      <div ref={curtain} className="pt" aria-hidden="true">
        <svg ref={panel} className="pt-panel" viewBox="0 0 100 150" preserveAspectRatio="none">
          <path className="pt-fill" d="M0,16 Q50,-4 100,16 L100,144 Q50,104 0,144 Z" />
          <path className="pt-edge" d="M0,16 Q50,-4 100,16" />
          <path className="pt-edge pt-edge--b" d="M0,144 Q50,104 100,144" />
        </svg>
        <div className="pt-label">
          <div className="pt-label-mask"><span ref={label} className="pt-label-text" /></div>
          <span ref={rule} className="pt-rule" />
        </div>
      </div>
    </>
  )
}

// Warms every other route's chunk once the browser is idle, so clicking any
// nav link is instant afterwards — not just when a hover happened to fire
// preloadForPath first (e.g. touch devices, or a click too fast to hover).
function IdlePreload() {
  useEffect(() => {
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = idle(preloadAllRoutes)
    return () => cancel(id)
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <IntroLoader />
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <IdlePreload />
      <CustomCursor />
      <TopNav />
      <div className="tn-offset" aria-hidden="true" />

      <main id="main-content" tabIndex={-1}>
        <PageTransition />
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App
