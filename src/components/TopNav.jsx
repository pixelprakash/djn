import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { preloadForPath } from '../routePreload'
import { WORK_CV } from '../routeMeta'
import './TopNav.css'

// Information architecture note (see TopNav.jsx history for the fuller
// writeup): this used to be 8 flat top-level items — About Me, Work,
// Resume, DIC Lab, Blog, Academics, Projects, Publications — four of
// which (About Me's dropdown, Academics, Projects, Publications) were
// really just facets of one CV, presented as unrelated peers with no
// structural link to "Resume," the page that already summarizes them.
// "Projects" was worse than redundant-looking: it hard-coded its own copy
// of sponsored-projects/solo-shows/exhibitions data that had already
// drifted out of sync with Work's real source (exhibitionData.js) — e.g.
// its "Selected Exhibitions" list is missing entries Work's is not.
//
// Fix: Work already covers projects/exhibitions in full, so "Projects" is
// dropped from the nav entirely (its /cv/* routes still resolve, just
// unlinked — no broken bookmarks). The other three collapse into Resume's
// own dropdown, grouped, so the nav now says what's actually true: Resume
// is the CV, and everything under it is that CV's detail.
const NAV_ITEMS = [
  { label: 'About Me', path: '/about' },
  { label: 'Work',      path: '/work' },
  {
    label: 'Resume',
    path: '/resume',
    groups: [
      {
        heading: 'Background',
        items: [
          { label: 'Educational Qualifications', path: '/cv/educational-qualifications' },
          { label: 'Scholarships & Awards',      path: '/cv/scholarships-awards' },
          { label: 'Professional Experience',    path: '/cv/professional-experience' },
        ],
      },
      {
        heading: 'Teaching',
        items: [
          { label: 'Teaching Experience',   path: '/cv/teaching-experience' },
          { label: 'Thesis Guidance',       path: '/cv/thesis-guidance' },
          { label: 'Visiting Appointments', path: '/cv/visiting-appointments' },
        ],
      },
      {
        heading: 'Publications',
        items: [
          { label: 'Books',                  path: '/cv/books' },
          { label: 'Papers & Publications',  path: '/cv/papers-publications' },
          { label: 'Training Programs',      path: '/cv/training-programs' },
          { label: 'Conferences & Journals', path: '/cv/conferences-journals' },
        ],
      },
    ],
  },
  { label: 'News', path: '/news' },
  { label: 'Blogs', path: '/blogs' },
  // Points off-site to the DIC Nodal centre's own site rather than the
  // in-repo /lab page — external, so it's a plain <a>, not a NavLink, and
  // gets the "leaves this site" arrow instead of participating in the
  // active-route highlighting the internal items use.
  { label: 'DIC Lab', href: 'https://dic-site.vercel.app', external: true },
]

// Which top-level item owns the current page. Plain prefix matching, plus
// the /cv/* detail pages: those belong to Resume, except the three that
// are really Work (shows, exhibitions, funded projects) -- so on any
// sub-page the nav still says where you are, instead of lighting nothing.
function isItemActive(item, pathname) {
  if (item.external || !item.path) return false
  const [, seg, slug] = pathname.split('/')
  if (seg === 'cv') return item.path === (WORK_CV.has(slug) ? '/work' : '/resume')
  return pathname === item.path || pathname.startsWith(item.path + '/')
}

// "Leaves this site" indicator for external nav items — a plain diagonal
// arrow, not the dropdown chevron, so the two affordances stay visually
// distinct (one says "opens a submenu here," the other "takes you away").
function ExternalArrow({ width = 13, height = 13 }) {
  return (
    <svg
      className="tn-external-arrow"
      width={width} height={height}
      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function TopNav() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [mobileExp, setMobileExp]     = useState(null)
  const [openMenu, setOpenMenu]   = useState(null)  // label of the open dropdown
  const [hoverLabel, setHoverLabel] = useState(null)
  const [slide, setSlide]           = useState({ x: 0, y: 0, w: 0, show: false, instant: true, hot: false })
  const navRef = useRef(null)
  const linksRef = useRef(null)
  // const progressRef = useRef(null) // reading-progress line -- switched off for now
  const escRef = useRef(false) // Escape just closed a menu: the refocus that follows must not reopen it
  const { pathname } = useLocation()

  const activeLabel = (NAV_ITEMS.find(it => isItemActive(it, pathname)) || {}).label || null
  const targetLabel = hoverLabel || activeLabel

  // One underline that glides to whichever link is hovered, and settles
  // back on the current section when the pointer leaves -- measured, not
  // per-link, so it can move between items instead of popping in and out.
  useLayoutEffect(() => {
    const wrap = linksRef.current
    if (!wrap) return
    const place = () => {
      const link = targetLabel && wrap.querySelector(`[data-nav="${targetLabel}"] .tn-link`)
      const b = link && link.getBoundingClientRect()
      if (!b || !b.width) { setSlide(s => (s.show ? { ...s, show: false } : s)); return }
      const a = wrap.getBoundingClientRect()
      setSlide(s => ({
        x: b.left - a.left + 16,
        y: b.bottom - a.top - 4,
        w: b.width - 32,
        show: true,
        instant: !s.show, // first appearance: fade in place, don't fly in from the left
        hot: targetLabel !== activeLabel,
      }))
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(wrap)
    if (document.fonts) document.fonts.ready.then(place)
    return () => ro.disconnect()
  }, [targetLabel, activeLabel])

  /* Reading-progress line -- switched off for now (see the .tn-progress rules
     in TopNav.css and the matching <span> below; restore all three together).
    // Reading progress along the nav's bottom edge, on pages long enough to
    // scroll. Written straight to the element (no React state) so scrolling
    // never re-renders the nav.
    useEffect(() => {
      const bar = progressRef.current
      const root = document.getElementById('root')
      if (!bar) return
      let raf = 0
      const update = () => {
        raf = 0
        const sc = root && root.scrollHeight > root.clientHeight + 1 ? root : document.scrollingElement
        const max = sc.scrollHeight - sc.clientHeight
        const p = max > 0 ? Math.min(1, sc.scrollTop / max) : 0
        bar.style.transform = `scaleX(${p})`
        bar.style.opacity = max > sc.clientHeight * 0.6 && p > 0.004 ? '1' : '0'
      }
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
      const targets = [root, window].filter(Boolean)
      targets.forEach(t => t.addEventListener('scroll', onScroll, { passive: true }))
      window.addEventListener('resize', onScroll)
      const ro = new ResizeObserver(onScroll)
      const main = document.getElementById('main-content')
      if (main) ro.observe(main)
      update()
      return () => {
        targets.forEach(t => t.removeEventListener('scroll', onScroll))
        window.removeEventListener('resize', onScroll)
        ro.disconnect()
        if (raf) cancelAnimationFrame(raf)
      }
    }, [pathname])
  */

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = e => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    const root = document.getElementById('root') || window
    const onScroll = () => setScrolled((root.scrollTop || window.scrollY) > 60)
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Lock the page's own scroll container while the full-screen mobile
  // menu is open, so it doesn't feel like the page keeps scrolling
  // "behind" an overlay that's supposed to be the only thing on screen.
  useEffect(() => {
    const scroller = document.getElementById('root')
    if (!scroller) return
    if (mobileOpen) scroller.style.overflow = 'hidden'
    else scroller.style.overflow = ''
    return () => { scroller.style.overflow = '' }
  }, [mobileOpen])

  const navEl = (
    <header className={`tn${scrolled ? ' tn--scrolled' : ''}`} ref={navRef}>
      <div className="tn-inner">

        {/* Logo */}
        <NavLink to="/about" className="tn-logo" aria-label="Deepak John Mathew, home" onClick={() => setMobileOpen(false)}>
          <span className="tn-logo-mark">DJM</span>
          <span className="tn-logo-name">Deepak John Mathew</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="tn-links" ref={linksRef}>
          {NAV_ITEMS.map(item => {
            const active = isItemActive(item, pathname)
            const open = openMenu === item.label
            const dropId = `tn-drop-${item.label.toLowerCase()}`
            return (
              <div
                key={item.label}
                data-nav={item.label}
                className={`tn-item${open ? ' tn-item--open' : ''}`}
                onMouseEnter={() => { setHoverLabel(item.label); if (item.groups) setOpenMenu(item.label) }}
                onMouseLeave={() => { setHoverLabel(null); if (item.groups) setOpenMenu(null) }}
                onFocus={() => { if (item.groups && !escRef.current) setOpenMenu(item.label) }}
                onBlur={e => {
                  if (item.groups && !e.currentTarget.contains(e.relatedTarget)) setOpenMenu(null)
                }}
                onKeyDown={e => {
                  if (e.key === 'Escape' && open) {
                    setOpenMenu(null)
                    escRef.current = true
                    e.currentTarget.querySelector('.tn-link').focus()
                    setTimeout(() => { escRef.current = false }, 0)
                  }
                }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tn-link"
                  >
                    {item.label}
                    <ExternalArrow />
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`tn-link${active ? ' tn-link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    {...(item.groups && { 'aria-haspopup': 'true', 'aria-expanded': open, 'aria-controls': dropId })}
                    onMouseEnter={() => preloadForPath(item.path)}
                    onFocus={() => preloadForPath(item.path)}
                  >
                    {item.label}
                    {item.groups && (
                      <svg className="tn-chevron" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    )}
                  </Link>
                )}

                {item.groups && (
                  <div className="tn-drop" id={dropId}>
                    <div className="tn-drop-inner">
                      {item.groups.map(group => (
                        <div className="tn-drop-group" key={group.heading}>
                          <span className="tn-drop-heading">{group.heading}</span>
                          {group.items.map(child => (
                            <NavLink
                              key={child.label}
                              to={child.path}
                              className="tn-drop-link"
                              onClick={() => setOpenMenu(null)}
                              onMouseEnter={() => preloadForPath(child.path)}
                              onFocus={() => preloadForPath(child.path)}
                            >
                              <span className="tn-drop-arrow">&#8594;</span>
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <span
            className={`tn-slider${slide.show ? ' tn-slider--on' : ''}${slide.instant ? ' tn-slider--instant' : ''}${slide.hot ? ' tn-slider--hot' : ''}`}
            style={{ width: slide.w, transform: `translate(${slide.x}px, ${slide.y}px)` }}
            aria-hidden="true"
          />
        </nav>

        {/* Contact CTA — always visible, right-aligned */}
        <NavLink
          to="/contact"
          className={({ isActive }) => `tn-cta${isActive ? ' tn-cta--active' : ''}`}
          onClick={() => setMobileOpen(false)}
          onMouseEnter={() => preloadForPath('/contact')}
          onFocus={() => preloadForPath('/contact')}
        >
          Contact
        </NavLink>

        {/* Hamburger */}
        <button
          className={`tn-burger${mobileOpen ? ' tn-burger--open' : ''}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="tn-mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* <span className="tn-progress" ref={progressRef} aria-hidden="true" /> */}

      {/* Mobile menu */}
      <div id="tn-mobile-menu" className={`tn-mobile${mobileOpen ? ' tn-mobile--open' : ''}`} inert={!mobileOpen}>
        <div className="tn-mobile-inner">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="tn-mobile-item">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tn-mobile-link"
                  onClick={() => { setMobileOpen(false); setMobileExp(null) }}
                >
                  {item.label}
                  <ExternalArrow width={14} height={14} />
                </a>
              ) : item.groups ? (
                <>
                  <button
                    className={`tn-mobile-link${mobileExp === item.label ? ' tn-mobile-link--open' : ''}${isItemActive(item, pathname) ? ' tn-mobile-link--current' : ''}`}
                    onClick={() => setMobileExp(v => v === item.label ? null : item.label)}
                    aria-expanded={mobileExp === item.label}
                  >
                    {item.label}
                    <svg className="tn-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <div
                    className={`tn-mobile-sub${mobileExp === item.label ? ' tn-mobile-sub--open' : ''}`}
                    inert={mobileExp !== item.label}
                  >
                    {/* The button above only expands/collapses (matches the
                        established pattern for grouped items) — without this,
                        tapping "Resume" on mobile would have no way to reach
                        the summary page itself, only its detail sub-pages. */}
                    {item.path && (
                      <NavLink
                        to={item.path}
                        className="tn-mobile-sublink tn-mobile-sublink--overview"
                        onClick={() => { setMobileOpen(false); setMobileExp(null) }}
                        onFocus={() => preloadForPath(item.path)}
                      >
                        View full résumé &#8594;
                      </NavLink>
                    )}
                    {item.groups.map(group => (
                      <div className="tn-mobile-group" key={group.heading}>
                        <span className="tn-mobile-group-heading">{group.heading}</span>
                        {group.items.map(child => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            className="tn-mobile-sublink"
                            onClick={() => { setMobileOpen(false); setMobileExp(null) }}
                            onFocus={() => preloadForPath(child.path)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={`tn-mobile-link${isItemActive(item, pathname) ? ' tn-mobile-link--current' : ''}`}
                  aria-current={isItemActive(item, pathname) ? 'page' : undefined}
                  onClick={() => { setMobileOpen(false); setMobileExp(null) }}
                  onFocus={() => preloadForPath(item.path)}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  )

  return createPortal(navEl, document.documentElement)
}