import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { PROJECTS } from './projectData'
import { SOCIALS } from '../data/socials'
import SocialIcon from '../components/SocialIcon'
import './About.css'

const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23d8d8d8' width='400' height='300'/%3E%3C/svg%3E"
const GAP = 28

const WORKS = PROJECTS.map(p => ({
  key: p.slug,
  title: p.title,
  desc: `${p.category} · ${p.venue.split(',')[0]}`,
  image: p.cover,
  href: `/work/${p.slug}`,
}))

// Placeholder content — swap in real research entries when available.
const RESEARCH = [
  { key: 'r1', title: 'Digital Heritage & AR/VR', desc: 'Reconstructing endangered built heritage through immersive augmented and virtual reality.', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&h=520&fit=crop&q=80' },
  { key: 'r2', title: 'Autonomous Drones for Documentation', desc: 'Drone-based imaging workflows for large-scale heritage and site documentation.', image: 'https://images.unsplash.com/photo-1508614999368-9260051292e5?w=700&h=520&fit=crop&q=80' },
  { key: 'r3', title: 'Design Pedagogy Research', desc: 'How design curricula shape creative problem-solving in engineering-led institutions.', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=520&fit=crop&q=80' },
  { key: 'r4', title: 'Human-Computer Interaction', desc: 'Interaction patterns between people and emerging spatial computing interfaces.', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=700&h=520&fit=crop&q=80' },
  { key: 'r5', title: 'Sustainable Design Systems', desc: 'Frameworks for environmentally responsible design practice in Indian contexts.', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=700&h=520&fit=crop&q=80' },
]

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

function Card({ item, color, tabIndex }) {
  const body = (
    <>
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
    </>
  )

  if (item.href) {
    return (
      <Link to={item.href} className={`hp-card hp-card--${color}`} tabIndex={tabIndex}>
        {body}
      </Link>
    )
  }
  return <article className={`hp-card hp-card--${color}`}>{body}</article>
}

/* Slow auto-scrolling row with prev/next + play-pause controls.
   Two copies of the item list sit in the track for a seamless loop;
   the second copy is aria-hidden + untabbable so screen reader / keyboard
   users only ever see the real set once. */
function Marquee({ heading, id, items, color, speed = 30 }) {
  const trackRef = useRef(null)
  const posRef = useRef(0)
  const distRef = useRef(0)
  const hoverRef = useRef(false)
  const [manualPaused, setManualPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  const recalc = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('.hp-card')
    const half = Math.floor(cards.length / 2)
    let d = 0
    for (let i = 0; i < half; i++) d += cards[i].offsetWidth + GAP
    distRef.current = d
  }, [])

  useEffect(() => {
    recalc()
    const imgs = trackRef.current ? trackRef.current.querySelectorAll('img') : []
    imgs.forEach(img => { if (!img.complete) img.addEventListener('load', recalc, { once: true }) })
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [items, recalc])

  useEffect(() => {
    if (reduceMotion) return
    let raf
    let last = null
    function frame(now) {
      if (last == null) last = now
      const dt = now - last
      last = now
      if (!hoverRef.current && !manualPaused && distRef.current && trackRef.current) {
        posRef.current -= (speed / 1000) * dt
        if (posRef.current <= -distRef.current) posRef.current += distRef.current
        trackRef.current.style.transform = `translateX(${posRef.current}px)`
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [manualPaused, reduceMotion, speed])

  function step(dir) {
    const track = trackRef.current
    if (!track || !distRef.current) return
    const first = track.querySelector('.hp-card')
    const w = first ? first.getBoundingClientRect().width + GAP : 340
    posRef.current -= dir * w
    if (posRef.current <= -distRef.current) posRef.current += distRef.current
    if (posRef.current > 0) posRef.current -= distRef.current
    track.style.transition = reduceMotion ? 'none' : 'transform .45s cubic-bezier(.4,0,.2,1)'
    track.style.transform = `translateX(${posRef.current}px)`
    window.clearTimeout(track._t)
    track._t = window.setTimeout(() => { if (track) track.style.transition = '' }, 460)
  }

  return (
    <section className={`hp-panel hp-panel--${color}`} aria-labelledby={id}>
      <div className="hp-panel-head">
        <h2 className="hp-panel-title" id={id}>{heading}</h2>
        <div className="hp-controls" role="group" aria-label={`${heading} carousel controls`}>
          <button type="button" className="hp-ctrl" onClick={() => step(-1)} aria-label={`Previous ${heading} item`}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            className="hp-ctrl"
            onClick={() => setManualPaused(p => !p)}
            aria-pressed={manualPaused}
            aria-label={manualPaused ? `Play ${heading} carousel` : `Pause ${heading} carousel`}
          >
            {manualPaused ? (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            )}
          </button>
          <button type="button" className="hp-ctrl" onClick={() => step(1)} aria-label={`Next ${heading} item`}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
      </div>

      <div
        className="hp-marquee"
        onMouseEnter={() => { hoverRef.current = true }}
        onMouseLeave={() => { hoverRef.current = false }}
        onFocus={() => { hoverRef.current = true }}
        onBlur={() => { hoverRef.current = false }}
      >
        <div className="hp-track" ref={trackRef}>
          {items.map(item => (
            <div className="hp-slide" key={item.key}>
              <Card item={item} color={color} />
            </div>
          ))}
          <div className="hp-track-dup" aria-hidden="true" style={{ display: 'contents' }}>
            {items.map(item => (
              <div className="hp-slide" key={`dup-${item.key}`}>
                <Card item={item} color={color} tabIndex={-1} />
              </div>
            ))}
          </div>
        </div>
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
                  <div className="hp-interest-inner">
                    <span className="hp-interest-front">
                      <InterestIcon name={i.icon} />
                      {i.label}
                    </span>
                    <span className="hp-interest-back">{i.detail}</span>
                  </div>
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

      <Marquee heading="Works" id="hp-works-heading" items={WORKS} color="blue" speed={14} />
      <Marquee heading="Research" id="hp-research-heading" items={RESEARCH} color="purple" speed={12} />
    </div>
  )
}
