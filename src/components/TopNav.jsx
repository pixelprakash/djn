import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { preloadForPath } from '../routePreload'
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
  { label: 'Blog', path: '/blog' },
  // Points off-site to the DIC Nodal centre's own site rather than the
  // in-repo /lab page — external, so it's a plain <a>, not a NavLink, and
  // gets the "leaves this site" arrow instead of participating in the
  // active-route highlighting the internal items use.
  { label: 'DIC Lab', href: 'https://dic-site.vercel.app', external: true },
]

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
  const navRef = useRef(null)

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
        <NavLink to="/about" className="tn-logo" onClick={() => setMobileOpen(false)}>
          DJM
        </NavLink>

        {/* Desktop nav */}
        <nav className="tn-links">
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className="tn-item"
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
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `tn-link${isActive ? ' tn-link--active' : ''}`
                  }
                  onMouseEnter={() => preloadForPath(item.path)}
                  onFocus={() => preloadForPath(item.path)}
                >
                  {item.label}
                  {item.groups && (
                    <svg className="tn-chevron" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  )}
                </NavLink>
              )}

              {item.groups && (
                <div className="tn-drop">
                  <div className="tn-drop-inner">
                    {item.groups.map(group => (
                      <div className="tn-drop-group" key={group.heading}>
                        <span className="tn-drop-heading">{group.heading}</span>
                        {group.items.map(child => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            className="tn-drop-link"
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
          ))}
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
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="tn-mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

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
                    className={`tn-mobile-link${mobileExp === item.label ? ' tn-mobile-link--open' : ''}`}
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
                  className="tn-mobile-link"
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