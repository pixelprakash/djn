import { Link } from 'react-router-dom'
import { PROJECTS } from './projectData'
import { SOCIALS } from '../data/socials'
import SocialIcon from '../components/SocialIcon'
import WorksTimeline from '../components/WorksTimeline'
import NewsSection from '../components/NewsSection'
import Portrait from '../components/Portrait'
import usePageTitle from '../hooks/usePageTitle'
import './About.css'

const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23d8d8d8' width='400' height='300'/%3E%3C/svg%3E"

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
  usePageTitle()
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
            mentorship, and a hands-on love of experimentation.
          </p>

          {/* Run-in sentence, not a chip row or a table — reads the way
              research interests appear in an academic bio or contributor
              note. Label and list are split onto their own lines (rather
              than one run-on sentence) so the label can stay a quiet
              category tag while the interests themselves — the actual
              content — get real size and contrast to read easily. */}
          <div className="hp-interests">
            <p className="hp-interests-label">Areas of Interest</p>
            <p className="hp-interests-list">{INTERESTS.join(', ')}.</p>
          </div>

          {/* Trial: full-bleed portrait (see .hp-hero-photo-col below) left
              no room for the socials under the photo like before, so they
              moved down here. Easy to move back if we revert the photo
              treatment. */}
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
        <div className="hp-hero-photo-col">
          <Portrait
            className="hp-hero-photo"
            src="/profliepicnobg.webp"
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
      </header>

      {/* Admissions, openings, talks, recent work -- right under the hero so
          time-sensitive news is seen before the long pinned portfolio
          scroll, not after it. See src/data/newsData.js to add/edit. */}
      <NewsSection />

      {/* Scroll-driven filmstrip through all 5 projects' real photos —
          see src/components/WorksTimeline.jsx. RESEARCH (removed above)
          was placeholder data; this pulls only from real PROJECTS. */}
      <WorksTimeline projects={PROJECTS} />

    </div>
  )
}
