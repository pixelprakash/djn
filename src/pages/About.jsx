import { useState, useRef, useEffect } from 'react'
import CircularText from './CircularText'
import FlowingMenu from './FlowingMenu'
import './About.css'

const workImages = Array.from({ length: 9 }, (_, i) => `/work/w${i + 1}.webp`)
const lifeImages = Array.from({ length: 9 }, (_, i) => `/life/l${i + 1}.webp`)
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='220'%3E%3Crect fill='%23c8c3bb' width='300' height='220'/%3E%3C/svg%3E"

const FRAMES = [
  { label: 'Currently working',  text: 'Professor at Design Indian Institute of Technology Hyderabad', img: '/work/about/1.png' },
  { label: 'Achievement',        text: 'Lifetime Achievement Award Design Research Council, 2025',    img: '/work/about/2.png' },
  { label: 'Authored Book',      text: 'Authored Principles of Design through Photography, 2011',      img: '/work/about/3.png' },
]

const INTERESTS = [
  { link:'#', text:'Photography',          image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=200&fit=crop&q=80' },
  { link:'#', text:'Heritage Preservation',image:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=200&fit=crop&q=80' },
  { link:'#', text:'Design Research',      image:'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=200&fit=crop&q=80' },
  { link:'#', text:'VR & Immersive World', image:'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=200&fit=crop&q=80' },
  { link:'#', text:'Design Education',    image:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=200&fit=crop&q=80' },
  { link:'#', text:'Sustainable Design',  image:'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=200&fit=crop&q=80' },
]

const NEWS = [
  { tag:'Event',       title:'Summer Internships 2026 Opened!',                          img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=220&fit=crop&q=80' },
  { tag:'Award',       title:'Lifetime Achievement Award -- Design Research Council 2025', img:'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=220&fit=crop&q=80' },
  { tag:'Publication', title:'New paper on Sustainable Design pedagogy published',        img:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=220&fit=crop&q=80' },
]

const TESTI = [
  { name:'Ananya Sharma',   role:'M.Des Student, IIT Hyderabad',  quote:'Prof. Mathew transformed my understanding of visual storytelling. His Photography Design program gave me the confidence to pursue a career in creative direction. The hands-on VR projects were mind-blowing!', img:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop' },
  { name:'Rohan Mehta',     role:'Alumni, IIT Hyderabad Design Dept.',  quote:'The course rewired my creative thinking entirely. A rare combination of academic rigor and creative imagination that I carry with me every day.', img:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=400&fit=crop' },
  { name:'Dr. Sarah Ellis', role:'Swinburne University, Melbourne',     quote:'A genuinely interdisciplinary thinker. His work bridging heritage, VR, and design education is unlike anything else I have encountered in the field.', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop' },
]

/* -- Slider -- */
function Slider({ images, speed = 40 }) {
  const trackRef = useRef(null)
  const all = [...images, ...images]
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const calc = () => {
      const cards = track.querySelectorAll('.sl-card')
      const half = Math.floor(cards.length / 2)
      let d = 0
      for (let i = 0; i < half; i++) d += cards[i].offsetWidth
      track.parentElement.style.setProperty('--slide-dist', `-${d}px`)
    }
    requestAnimationFrame(calc)
    track.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', calc, { once: true })
    })
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [images])
  return (
    <div className="sl-wrap">
      <div className="sl-track" ref={trackRef} style={{ '--spd': `${speed}s` }}>
        {all.map((src, i) => (
          <div className="sl-card" key={i}>
            <img src={src} alt="" draggable="false"
              onError={e => { if (e.currentTarget.src !== PH) e.currentTarget.src = PH }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const [mode, setMode] = useState('work')
  const [out,  setOut]  = useState(false)
  const [tIdx, setTIdx] = useState(0)

  function go(next) {
    if (next === mode) return
    setOut(true)
    setTimeout(() => { setMode(next); setOut(false) }, 160)
  }

  return (
    <div className="ap">

      {/* -- HEADER -- */}
      <header className="ap-top">

        {/* Left: name + subtitle -- on mobile, toggle moves here too */}
        <div className="ap-top-left">
          <h1 className="ap-title">Deepak John Mathew</h1>
          <p className="ap-sub">Professor &amp; Founding head of Design at IIT Hyderabad</p>
          {/* Toggle shown only on mobile, tucked below subtitle */}
          <div className="tog tog--mobile" role="group" aria-label="View toggle">
            <button className={`tog-lbl${mode==='work'?' tog-lbl--on':''}`} onClick={() => go('work')} aria-pressed={mode==='work'}>
              <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              work
            </button>
            <button className={`tog-track${mode==='life'?' tog-track--life':''}`} onClick={() => go(mode==='work'?'life':'work')} role="switch" aria-checked={mode==='life'} aria-label="Toggle work/life">
              <span className="tog-thumb" />
            </button>
            <button className={`tog-lbl${mode==='life'?' tog-lbl--on':''}`} onClick={() => go('life')} aria-pressed={mode==='life'}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Life
            </button>
          </div>
        </div>

        {/* Toggle -- desktop only (hidden on mobile, shown in ap-top-left instead) */}
        <div className="tog tog--desktop" role="group" aria-label="View toggle">
          <button className={`tog-lbl${mode==='work'?' tog-lbl--on':''}`} onClick={() => go('work')} aria-pressed={mode==='work'}>
            <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            work
          </button>
          <button className={`tog-track${mode==='life'?' tog-track--life':''}`} onClick={() => go(mode==='work'?'life':'work')} role="switch" aria-checked={mode==='life'} aria-label="Toggle work/life">
            <span className="tog-thumb" />
          </button>
          <button className={`tog-lbl${mode==='life'?' tog-lbl--on':''}`} onClick={() => go('life')} aria-pressed={mode==='life'}>
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Life
          </button>
        </div>

        {/* Sticker illustration */}
        <div className="ap-sticker">
          <div className="ap-sticker-bubble">Hi there!</div>
          <img src="/illustrations/illus-about.png" alt="Deepak John Mathew waving" className="ap-sticker-img" draggable="false" />
        </div>

      </header>

      <div className="ap-div" />

      {/* -- PANEL -- */}
      <div className={`ap-panel${out?' ap-panel--out':''}`}>

        {mode === 'work' && (
          <>
            {/* 1. HERO SLIDER */}
            <div className="ap-slider-wrap">
              <Slider images={workImages} speed={36} />
            </div>

            {/* 2. ABOUT */}
            <section className="ap-sec ap-sec--green" id="about">
              <h2 className="sec-head">About</h2>
              <p className="about-body">
                Professor Deepak John Mathew is a leading design academic at Indian Institute of Technology
                Hyderabad, specializing in digital heritage, AR/VR, photography, and design innovation. He played
                a key role in establishing the institute's design department and curriculum, and serves as Principal
                Design Investigator at the Design Innovation Centre, driving real-world, tech-enabled solutions.
              </p>
              <p className="about-body about-body--mt">
                With a Ph.D. in Design Education and an MFA from M.S. University, Vadodara, his expertise spans
                photography, design, and immersive technologies. He has taught a wide range of art and design subjects,
                exhibited internationally, and authored <em>Principles of Design through Photography</em>.
              </p>
              <p className="about-body about-body--mt">
                His current research focuses on autonomous drones, exploring their applications in digital heritage
                and design education through AR/VR integration.
              </p>

              {/* 3 cards */}
              <div className="frames">
                {FRAMES.map((f, i) => (
                  <div className="frame" key={i}>
                    <div className="frame-header">
                      <p className="frame-top-text">{f.text}</p>
                      <div className="frame-circ">
                        <CircularText
                          text={`${f.label.toUpperCase()} * `}
                          onHover="speedUp"
                          spinDuration={16}
                        />
                      </div>
                    </div>
                    <div className="frame-img">
                      <img src={f.img} alt={f.label}
                        onError={e => e.currentTarget.src = PH} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. AREAS OF INTEREST */}
            <section className="ap-sec ap-sec--flow" id="interests">
              <h2 className="sec-head" style={{ padding: '0 var(--g)' }}>Areas of Interest</h2>
              <div className="flow-host">
                <FlowingMenu
                  items={INTERESTS}
                  speed={13}
                  textColor="#ffffff"
                  bgColor="#060010"
                  marqueeBgColor="#ffffff"
                  marqueeTextColor="#060010"
                  borderColor="rgba(255,255,255,0.18)"
                />
              </div>
            </section>

            {/* 4. LATEST NEWS */}
            <section className="ap-sec" id="news">
              <h2 className="sec-head">Latest News</h2>
              <div className="news-row">
                {NEWS.map((n, i) => (
                  <article className="news-card" key={i}>
                    <div className="news-card-head">
                      <span className="news-card-tag">{n.tag}</span>
                      <p className="news-card-title">{n.title}</p>
                    </div>
                    <div className="news-card-img">
                      <img src={n.img} alt={n.title} loading="lazy" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section className="ap-sec" id="testi">
              <h2 className="sec-head">Testimonials</h2>
              <div className="testi-layout">
                <div className="testi-top">
                  <div className="testi-left">
                    <span className="testi-q">"</span>
                    <p className="testi-text">{TESTI[tIdx].quote}</p>
                  </div>
                  <div className="testi-photo">
                    <img src={TESTI[tIdx].img} alt={TESTI[tIdx].name}
                      onError={e => e.currentTarget.src = PH} />
                  </div>
                </div>
                <div className="testi-bottom">
                  <div className="testi-author">
                    <p className="testi-name">{TESTI[tIdx].name}</p>
                    <p className="testi-role">{TESTI[tIdx].role}</p>
                  </div>
                  <div className="testi-nav">
                    <button className="testi-arr" onClick={() => setTIdx(i=>(i-1+TESTI.length)%TESTI.length)} aria-label="Previous">&#8249;</button>
                    <button className="testi-arr" onClick={() => setTIdx(i=>(i+1)%TESTI.length)} aria-label="Next">&#8250;</button>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. GET IN TOUCH */}
            <section className="ap-sec ap-sec--dark" id="contact">
              <div className="contact-box">
                <h2 className="contact-h">Get in touch</h2>
                <p className="contact-p">Want to work on something together?<br/>Just want to chat? Hit me up.</p>
                <div className="contact-icons">
                  {[
                    { label:'Instagram', path:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                    { label:'LinkedIn',  path:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                    { label:'X',        path:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.754l7.83-8.945L2.003 2.25H8.08l4.224 5.654zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                    { label:'YouTube',  path:'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                  ].map(s => (
                    <a key={s.label} href="#" className="ci" aria-label={s.label}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d={s.path}/></svg>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {mode === 'life' && (
          <div className="ap-slider-wrap">
            <Slider images={lifeImages} speed={48} />
          </div>
        )}
      </div>
    </div>
  )
}