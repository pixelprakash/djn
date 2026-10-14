import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SOCIALS } from '../data/socials'
import NewsSection from '../components/NewsSection'
import WorkIndex from '../components/WorkIndex'
import AtWork from '../components/AtWork'
import HeroSlider from '../components/HeroSlider'
import LatestNotice from '../components/LatestNotice'
import HomeLayoutSwitch from '../components/HomeLayoutSwitch'
import useHomeLayout from '../hooks/useHomeLayout'
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

/* The intro text, shared by both layouts. */
function Intro() {
  return (
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
  )
}

export default function About() {
  usePageTitle(homeMeta())
  const [layout, setLayout] = useHomeLayout()

  return (
    <div className="hp">
      {layout === 2 ? (
        <>
          {/* OPTION 2 -- work first. A slim notice for anything open or new, the
              selected works as a slideshow hero, then the news. */}
          <LatestNotice />

          <header className="hp-hero">
            {/* The selected works, one by one, as a slideshow. */}
            <HeroSlider projects={PROJECTS} />
            <Intro />
          </header>

          <NewsSection />
          <AtWork withPhoto />
        </>
      ) : (
        <>
          {/* OPTION 1 -- photo first (the layout as originally built). */}
          <header className="hp-hero">
            <figure className="hp-art">
              <img
                className="hp-art-img"
                src={hero960}
                srcSet={`${hero640} 640w, ${hero960} 960w, ${hero1280} 1280w`}
                sizes="(max-width: 860px) 92vw, 62vw"
                width="1280"
                height="923"
                alt="Prof. Deepak John Mathew teaching a photography workshop, seated on the floor with students around a low table of camera lenses."
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </figure>
            <Intro />
          </header>

          <AtWork />
          <WorkIndex projects={PROJECTS} />
          <NewsSection />
        </>
      )}

      <HomeLayoutSwitch value={layout} onChange={setLayout} />
    </div>
  )
}
