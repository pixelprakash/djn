import { useEffect, useRef, useState } from 'react'
import clip from '../assets/at-work.mp4'
import poster from '../assets/at-work-poster.webp'
import photo640 from '../assets/djteaching-640.webp'
import photo960 from '../assets/djteaching-960.webp'
import './AtWork.css'

/* "At work": a short silent clip of him on set, on the home page under the
   hero. Treated like the hero photograph (a portrait plate offset on the
   gradient) so the two read as a pair.

   - Plays muted and looping, and only while it is on screen.
   - It starts itself only for visitors who have not asked for reduced motion;
     they get the still poster and a Play button instead.
   - A visible Pause / Play button is always there (WCAG 2.2.2: moving content
     that runs for more than five seconds needs a way to stop it).
   - The video file is not requested until the band is near the screen
     (preload="none" until then), so it never competes with the hero. */
const CAPTION = 'On set, in the studio.' // edit this line to change the caption

export default function AtWork({ withPhoto = false }) {
  const videoRef = useRef(null)
  const boxRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [near, setNear] = useState(false)       // close enough to start loading
  const [inView, setInView] = useState(false)   // on screen right now
  const userPaused = useRef(false)
  const calm = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Start loading a little before it scrolls into view; track whether it is on screen.
  useEffect(() => {
    const box = boxRef.current
    if (!box || typeof IntersectionObserver === 'undefined') return
    const early = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); early.disconnect() } }, { rootMargin: '600px 0px' })
    early.observe(box)
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    vis.observe(box)
    return () => { early.disconnect(); vis.disconnect() }
  }, [])

  // Play while on screen (once the file is attached), pause when it leaves. Runs
  // again when the file arrives, so a fast scroll never leaves it stuck on the poster.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (near) v.preload = 'auto'
    if (inView && near && !calm.current && !userPaused.current) v.play().catch(() => {})
    else if (!inView) v.pause()
  }, [inView, near])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}) }
    else { userPaused.current = true; v.pause() }
  }

  return (
    <section className="aw" aria-labelledby="aw-heading">
      <div className="aw-text">
        <h2 className="aw-heading" id="aw-heading">At work</h2>
        <p className="aw-caption">{CAPTION}</p>
        {withPhoto && (
          <figure className="aw-photo">
            <img
              src={photo960}
              srcSet={`${photo640} 640w, ${photo960} 960w`}
              sizes="(max-width: 860px) 92vw, 40vw"
              width="1280"
              height="923"
              alt="Prof. Deepak John Mathew teaching a photography workshop, seated on the floor with students around a low table of camera lenses."
              loading="lazy"
              decoding="async"
            />
            <figcaption>Teaching, seated with students and lenses.</figcaption>
          </figure>
        )}
      </div>

      <figure className="aw-fig" ref={boxRef}>
        <div className="aw-frame">
          <video
            ref={videoRef}
            className="aw-video"
            src={near ? clip : undefined}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            width="720"
            height="1280"
            aria-label="A short silent clip of Prof. Deepak John Mathew on a studio set, adjusting a subject's collar."
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <button type="button" className="aw-toggle" onClick={toggle} aria-pressed={playing}>
            {playing ? 'Pause' : 'Play'}<span className="aw-sr"> the clip</span>
          </button>
        </div>
      </figure>
    </section>
  )
}
