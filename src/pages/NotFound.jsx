import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { notFoundMeta } from '../seo/routes'

/* Shown for any address the site doesn't have. `noindex` (via notFoundMeta)
   keeps it out of search results; the links give people a way forward. */
export default function NotFound() {
  usePageTitle(notFoundMeta())
  return (
    <div style={{ padding: 'clamp(64px, 12vw, 160px) var(--g)', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'var(--fs-hero)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
        Page not found
      </h1>
      <p style={{ marginTop: 20, fontSize: 'var(--fs-subtitle)', color: 'var(--sub)', maxWidth: '34em' }}>
        That address doesn’t exist on this site. You may want one of these instead:
      </p>
      <p style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '1.05rem' }}>
        <Link to="/about">About</Link>
        <Link to="/work">Work</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contact">Contact</Link>
      </p>
    </div>
  )
}
