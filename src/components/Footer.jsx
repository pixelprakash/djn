import { NavLink } from 'react-router-dom'
import { SOCIALS } from '../data/socials'
import SocialIcon from './SocialIcon'
import './Footer.css'

const LINKS = [
  { label: 'About',   path: '/about' },
  { label: 'Work',    path: '/work' },
  { label: 'Resume',  path: '/resume' },
  { label: 'DIC Lab', path: '/lab' },
  { label: 'Blog',    path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-brand">
          <NavLink to="/about" className="ft-logo">DJM</NavLink>
          <p className="ft-tagline">
            Designer, researcher, and creative artist — teaching, making,
            and documenting at IIT Hyderabad.
          </p>
        </div>

        <nav className="ft-links" aria-label="Footer">
          {LINKS.map(l => (
            <NavLink key={l.path} to={l.path} className="ft-link">{l.label}</NavLink>
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
              aria-label={s.label}
            >
              <SocialIcon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="ft-bottom">
        <p>© {year} Deepak John Mathew. All rights reserved.</p>
      </div>
    </footer>
  )
}
