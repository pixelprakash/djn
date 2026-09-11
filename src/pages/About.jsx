import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SOCIALS } from '../data/socials'
import SocialIcon from '../components/SocialIcon'
import Reveal from '../components/Reveal'
import './About.css'

const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23d8d8d8' width='400' height='300'/%3E%3C/svg%3E"

const WORKS = PROJECTS.map(p => ({
  key: p.slug,
  title: p.title,
  desc: `${p.category} · ${p.venue.split(',')[0]}`,
  image: p.cover,
  href: `/work/${p.slug}`,
}))

// detail: a real, specific anchor for each interest — pulled from his
// actual projects/research/CV elsewhere on the site, not invented copy.
const INTERESTS = [
  { label: 'Photography', icon: 'camera', detail: 'Doob Gaya Hum · 2013' },
  { label: 'Painting & Printmaking', icon: 'palette', detail: 'B.F.A. Painting, 1994' },
  { label: 'Design Education', icon: 'cap', detail: 'Dept. of Design, IITH' },
  { label: 'Heritage Preservation', icon: 'landmark', detail: 'Digital Heritage & AR/VR' },
  { label: 'Design Research', icon: 'search', detail: 'Ph.D. Design Education' },
  { label: 'VR & Immersive World', icon: 'vr', detail: 'Autonomous Drones' },
  { label: 'Sustainable Design', icon: 'leaf', detail: 'Sustainable Systems' },
]

/* Thin-stroke glyphs for the interest chips — same visual language as the
   card arrow / cursor icons elsewhere on this page. */
function InterestIcon({ name }) {
  const common = { viewBox: '0 0 24 24', width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'camera':
      return <svg {...common}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.2" /></svg>
    case 'palette':
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.7 2-1.6 0-.45-.2-.85-.45-1.2-.25-.35-.45-.75-.45-1.2 0-.9.75-1.5 1.6-1.5H16a4 4 0 0 0 4-4C20 6 16.4 3 12 3z" />
          <circle cx="7.3" cy="10.3" r=".9" fill="currentColor" stroke="none" />
          <circle cx="10.3" cy="7.3" r=".9" fill="currentColor" stroke="none" />
          <circle cx="14.3" cy="7.3" r=".9" fill="currentColor" stroke="none" />
          <circle cx="16.8" cy="10.3" r=".9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'landmark':
      return <svg {...common}><path d="M3 21h18M4 21V10M8 21V10M12 21V10M16 21V10M20 21V10M2 10l10-6 10 6" /></svg>
    case 'cap':
      return <svg {...common}><path d="M2 9l10-4 10 4-10 4-10-4z" /><path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" /><path d="M22 9v6" /></svg>
    case 'vr':
      return <svg {...common}><rect x="2" y="7" width="20" height="10" rx="4" /><circle cx="8.5" cy="12" r="1.8" /><circle cx="15.5" cy="12" r="1.8" /><path d="M10.5 12h3" /></svg>
    case 'search':
      return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-5-5" /></svg>
    case 'leaf':
      return <svg {...common}><path d="M5 21c0-8 4-14 14-16-2 10-8 14-14 16z" /><path d="M5 21c2-4 5-7 9-9" /></svg>
    default:
      return null
  }
}

/* Animated underline link — text swaps up to a duplicate copy on hover while
   the underline sweeps in left-to-right (Uiverse "Leo74641727" button style,
   adapted for inline text). The "duplicate" is a CSS ::before with
   content: attr(data-word) — never a real DOM text node — specifically so
   selecting/copying the paragraph (or any innerText-based reader) doesn't
   pick up the word twice. Only one real text node exists per word. */
function MotionLink({ href, label }) {
  const words = label.split(' ')
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hp-link">
      <span className="hp-link-mask">
        {words.map((w, i) => (
          <span className="hp-link-word" data-word={w} key={i}>
            <span className="hp-link-word-real">{w}</span>
          </span>
        ))}
      </span>
    </a>
  )
}

/* Static editorial grid, not a carousel — a scannable "featured + grid"
   layout (one large lead project, four supporting ones) reads as a
   considered curatorial choice, doesn't fight the user for control the
   way an auto-scrolling track does, and needs no play/pause/prev/next
   affordances to be fully usable or accessible. Cards reveal in with a
   short stagger on scroll (same primitive as the rest of the site) rather
   than looping motion that never settles. */
function WorksGrid({ items, color }) {
  return (
    <div className="hp-works-grid">
      {items.map((item, i) => (
        <Reveal
          as={Link}
          to={item.href}
          key={item.key}
          delay={Math.min(i, 4) * 0.07}
          className={`hp-card hp-card--${color} hp-work-${i}`}
        >
          <div className="hp-card-img">
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
              onError={e => { if (e.currentTarget.src !== PH) e.currentTarget.src = PH }}
            />
          </div>
          <div className="hp-card-body">
            <div className="hp-card-text">
              <h3 className="hp-card-title">{item.title}</h3>
              <p className="hp-card-desc">{item.desc}</p>
            </div>
            <span className="hp-card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function WorksPanel({ heading, id, items, color, viewAllHref, viewAllLabel }) {
  return (
    <section className={`hp-panel hp-panel--${color}`} aria-labelledby={id}>
      <div className="hp-panel-head">
        <h2 className="hp-panel-title" id={id}>{heading}</h2>
        {viewAllHref && (
          <Link to={viewAllHref} className="hp-panel-link">{viewAllLabel || 'View all'}</Link>
        )}
      </div>
      <div className="hp-works-wrap">
        <WorksGrid items={items} color={color} />
      </div>
    </section>
  )
}

export default function About() {
  return (
    <div className="hp">
      <header className="hp-hero">
        <div className="hp-hero-text">
          <h1 className="hp-title">Prof. Deepak John Mathew</h1>
          <p className="hp-sub">
            Professor &amp; Founding head of{' '}
            <MotionLink href="https://design.iith.ac.in" label="Design Dept" />{' '}
            at <MotionLink href="https://www.iith.ac.in" label="IIT Hyderabad" />
          </p>
          <p className="hp-bio">
            A designer, researcher, and creative artist at heart — driven by curiosity,
            mentorship, and a hands-on love of experimentation. Author of <em>Principles
            of Design through Photography</em>.
          </p>

          <div className="hp-interests">
            <ul className="hp-interests-list" aria-label="Areas of interest">
              <li className="hp-interests-label" aria-hidden="true">Areas of Interest</li>
              {INTERESTS.map(i => (
                <li className="hp-interest" key={i.label}>
                  {/* A real <button>, not a hover-only <div> — :focus-within
                      below only ever fires from a focusable descendant, and
                      a button is also what lets a tap on touch devices
                      (no :hover) actually reveal the back-of-card detail. */}
                  <button type="button" className="hp-interest-inner" aria-label={`${i.label}: ${i.detail}`}>
                    <span className="hp-interest-front">
                      <InterestIcon name={i.icon} />
                      {i.label}
                    </span>
                    <span className="hp-interest-back" aria-hidden="true">{i.detail}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="hp-hero-photo-col">
          <div className="hp-hero-photo">
            <img
              src="/profliepic.webp"
              alt="Portrait of Prof. Deepak John Mathew"
              draggable="false"
              // Almost certainly this page's LCP element — above the fold,
              // large, and the first meaningfully-sized thing to paint.
              // fetchPriority tells the browser to fetch it ahead of
              // lower-priority requests instead of at default priority.
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={e => { if (e.currentTarget.src !== PH) e.currentTarget.src = PH }}
            />
          </div>
          <div className="hp-socials">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hp-social"
                aria-label={s.label}
              >
                <SocialIcon name={s.icon} size={19} />
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Only Works — RESEARCH above is still explicitly placeholder data
          (stock photos, invented entries) and doesn't belong on the site
          as if it were real content. Works is real, drawn from PROJECTS. */}
      <WorksPanel
        heading="Works"
        id="hp-works-heading"
        items={WORKS}
        color="blue"
        viewAllHref="/work"
        viewAllLabel="View all work"
      />
    </div>
  )
}
