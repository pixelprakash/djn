import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom"
import useReducedMotion from "./hooks/useReducedMotion"
import TopNav     from "./components/TopNav"
import CustomCursor from "./components/CustomCursor"
import Footer from "./components/Footer"
import { routeImports, preloadAllRoutes, preloadForPath } from "./routePreload"
// About is the default landing route ("/" redirects here), so it's imported
// eagerly — lazy-loading it would add a chunk-fetch round trip to the most
// common page load instead of saving one.
import About from "./pages/About"
import { PROJECTS } from "./pages/projectData"
import { CV_TITLES } from "./seo/routes"
import NotFound from "./pages/NotFound"
import ShutterBlades from "./components/ShutterBlades"
import { applyShutter, makeShutterRefs, shutterRegistrar } from "./utils/shutter"

import "./App.css"

// The intro (and the animation library behind it) is only downloaded when it
// is going to play: the first visit of a browsing session, and not for people
// who asked for reduced motion. Everyone else skips ~70 KB of script.
const IntroLoader = lazy(() => import("./components/IntroLoader"))
const INTRO_KEY = "djm-intro-seen"
const SHOW_INTRO = (() => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
    if (sessionStorage.getItem(INTRO_KEY)) return false
    sessionStorage.setItem(INTRO_KEY, "1")
    return true
  } catch { return true }
})()

// GSAP drives the page transitions. It loads in the background right after the
// first paint; until it is there a navigation simply swaps the page.
let gsap = null
let gsapLoading = null
const loadGsap = () => gsapLoading || (gsapLoading = import("gsap").then(m => (gsap = m.default)))

const Work         = lazy(routeImports.work)
const ProjectDetail = lazy(routeImports.projectDetail)
const Resume       = lazy(routeImports.resume)
const Lab          = lazy(routeImports.lab)
const Blog         = lazy(routeImports.blog)
const BlogPost     = lazy(routeImports.blogPost)
const News         = lazy(routeImports.news)
const NewsPost     = lazy(routeImports.newsPost)
const Contact      = lazy(routeImports.contact)
const CvPage       = lazy(routeImports.cv)

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span className="page-loader-mark">DJM</span>
    </div>
  )
}

// /blog/:slug -> /blogs/:slug
function OldBlogPost() {
  const { slug } = useParams()
  return <Navigate to={`/blogs/${slug}`} replace />
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
        <Route path="/blogs"   element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/news"    element={<News />} />
        <Route path="/news/:slug" element={<NewsPost />} />
        {/* The section used to live at /blog: old links, bookmarks and search
            results keep working. */}
        <Route path="/blog"    element={<Navigate to="/blogs" replace />} />
        <Route path="/blog/:slug" element={<OldBlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv/:slug" element={<CvPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

/* What the curtain says while it's covering the screen: where you're
   going. CV sub-pages name themselves (titles match CvPage's PAGES -- kept
   here so the lazy CvPage chunk isn't pulled into the main bundle). */
// A project page gets its own transition: a camera shutter closes, a gallery
// wall label (category, title, venue, year) shows on it, and the blades part
// onto the project (see PageTransition). Deliberately not the cover photo --
// that is the first thing the project page itself shows.
function projectFor(pathname) {
  const [seg, slug] = pathname.split('/').filter(Boolean)
  return seg === 'work' && slug ? PROJECTS.find(p => p.slug === slug) || null : null
}

// A blog article opens with the quietest transition on the site: no cover, no
// label -- a short crossfade and a thin accent line across the top, like a
// good editorial site. It is for reading, so it gets out of the way.
const isArticle = pathname => {
  const [seg, slug] = pathname.split('/').filter(Boolean)
  return seg === 'blogs' && Boolean(slug)
}

// An update's own page (/news/:slug) opens with a set of newspaper-style columns
// that drop across the screen in a wave and slide away again as the page rises.
// No text: the page's own heading is the first thing you read, so the
// transition doesn't repeat it.
const isNewsItem = pathname => {
  const [seg, slug] = pathname.split('/').filter(Boolean)
  return seg === 'news' && Boolean(slug)
}

function labelFor(pathname) {
  const [seg, slug] = pathname.split('/').filter(Boolean)
  switch (seg) {
    case 'work':    return projectFor(pathname) ? projectFor(pathname).title : 'Work'
    case 'resume':  return 'Resume'
    case 'lab':     return 'DIC Lab'
    case 'blogs':   return 'Blogs'
    case 'news':    return 'News & Updates'
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
  const panel = useRef(null)       // the curved ink sheet (every page but projects)
  const shutterBox = useRef(null)  // the camera shutter (project pages)
  const bar = useRef(null)         // the thin progress line (blog articles)
  const cols = useRef(null)        // the newspaper columns (news updates)
  const shutterRefs = useRef(makeShutterRefs())
  const kicker = useRef(null)
  const label = useRef(null)
  const rule = useRef(null)
  const venue = useRef(null)
  const page = useRef(null)

  const commit = next => {
    shownRef.current = next
    flushSync(() => setShown(next))
    document.getElementById('root')?.scrollTo({ top: 0 })
    // Tell assistive technology the page changed (see RouteAnnouncer).
    window.dispatchEvent(new Event('route-shown'))
  }

  // Re-pointed every render so the timeline's callbacks (below) never
  // close over a stale commit/latest.
  playRef.current = () => {
    if (!gsap) {
      // Animation library not here yet (very fast click): swap without ceremony.
      // (Deferred a tick: flushSync must not run inside the effect that got us here.)
      loadGsap()
      busy.current = true
      queueMicrotask(() => { commit(latest.current); busy.current = false })
      return
    }
    busy.current = true
    // While a transition runs, the lazy-loading placeholder is hidden (see
    // App.css): React holds it for a moment after the page code arrives, and it
    // must not flash through the open transitions.
    document.documentElement.dataset.pt = '1'
    const project = projectFor(latest.current.pathname)
    const text = labelFor(latest.current.pathname)
    label.current.textContent = text
    label.current.dataset.long = text.length > 18 ? 'true' : 'false'

    // Each kind of destination has its own transition: project pages get the
    // camera shutter (with a wall label), blog articles a plain crossfade,
    // everything else the curved ink curtain.
    const article = !project && isArticle(latest.current.pathname)
    const item = !project && !article && isNewsItem(latest.current.pathname)
    const meta = project ? { kicker: [project.category, project.year], venue: project.venue } : null
    const covers = !article && !item // the curtain / shutter surfaces and the label
    panel.current.style.display = project || article || item ? 'none' : 'block'
    cols.current.style.display = item ? 'flex' : 'none'
    shutterBox.current.style.display = project ? 'block' : 'none'
    label.current.closest('.pt-label').style.display = covers ? '' : 'none'
    const kickerText = meta ? meta.kicker.filter(Boolean).join('  \u00b7  ') : ''
    kicker.current.parentNode.style.display = kickerText ? 'block' : 'none'
    venue.current.parentNode.style.display = meta && meta.venue ? 'block' : 'none'
    if (meta) {
      kicker.current.textContent = kickerText
      venue.current.textContent = meta.venue || ''
    }
    const lines = meta ? [kicker.current, venue.current] : []
    const textEls = [label.current, rule.current, ...lines]

    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
        delete document.documentElement.dataset.pt
        gsap.set(page.current, { clearProps: 'transform,opacity,overflow' })
        gsap.set(curtain.current, { autoAlpha: 0, pointerEvents: 'none' })
        // Something else was asked for while this ran.
        if (latest.current.pathname !== shownRef.current.pathname) playRef.current()
        else if (latest.current !== shownRef.current) commit(latest.current)
      },
    })

    // Fully covered: swap the page underneath, unseen, and park it a
    // little low so it can rise into place as the cover leaves.
    const swap = () => {
      commit(latest.current)
      gsap.set(page.current, { opacity: 1, y: 56, overflow: 'clip' })
    }

    tl.set(curtain.current, { autoAlpha: 1, pointerEvents: 'auto' })

    if (project) {
      // ── Project: shutter closes, wall label, shutter opens ──
      const sh = { o: 1 }
      const drive = () => applyShutter(shutterRefs.current, sh.o)
      drive() // start fully open (see-through)

      tl.to(sh, { o: 0, duration: 0.55, ease: 'power3.inOut', onUpdate: drive }, 0)
        .to(page.current, { opacity: 0.5, duration: 0.55, ease: 'power2.in' }, 0)

        // The wall label sets itself line by line on the closed shutter.
        .fromTo(kicker.current, { yPercent: 115 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.42)
        .fromTo(label.current, { yPercent: 115 }, { yPercent: 0, duration: 0.55, ease: 'power3.out' }, 0.5)
        .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.out' }, 0.62)
        .fromTo(venue.current, { yPercent: 115 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.7)

        .call(swap, null, 0.62)

        // Label clears, the blades part, the project rises into view.
        .to(textEls, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.2)
        .to(sh, { o: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: drive }, 1.28)
        .to(page.current, { y: 0, duration: 0.85, ease: 'power3.out' }, 1.28)
        .set(textEls, { opacity: 1 })
    } else if (item) {
      // ── News update: columns drop in across the screen, hold, slide away ──
      // Six ink columns, each edged in the brand blue, fall into place left to
      // right (the page dims under them), the page is swapped while they cover
      // it, then they slide off the bottom in the same wave as the new page
      // rises into view. No text, so nothing repeats the page's own heading.
      const colEls = [...cols.current.children]
      const gap = 0.055
      const covered = 0.55 + gap * (colEls.length - 1) // when the last column lands
      // The new page's code is fetched meanwhile; if it isn't here yet when the
      // swap is due (slow connection) the columns simply hold until it is.
      const ready = Promise.resolve(preloadForPath(latest.current.pathname)).catch(() => {})
      gsap.set(colEls, { yPercent: -101 })
      tl.to(colEls, { yPercent: 0, duration: 0.55, ease: 'power4.inOut', stagger: gap }, 0)
        .to(page.current, { opacity: 0.5, duration: 0.7, ease: 'power2.in' }, 0)
        .call(() => {
          tl.pause()
          Promise.race([ready, new Promise(r => setTimeout(r, 2500))]).then(() => {
            commit(latest.current)
            gsap.set(page.current, { opacity: 1, y: 56, overflow: 'clip' })
            tl.resume()
          })
        }, null, covered + 0.04)
        .to(colEls, { yPercent: 101, duration: 0.6, ease: 'power4.inOut', stagger: gap }, covered + 0.2)
        .to(page.current, { y: 0, duration: 0.95, ease: 'power3.out' }, covered + 0.2)
    } else if (article) {
      // ── Article: crossfade, with a thin accent line sweeping the top ──
      // The article's own entrance (title, meta, cover) plays on mount, so
      // all this has to do is clear the old page and let the new one in.
      tl.set(curtain.current, { pointerEvents: 'none' })
        .fromTo(bar.current, { scaleX: 0, opacity: 1 }, { scaleX: 0.72, duration: 0.4, ease: 'power2.out' }, 0)
        .to(page.current, { opacity: 0, duration: 0.2, ease: 'power1.in' }, 0)
        .call(() => {
          commit(latest.current)
          gsap.set(page.current, { opacity: 0, y: 14 })
        }, null, 0.22)
        .to(bar.current, { scaleX: 1, duration: 0.25, ease: 'power2.inOut' }, 0.4)
        .to(page.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.26)
        .to(bar.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.62)
    } else {
      // ── Everything else: the curved ink curtain ──
      tl.set(panel.current, { yPercent: 78 })

        // In: the panel climbs over the page while the page dims beneath it.
        .to(panel.current, { yPercent: 0, duration: 0.55, ease: 'power4.inOut' }, 0)
        .to(page.current, { opacity: 0.45, duration: 0.55, ease: 'power2.in' }, 0)

        // The destination's name rises out of a mask, its rule draws under it.
        .fromTo(label.current, { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
        .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.out' }, 0.48)

        .call(swap, null, 0.62)

        // Out: the panel carries on upward and off; the name lifts away; the
        // new page settles up into position behind it.
        .to([label.current, rule.current], { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.84)
        .to(panel.current, { yPercent: -84, duration: 0.7, ease: 'power4.inOut' }, 0.84)
        .to(page.current, { y: 0, duration: 0.85, ease: 'power3.out' }, 0.84)
        .set([label.current, rule.current], { opacity: 1 })
    }
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
    if (reduceMotion) { queueMicrotask(() => commit(location)); return }
    if (!busy.current) playRef.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, reduceMotion])

  useEffect(() => () => { if (gsap) gsap.killTweensOf([panel.current, ...(cols.current ? cols.current.children : []), bar.current, kicker.current, label.current, rule.current, venue.current, page.current]) }, [])

  return (
    <>
      <div ref={page}>
        <RouteSwitch location={shown} />
      </div>

      <div ref={curtain} className="pt" aria-hidden="true">
        <div ref={panel} className="pt-sheet">
          <svg className="pt-layer" viewBox="0 0 100 150" preserveAspectRatio="none">
            <path className="pt-fill" d="M0,16 Q50,-4 100,16 L100,144 Q50,104 0,144 Z" />
            <path className="pt-edge" d="M0,16 Q50,-4 100,16" />
            <path className="pt-edge pt-edge--b" d="M0,144 Q50,104 100,144" />
          </svg>
        </div>
        <div ref={shutterBox} className="pt-shutterbox">
          <ShutterBlades prefix="ps" startOpen reg={shutterRegistrar(shutterRefs.current)} />
        </div>
        <div ref={cols} className="pt-cols">
          {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className="pt-col" />)}
        </div>
        <div ref={bar} className="pt-bar" />
        <div className="pt-label">
          <div className="pt-label-mask pt-label-mask--sm"><span ref={kicker} className="pt-kicker" /></div>
          <div className="pt-label-mask"><span ref={label} className="pt-label-text" /></div>
          <span ref={rule} className="pt-rule" />
          <div className="pt-label-mask pt-label-mask--sm"><span ref={venue} className="pt-venue" /></div>
        </div>
      </div>
    </>
  )
}

/* WCAG 2.4.3 / 4.1.3: in a single-page app the browser does not announce a
   navigation. After each page swap this announces the new page's title in a
   live region and moves focus to the main landmark, so a screen-reader or
   keyboard user lands at the top of the new content instead of staying on a
   link from the previous page. (Not on the first load: nothing changed.) */
function RouteAnnouncer() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    let t
    const onShown = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        setMsg(document.title)
        const main = document.getElementById('main-content')
        if (main) main.focus({ preventScroll: true })
      }, 200)
    }
    window.addEventListener('route-shown', onShown)
    return () => { window.removeEventListener('route-shown', onShown); clearTimeout(t) }
  }, [])
  return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{msg}</div>
}

// Warms every other route's chunk once the browser is idle, so clicking any
// nav link is instant afterwards — not just when a hover happened to fire
// preloadForPath first (e.g. touch devices, or a click too fast to hover).
function IdlePreload() {
  useEffect(() => {
    // Not on data-saver or very slow connections: spend their data on what
    // they asked for, not on pages they may never open.
    const conn = navigator.connection
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return

    // Wait until the page has finished loading and settled (a couple of
    // seconds), so these ~25 background requests never compete with the first
    // paint or the hero photograph for bandwidth and the main thread.
    let timer, idle
    const cancelIdle = window.cancelIdleCallback || clearTimeout
    const requestIdle = window.requestIdleCallback || (cb => setTimeout(cb, 300))
    const start = () => {
      timer = setTimeout(() => {
        idle = requestIdle(() => { loadGsap(); preloadAllRoutes() })
      }, 2500)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      clearTimeout(timer)
      if (idle) cancelIdle(idle)
    }
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter>
      {SHOW_INTRO && (
        <Suspense fallback={<div className="il-boot" aria-hidden="true" />}>
          <IntroLoader />
        </Suspense>
      )}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <IdlePreload />
      <RouteAnnouncer />
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
