import { useState, useRef, useEffect } from 'react'
import './About.css'

const workImages = Array.from({ length: 9 }, (_, i) => `/work/w${i + 1}.webp`)
const lifeImages = Array.from({ length: 9 }, (_, i) => `/life/l${i + 1}.webp`)
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='220'%3E%3Crect fill='%23dedad3' width='280' height='220'/%3E%3C/svg%3E"

function Slider({ images, speed = 40 }) {
  const trackRef = useRef(null)
  const all = [...images, ...images]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const cards = track.querySelectorAll('.sl-card')
      const half = Math.floor(cards.length / 2)
      let dist = 0
      for (let i = 0; i < half; i++) {
        dist += cards[i].offsetWidth + 12
      }
      track.parentElement.style.setProperty('--slide-dist', `-${dist}px`)
    }
    requestAnimationFrame(update)
    const imgs = track.querySelectorAll('img')
    imgs.forEach(img => { if (!img.complete) img.addEventListener('load', update, { once: true }) })
  }, [images])

  return (
    <div className="sl-wrap">
      <div className="sl-track" ref={trackRef} style={{ "--spd": `${speed}s` }}>
        {all.map((src, i) => (
          <div className="sl-card" key={i}>
            <img
              src={src}
              alt=""
              draggable="false"
              onError={e => { if (e.currentTarget.src !== PH) e.currentTarget.src = PH }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const [mode, setMode] = useState('work')
  const [out, setOut] = useState(false)

  function go(next) {
    if (next === mode) return
    setOut(true)
    setTimeout(() => { setMode(next); setOut(false) }, 180)
  }

  return (
    <div className="ap">
      <div className="ap-inner">

        {/* NAME */}
        <header className="ap-head">
          <h1 className="ap-name">
            <span className="ap-name-first">Deepak</span>
            <em className="ap-name-rest">John Mathew</em>
          </h1>
          <p className="ap-role">Professor of Design · IIT Hyderabad</p>
        </header>

        {/* TOGGLE */}
        <div className="tog" role="group">
          <button className={`tog-btn${mode==='work'?' on':''}`} onClick={() => go('work')} aria-pressed={mode==='work'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            Work
          </button>
          <div className="tog-pill-wrap" onClick={() => go(mode==='work'?'life':'work')} aria-hidden="true">
            <div className={`tog-pill${mode==='life'?' tog-pill--r':''}`}/>
          </div>
          <button className={`tog-btn${mode==='life'?' on':''}`} onClick={() => go('life')} aria-pressed={mode==='life'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Life
          </button>
        </div>

        {/* PANELS */}
        <div className={`panel${out?' panel--out':''}`}>

          {mode === 'work' ? (
            <>
              {/* BIO + FACTS */}
              <div className="work-grid">
                <div className="bio">
                  <p className="bio-lead">Professor of Design at IIT Hyderabad, working at the intersection of research, education, and practice.</p>
                  <p>With over two decades of experience spanning digital heritage, immersive technologies, sustainable materials, and design pedagogy.</p>
                  <p>Design is a human act — requiring curiosity, rigour, and deep sensitivity to context.</p>
                </div>
                <div className="facts">
                  <div className="fact">
                    <span className="fact-lbl">Currently</span>
                    <span className="fact-val">Professor HAG, Dept. of Design<br/>IIT Hyderabad</span>
                  </div>
                  <div className="fact">
                    <span className="fact-lbl">Recognition</span>
                    <span className="fact-val">Lifetime Achievement Award<br/>Design Research Council, 2025</span>
                  </div>
                  <div className="fact">
                    <span className="fact-lbl">Book</span>
                    <span className="fact-val">Principles of Design<br/>Through Photography, 2011</span>
                  </div>
                  <div className="fact">
                    <span className="fact-lbl">Old Website</span>
                    <a href="https://deepakjohnmathew.net" target="_blank" rel="noreferrer" className="fact-link">deepakjohnmathew.net ↗</a>
                  </div>
                </div>
              </div>

              {/* SLIDER */}
              <div className="seg seg--slider">
                <Slider images={workImages} speed={44} />
              </div>

              {/* AREAS OF INTEREST */}
              <div className="seg">
                <p className="seg-lbl">Areas of Interest</p>
                <div className="tags">
                  {["Design Research","VR & Immersive Media","Heritage Preservation","Sustainable Design","Design Education","Photography"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </>

          ) : (
            /* LIFE — slider only, no cards, no intro block */
            <div className="seg seg--slider">
              <Slider images={lifeImages} speed={50} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}