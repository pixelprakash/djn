import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SOCIALS } from '../data/socials'
import NewsSection from '../components/NewsSection'
import WorkIndex from '../components/WorkIndex'
import hero640 from '../assets/djteaching-640.webp'
import hero960 from '../assets/djteaching-960.webp'
import hero1280 from '../assets/djteaching-1280.webp'
import usePageTitle from '../hooks/usePageTitle'
import { homeMeta } from '../seo/routes'
import './About.css'

const INTERESTS = [
  'Photography',
  'Painting & Printmaking',
  'Design Education',
  'Heritage Preservation',
  'Design Research',
  'VR & Immersive World',
  'Sustainable Design',
]

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

export default function About() {
  usePageTitle(homeMeta())
  return (
    <div className="hp">
      <header className="hp-hero">
        {/* The work comes first: a teaching session, large, with a soft gradient
            plate offset behind it. (Previously a full-bleed portrait.) */}
        <figure className="hp-art">
          <img
            className="hp-art-img"
            src={hero960}
            srcSet={`${hero640} 640w, ${hero960} 960w, ${hero1280} 1280w`}
            sizes="(max-width: 860px) 92vw, 62vw"
            width="1280"
            height="923"
            alt="Prof. Deepak John Mathew teaching a photography workshop, seated on the floor with students around a low table of camera lenses."
            // The largest thing above the fold: fetched ahead of everything else.
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </figure>

        <div className="hp-hero-text">
          <h1 className="hp-title">Prof. Deepak John Mathew</h1>
          <p className="hp-line">
            Professor &amp; Founding head of{' '}
            <MotionLink href="https://design.iith.ac.in" label="Design Dept" />{' '}
            at <MotionLink href="https://www.iith.ac.in" label="IIT Hyderabad" />.
          </p>
          <p className="hp-line">
            A <strong>designer</strong>, <strong>researcher</strong> and <strong>creative artist</strong> at
            heart: driven by curiosity, mentorship and a hands-on love of experimentation.
          </p>
          <p className="hp-line hp-line--small">
            <span className="hp-line-label">Interests</span> {INTERESTS.join(', ')}.
          </p>

          <nav className="hp-links" aria-label="Profiles">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hp-plain">
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* A typographic index of the projects: title, a soft stepped gradient, year. */}
      <WorkIndex projects={PROJECTS} />

      {/* Admissions, openings, talks, recent work -- right under the hero so
          time-sensitive news is seen before the long pinned portfolio
          scroll, not after it. Posts come from Sanity ("News, update or announcement"). */}
      <NewsSection />

    </div>
  )
}
