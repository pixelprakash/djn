import { Suspense, lazy, useEffect, useRef } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import FloatingNav from "./components/FloatingNav"
import TopNav     from "./components/TopNav"
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

function AnimatedRoutes() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    // No mode="wait": that forced the outgoing page to fully finish exiting
    // before the incoming one even started entering, roughly doubling the
    // visible transition time on every navigation. Default (sync) mode lets
    // both run at once, like a crossfade.
    <AnimatePresence initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
      >
        <Routes location={location}>
          {/* Default page → About */}
          <Route path="/"        element={<Navigate to="/about" replace />} />
          <Route path="/about"   element={<About />} />
          <Route path="/work"    element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/resume"  element={<Resume />} />
          <Route path="/lab"     element={<Lab />} />
          <Route path="/blog"    element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cv/:slug" element={<CvPage />} />
        </Routes>
      </motion.div>
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
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <IdlePreload />
      <TopNav />
      <FloatingNav />
      <div className="tn-offset" aria-hidden="true" />
      <ScrollToTop />

      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
    </BrowserRouter>
  )
}

export default App
