import { NavLink } from 'react-router-dom'
import { SOCIALS } from '../data/socials'
import SocialIcon from './SocialIcon'
import GridPulse from './GridPulse'
import './Footer.css'

const LINKS = [
  { label: 'About',   path: '/about' },
  { label: 'Work',    path: '/work' },
  { label: 'Resume',  path: '/resume' },
  { label: 'DIC Lab', path: '/lab' },
  { label: 'News',    path: '/news' },
  { label: 'Blogs',   path: '/blogs' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ft">
      {/* Prism-spectrum grid under everything -- see GridPulse.jsx. Text
          marked data-grid-avoid is what the light holds back from. */}
      <GridPulse />
      <span className="ft-spectrum" aria-hidden="true" />

      <div className="ft-inner">
        <div className="ft-brand">
          <NavLink to="/about" className="ft-logo" data-grid-avoid>DJM</NavLink>
          <p className="ft-tagline" data-grid-avoid>
            Designer, researcher, and creative artist — teaching, making,
            and documenting at IIT Hyderabad.
          </p>
        </div>

        <nav className="ft-links" aria-label="Footer">
          {LINKS.map(l => (
            <NavLink key={l.path} to={l.path} className="ft-link" data-grid-avoid>{l.label}</NavLink>
          ))}
        </nav>

        <div className="ft-socials" aria-label="Social links">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              data-grid-avoid
              aria-label={s.label}
            >
              <SocialIcon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="ft-bottom">
        <p data-grid-avoid>© {year} Deepak John Mathew. All rights reserved.</p>
      </div>
    </footer>
  )
}
