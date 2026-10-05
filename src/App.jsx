import { Suspense, lazy, useEffect, useRef } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, usePresence, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import TopNav     from "./components/TopNav"
import CustomCursor from "./components/CustomCursor"
import Footer from "./components/Footer"
import IntroLoader from "./components/IntroLoader"
import { irisClipPath } from "./utils/iris"
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

/* #root is the real scroll container (see index.css) — reset it on every
   route change so navigating pages doesn't inherit the previous scroll offset. */
function ScrollToTop() {
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    document.getElementById('root')?.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

/* The actual route table, shared by every RouteTransition instance below
   so there's exactly one place that lists them. */
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

/* Wraps each route's content for the crossfade, driven by GSAP rather
   than framer-motion's animate/exit props -- framer-motion's job here is
   now only presence lifecycle (usePresence: "is this instance still
   wanted, and a callback to say when it's actually safe to unmount"),
   the same thing AnimatePresence always needed from a child; GSAP does
   the actual tweening, including the entrance's accent-sweep bar and the
   rotating-iris reveal (see src/utils/iris.js) -- the same aperture
   motif IntroLoader opens the whole site with, now echoed on every
   navigation so the two don't feel like two different animation
   systems. Enter and exit are two independent effects/timelines rather
   than one timeline played forwards/backwards: this instance is only
   ever doing one or the other, never both, and GSAP's onComplete is
   what reports completion in each direction (to React for exit via
   safeToRemove; nothing needs to know when enter finishes).

   The *entering* page stays in normal document flow (so #root's scroll
   height is always driven by whatever's actually there to read); the
   *exiting* page switches to position:absolute the moment presence
   flips false, lifting it out of flow so it overlays the entering page
   instead of stacking below/above it. Without this, animating for
   several hundred ms with scale on both pages at once would visibly
   shove the incoming page down the screen for the length of the
   crossfade. main (#main-content) carries the position:relative this
   resolves against -- see App.css.

   Skips all of it -- GSAP included -- when reduced motion is preferred:
   the route just swaps in a plain div, no animation, no
   absolute-positioning juggling needed since there's no overlap window
   to manage when nothing animates. */
function RouteTransition({ location, reduceMotion }) {
  const [isPresent, safeToRemove] = usePresence()
  const containerRef = useRef(null)
  const sweepRef = useRef(null)
  const contentRef = useRef(null)

  // Enter -- runs once, when this instance first mounts.
  useEffect(() => {
    if (reduceMotion) return
    let ctx
    try {
      ctx = gsap.context(() => {
        const iris = { openness: 0 }
        gsap.timeline()
          .fromTo(sweepRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.3, ease: 'power2.out' })
          .fromTo(contentRef.current,
            { opacity: 0, y: 16, scale: 0.988 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
            '-=0.08')
          .to(iris, {
            openness: 1,
            duration: 0.55,
            ease: 'power3.out',
            onUpdate: () => {
              if (contentRef.current) contentRef.current.style.clipPath = irisClipPath(iris.openness)
            },
          }, '<')
          .to(sweepRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' }, '-=0.3')
      }, containerRef)
    } catch {
      // Same reasoning as IntroLoader: if building/running the timeline
      // throws, fall back to just showing the page plainly rather than
      // risking it staying clipped/invisible.
      if (contentRef.current) {
        contentRef.current.style.opacity = '1'
        contentRef.current.style.clipPath = 'none'
        contentRef.current.style.transform = 'none'
      }
    }
    return () => ctx && ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Exit -- fires once presence flips false; safeToRemove is what
  // actually lets AnimatePresence drop this instance from the tree.
  useEffect(() => {
    if (reduceMotion) { if (!isPresent) safeToRemove(); return }
    if (isPresent) return
    const el = contentRef.current
    if (el) el.style.position = 'absolute'
    let tween
    try {
      tween = gsap.to(el, {
        opacity: 0, y: -12, scale: 0.99,
        duration: 0.26, ease: 'power1.in',
        onComplete: safeToRemove,
      })
    } catch {
      safeToRemove()
    }
    return () => tween && tween.kill()
  }, [isPresent, reduceMotion, safeToRemove])

  if (reduceMotion) {
    return (
      <div>
        <RouteSwitch location={location} />
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div ref={sweepRef} className="route-sweep" aria-hidden="true" />
      <div ref={contentRef} style={{ top: 0, left: 0, right: 0, willChange: 'opacity, transform, clip-path' }}>
        <RouteSwitch location={location} />
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    // No mode="wait": that forced the outgoing page to fully finish exiting
    // before the incoming one even started entering, roughly doubling the
    // visible transition time on every navigation. Default (sync) mode lets
    // both run at once, like a crossfade.
    //
    // Suspense lives *inside* RouteTransition (one per route key), not
    // wrapped around the whole AnimatePresence. A lazy route whose chunk
    // hasn't loaded yet (first visit, too fast for the hover/idle preload
    // to have won the race) suspends — if that Suspense boundary wrapped
    // every child, the still-exiting previous page would suspend too and
    // get stuck in the DOM mid-crossfade instead of animating out. Scoped
    // per-child, only the entering page's own content falls back to
    // PageLoader; the exiting page, already rendered, is unaffected.
    <AnimatePresence initial={false}>
      <RouteTransition key={location.pathname} location={location} reduceMotion={reduceMotion} />
    </AnimatePresence>
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
      <ScrollToTop />

      <main id="main-content" tabIndex={-1}>
        <AnimatedRoutes />
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App
