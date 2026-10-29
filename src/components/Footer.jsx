import { NavLink } from 'react-router-dom'
import { SOCIALS } from '../data/socials'
// import FooterPrism from './FooterPrism' // the "Photography is writing with light." scene (switched off)
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

/* The site footer, on every page: a light surface with a thin edge of the
   signature gradient, the name, a one-line statement, the pages and the
   profiles as plain text links. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ft">
      <span className="ft-edge" aria-hidden="true" />

      {/* The closing scene ("Photography is writing with light.": light through a prism)
          is switched off. To bring it back, uncomment the import above and this line.
      <FooterPrism />
      */}

      <div className="ft-inner">
        <div className="ft-brand">
          <NavLink to="/about" className="ft-logo">Deepak John Mathew</NavLink>
          <p className="ft-tagline">
            Designer, researcher, and creative artist: teaching, making,
            and documenting at IIT Hyderabad.
          </p>
        </div>

        <nav className="ft-col" aria-label="Footer">
          <p className="ft-col-label" aria-hidden="true">Pages</p>
          {LINKS.map(l => (
            <NavLink key={l.path} to={l.path} className="ft-link">{l.label}</NavLink>
          ))}
        </nav>

        <div className="ft-col" aria-label="Profiles" role="group">
          <p className="ft-col-label" aria-hidden="true">Profiles</p>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ft-link">
              {s.label} <span aria-hidden="true">&#8599;</span>
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
