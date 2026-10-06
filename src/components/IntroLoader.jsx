import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './IntroLoader.css'

const NAME = ['Deepak', 'John', 'Mathew']
const METER_TICKS = 13 // -3 … 0 … +3 EV in half stops
const BLADES = 6
const OPEN = 130 // aperture inradius (viewBox units) that clears any screen

// Closed: every blade edge passes through the centre. Opening slides each
// edge outward along its own normal while the whole set twists, so the
// hexagonal aperture swells and unwinds like a real diaphragm.
const bladeTransform = (k, d, rot) => `rotate(${(rot + k * 360 / BLADES).toFixed(2)}) translate(${d.toFixed(2)} 0)`

/* The sounds are synthesised with Web Audio rather than shipped as files:
   nothing to download, nothing to license, and it stays in sync because
   the timeline itself schedules each cue.

   Browsers only let a page make sound after the visitor has interacted
   with it. If the browser starts the audio context on its own (a returning
   visitor, or one who arrived by clicking within the site) the cues play;
   otherwise the intro is simply silent, and the first click or keypress
   during it switches the sound on for the cues still to come. Every cue
   checks the context is running, so nothing ever queues up and fires
   late. */
function createSound() {
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  if (!AC) return null
  const ctx = new AC()

  const master = ctx.createGain()
  master.gain.value = 0.8
  const limiter = ctx.createDynamicsCompressor()
  master.connect(limiter)
  limiter.connect(ctx.destination)

  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.9), ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  // A burst of filtered noise with a fast attack and exponential decay.
  const burst = (t, { type, freq, to, q = 1, dur, gain }) => {
    const src = ctx.createBufferSource()
    src.buffer = noise
    const f = ctx.createBiquadFilter()
    f.type = type
    f.Q.value = q
    f.frequency.setValueAtTime(freq, t)
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f); f.connect(g); g.connect(master)
    src.start(t, Math.random() * 0.3)
    src.stop(t + dur + 0.03)
  }

  // A pitched thump / blip with a falling or steady frequency.
  const tone = (t, { f0, f1 = f0, dur, gain, type = 'sine' }) => {
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    o.frequency.exponentialRampToValueAtTime(f1, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.03)
  }

  const live = () => ctx.state === 'running'
  let closed = false

  return {
    resume() { if (!closed && ctx.state === 'suspended') ctx.resume().catch(() => {}) },

    // Autofocus confirmation: one short, quiet, high blip.
    lock() {
      if (!live()) return
      const t = ctx.currentTime
      tone(t, { f0: 2400, dur: 0.08, gain: 0.2 })
    },

    // Mirror slap, first curtain, a breath of blade movement, then the
    // second curtain closing on the exposure.
    shutter() {
      if (!live()) return
      const t = ctx.currentTime
      tone(t, { f0: 190, f1: 55, dur: 0.11, gain: 0.5 })
      burst(t, { type: 'bandpass', freq: 1700, q: 1.1, dur: 0.06, gain: 0.55 })
      burst(t + 0.012, { type: 'highpass', freq: 4800, dur: 0.035, gain: 0.22 })
      burst(t + 0.05, { type: 'bandpass', freq: 700, to: 3400, q: 0.8, dur: 0.7, gain: 0.05 })
      burst(t + 0.092, { type: 'bandpass', freq: 2700, q: 2.2, dur: 0.04, gain: 0.38 })
      tone(t + 0.092, { f0: 130, f1: 70, dur: 0.07, gain: 0.22 })
    },

    close() {
      if (closed) return
      closed = true
      ctx.close().catch(() => {})
    },
  }
}

/* The site's one-time arrival, played once per real page load (route
   changes have their own transition in App.jsx).

   The idea is a camera's viewfinder, because that's the shared language
   of his two trades: corner brackets frame the screen, a rule-of-thirds
   grid draws in, an autofocus box hunts and locks onto his name, and an
   exposure meter settles to zero. The readouts are the real vocabulary of
   a camera body (aperture, shutter, ISO) and the real coordinates of his
   campus, not filler.

   The counter is honest: it climbs to 99 on a fixed schedule, then waits
   at 99 until fonts and page assets have actually loaded (capped, so a
   dead request can't trap anyone) before reading 100 and opening. On a
   fast connection that wait is zero.

   The finale is a six-blade shutter. The blades *are* the ink surface the
   viewfinder sits on; when the readouts clear they part, their overlapping
   edges drawing in as they move, and the page appears through the opening.

   One GSAP timeline drives everything and its `onComplete` -- not a
   hand-kept timeout -- tells React when to unmount. Reduced-motion
   visitors never see it at all. */
export default function IntroLoader() {
  const rootRef = useRef(null)
  const cornerRefs = useRef([])
  const gridRefs = useRef([])
  const hudRefs = useRef([])
  const afRef = useRef(null)
  const wordRefs = useRef([])
  const lineRefs = useRef([])
  const counterRef = useRef(null)
  const fillRef = useRef(null)
  const meterRef = useRef(null)
  const bladeRefs = useRef([])
  const edgeRefs = useRef([])
  const sheenRefs = useRef([])
  const veilRefs = useRef([])
  const markerRef = useRef(null)
  const [visible, setVisible] = useState(
    typeof window === 'undefined' ||
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (!visible) return

    // The reveal depends on this JS running to completion, so a thrown
    // error must not be able to leave the overlay covering the (already
    // rendered) page behind it.
    let ctx
    let snd = null
    let alive = true
    let removeUnlock = () => {}
    try {
      ctx = gsap.context(() => {
        try { snd = createSound() } catch { snd = null }
        if (snd) {
          snd.resume()
          const unlock = () => snd && snd.resume()
          window.addEventListener('pointerdown', unlock, { once: true })
          window.addEventListener('keydown', unlock, { once: true })
          removeUnlock = () => {
            window.removeEventListener('pointerdown', unlock)
            window.removeEventListener('keydown', unlock)
          }
        }
        const shutter = { o: 0 }
        const count = { v: 0 }
        const paint = () => {
          if (!counterRef.current || !fillRef.current) return // overlay already gone
          const n = Math.round(count.v)
          counterRef.current.textContent = String(n).padStart(3, '0')
          fillRef.current.style.transform = `scaleX(${count.v / 100})`
        }

        // Real readiness: fonts + the window load event, capped at 4.5s.
        const loaded = new Promise(res => {
          if (document.readyState === 'complete') res()
          else window.addEventListener('load', res, { once: true })
        })
        const ready = Promise.race([
          Promise.all([loaded, document.fonts ? document.fonts.ready : null]),
          new Promise(res => setTimeout(res, 4500)),
        ])

        // Position every blade for shutter openness o (0 closed, 1 open).
        const setShutter = o => {
          if (!bladeRefs.current[BLADES - 1]) return // overlay already gone
          const d = o * OPEN
          const rot = (1 - o) * 38
          const reach = 0.9 * d + 4 // visible length of a blade edge
          for (let k = 0; k < BLADES; k++) {
            bladeRefs.current[k].setAttribute('transform', bladeTransform(k, d, rot))
            const e = edgeRefs.current[k], h = sheenRefs.current[k]
            e.setAttribute('y1', -reach); e.setAttribute('y2', reach)
            e.setAttribute('opacity', Math.min(1, d / 7))
            h.setAttribute('y', -reach); h.setAttribute('height', reach * 2)
            h.setAttribute('opacity', Math.min(1, d / 7))
          }
        }
        setShutter(0)

        // Which way each corner travels in from (toward the centre).
        const IN = [[1, 1], [-1, 1], [1, -1], [-1, -1]]

        const tl = gsap.timeline({ onComplete: () => { setVisible(false); removeUnlock(); if (snd) setTimeout(snd.close, 800) } })

        // 1 -- The frame finds its edges: brackets slide out to the
        // corners, the thirds grid draws from the centre.
        tl.fromTo(cornerRefs.current,
          { opacity: 0, x: i => IN[i][0] * 90, y: i => IN[i][1] * 60 },
          { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05 }, 0.05)
          .fromTo(gridRefs.current.slice(0, 2), { scaleY: 0 },
            { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.2)
          .fromTo(gridRefs.current.slice(2, 4), { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.2)
          .fromTo(hudRefs.current, { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07 }, 0.35)
          .fromTo(counterRef.current.closest('.il-bottom'), { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.35)

        // 2 -- The counter starts climbing; the exposure meter hunts and
        // settles on zero.
        tl.to(count, { v: 99, duration: 2.1, ease: 'power1.inOut', onUpdate: paint }, 0.3)
          .fromTo(markerRef.current, { left: '0%' },
            { left: '50%', duration: 1.9, ease: 'back.out(1.8)' }, 0.5)
          .fromTo(meterRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.4)

        // 3 -- Autofocus: the box appears loose, blinks, and locks.
        tl.fromTo(afRef.current, { opacity: 0, scale: 1.55 },
          { opacity: 1, scale: 1, duration: 0.55, ease: 'power4.out' }, 0.55)
          .to(afRef.current, { opacity: 0.15, duration: 0.07 })
          .to(afRef.current, { opacity: 1, duration: 0.07 })
          .to(afRef.current, { opacity: 0.15, duration: 0.07 })
          .to(afRef.current, { opacity: 1, duration: 0.07 })
          .call(() => {
            if (afRef.current) afRef.current.classList.add('is-locked')
            if (snd) snd.lock()
          })
          .fromTo(afRef.current, { scale: 1.035 },
            { scale: 1, duration: 0.25, ease: 'power3.out' }, '<')

        // 4 -- His name: each word rises out of its own mask, then the
        // two lines beneath it.
        tl.fromTo(wordRefs.current, { yPercent: 118 },
          { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.1 }, 0.7)
          .fromTo(lineRefs.current, { yPercent: 118 },
            { yPercent: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1 }, 1.2)

        // 5 -- Hold at 99 until the page is genuinely ready, then 100.
        tl.addLabel('gate', 2.45)
          .call(() => {
            tl.pause()
            ready.then(() => { if (alive) tl.resume() })
          }, null, 'gate')
          .to(count, { v: 100, duration: 0.25, ease: 'power2.out', onUpdate: paint })
          .to({}, { duration: 0.4 })

        // 6 -- Clear down: readouts and name drop away and the frame
        // closes in a touch. A beat of stillness, then the shutter fires.
        tl.to([...hudRefs.current, afRef.current, meterRef.current, counterRef.current.parentNode, fillRef.current.parentNode, ...veilRefs.current],
          { opacity: 0, duration: 0.3, ease: 'power1.in' })
          .to([wordRefs.current, lineRefs.current].flat(),
            { yPercent: -118, duration: 0.4, ease: 'power3.in', stagger: 0.025 }, '<')
          .to(gridRefs.current, { opacity: 0, duration: 0.3 }, '<')
          .to(cornerRefs.current,
            { x: i => IN[i][0] * 36, y: i => IN[i][1] * 24, opacity: 0, duration: 0.45, ease: 'power3.in' }, '<')

          .call(() => { if (snd) snd.shutter() }, null, '+=0.02')
          .to(shutter, {
            o: 1,
            duration: 0.85,
            ease: 'power3.inOut',
            onUpdate: () => setShutter(shutter.o),
          }, '<')

      }, rootRef)
    } catch {
      setVisible(false)
    }

    return () => { alive = false; removeUnlock(); if (snd) snd.close(); if (ctx) ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return (
    <div className="il" ref={rootRef} aria-hidden="true">
      {/* Shutter blades: the ink surface itself. Edges and sheen stay
          invisible until the blades start to part. */}
      <svg className="il-shutter" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="il-sheen" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f5f3ee" stopOpacity=".1" />
            <stop offset="1" stopColor="#f5f3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: BLADES }, (_, k) => (
          <g key={k} ref={el => { bladeRefs.current[k] = el }} transform={bladeTransform(k, 0, 38)}>
            <polygon className="il-blade" points="0,-700 0,700 700,700 700,-700" />
            <rect className="il-sheen" x="0" y="0" width="16" height="0" fill="url(#il-sheen)" opacity="0" ref={el => { sheenRefs.current[k] = el }} />
            <line className="il-edge" x1="0" x2="0" y1="0" y2="0" opacity="0" ref={el => { edgeRefs.current[k] = el }} />
          </g>
        ))}
      </svg>
      <div className="il-glow" ref={el => { veilRefs.current[0] = el }} />
      <div className="il-grain" ref={el => { veilRefs.current[1] = el }} />

      <div className="il-vf">
        {/* Rule-of-thirds grid */}
        <span className="il-third il-third--v1" ref={el => { gridRefs.current[0] = el }} />
        <span className="il-third il-third--v2" ref={el => { gridRefs.current[1] = el }} />
        <span className="il-third il-third--h1" ref={el => { gridRefs.current[2] = el }} />
        <span className="il-third il-third--h2" ref={el => { gridRefs.current[3] = el }} />

        {/* Frame corners */}
        <span className="il-corner il-corner--tl" ref={el => { cornerRefs.current[0] = el }} />
        <span className="il-corner il-corner--tr" ref={el => { cornerRefs.current[1] = el }} />
        <span className="il-corner il-corner--bl" ref={el => { cornerRefs.current[2] = el }} />
        <span className="il-corner il-corner--br" ref={el => { cornerRefs.current[3] = el }} />

        {/* Readouts */}
        <span className="il-hud il-hud--tl" ref={el => { hudRefs.current[0] = el }}>DJM &nbsp;/&nbsp; Portfolio</span>
        <span className="il-hud il-hud--tr" ref={el => { hudRefs.current[1] = el }}>f/2.8 &nbsp; 1/250 &nbsp; ISO 100</span>
        <span className="il-hud il-hud--br" ref={el => { hudRefs.current[2] = el }}>17.59° N &nbsp; 78.12° E</span>

        {/* Loading progress: the frame's bottom edge is the bar */}
        <div className="il-bottom">
          <div className="il-track"><span className="il-fill" ref={fillRef} /></div>
          <div className="il-count"><span ref={counterRef}>000</span><i>%</i></div>
        </div>

        {/* Exposure meter */}
        <div className="il-meter" ref={meterRef}>
          <div className="il-ticks">
            {Array.from({ length: METER_TICKS }, (_, i) => (
              <span key={i} className={i % 6 === 0 ? 'is-major' : undefined} />
            ))}
            <b className="il-marker" ref={markerRef} />
          </div>
        </div>

        {/* Name, inside the autofocus box */}
        <div className="il-center">
          <div className="il-af" ref={afRef}>
            <i /><i /><i /><i />
          </div>
          <p className="il-name">
            {NAME.map((w, i) => (
              <span className="il-mask" key={w}>
                <span className="il-word" ref={el => { wordRefs.current[i] = el }}>{w}</span>
              </span>
            ))}
          </p>
          <p className="il-sub">
            <span className="il-mask"><span className="il-line" ref={el => { lineRefs.current[0] = el }}>Professor of Design &mdash; IIT Hyderabad</span></span>
            <span className="il-mask"><span className="il-line" ref={el => { lineRefs.current[1] = el }}>Photography &middot; Design Research &middot; Education</span></span>
          </p>
        </div>
      </div>

    </div>
  )
}
