import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import './TopNav.css'

const NAV_ITEMS = [
  {
    label: 'About Me',
    path: '/about',
    children: [
      { label: 'Educational Qualifications', path: '/cv/educational-qualifications' },
      { label: 'Scholarships & Awards',      path: '/cv/scholarships-awards' },
      { label: 'Professional Experience',    path: '/cv/professional-experience' },
    ],
  },
  {
    label: 'Academics',
    path: '/cv/teaching-experience',
    children: [
      { label: 'Teaching Experience',   path: '/cv/teaching-experience' },
      { label: 'Thesis Guidance',       path: '/cv/thesis-guidance' },
      { label: 'Visiting Appointments', path: '/cv/visiting-appointments' },
    ],
  },
  {
    label: 'Projects',
    path: '/cv/sponsored-projects',
    children: [
      { label: 'Sponsored Projects',   path: '/cv/sponsored-projects' },
      { label: 'Solo Shows',           path: '/cv/solo-shows' },
      { label: 'Selected Exhibitions', path: '/cv/selected-exhibitions' },
    ],
  },
  {
    label: 'Publications',
    path: '/cv/books',
    children: [
      { label: 'Books',                  path: '/cv/books' },
      { label: 'Papers & Publications',  path: '/cv/papers-publications' },
      { label: 'Training Programs',      path: '/cv/training-programs' },
      { label: 'Conferences & Journals', path: '/cv/conferences-journals' },
    ],
  },
]

export default function TopNav() {
  const [scrolled, setScrolled]       = useState(false)
  const [open, setOpen]               = useState(null)
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
        setOpen(null); setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

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
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `tn-link${isActive ? ' tn-link--active' : ''}`
                }
                onClick={() => setOpen(null)}
              >
                {item.label}
                <svg className="tn-chevron" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </NavLink>

              <div className="tn-drop">
                <div className="tn-drop-inner">
                  {item.children.map(child => (
                    <NavLink
                      key={child.label}
                      to={child.path}
                      className="tn-drop-link"
                      onClick={() => setOpen(null)}
                    >
                      <span className="tn-drop-arrow">&#8594;</span>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`tn-burger${mobileOpen ? ' tn-burger--open' : ''}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`tn-mobile${mobileOpen ? ' tn-mobile--open' : ''}`}>
        <div className="tn-mobile-inner">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="tn-mobile-item">
              <button
                className={`tn-mobile-link${mobileExp === item.label ? ' tn-mobile-link--open' : ''}`}
                onClick={() => setMobileExp(v => v === item.label ? null : item.label)}
              >
                {item.label}
                <svg className="tn-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className={`tn-mobile-sub${mobileExp === item.label ? ' tn-mobile-sub--open' : ''}`}>
                {item.children.map(child => (
                  <NavLink
                    key={child.label}
                    to={child.path}
                    className="tn-mobile-sublink"
                    onClick={() => { setMobileOpen(false); setMobileExp(null) }}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )

  return createPortal(navEl, document.documentElement)
}