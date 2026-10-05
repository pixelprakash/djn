import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { irisClipPath } from '../utils/iris'
import './IntroLoader.css'

const FACTS = [
  'Professor of Design — IIT Hyderabad',
  'Photography · Design Research · Education',
]

/* A one-time "arriving" moment for the site, not a per-route loader (see
   PageLoader in App.jsx for that) -- mounted once at the top of App, so it
   plays once per real page load/refresh and never again during a route
   navigation, the same way a native app's splash screen only shows on
   cold launch.

   The concept, not just the motion: a design grid constructing itself --
   margin guides and printer's crop marks, the tools of both his trades
   (layout grids for design, proof-sheet crop marks for photography) --
   with his name and two facts about him revealed inside it by a hard
   swipe (an opaque bar sliding off, not another soft blur-fade; this
   site already leans on blur for page titles, so the intro earns its
   keep by doing something else) while a small "01 / 02" counter ticks
   alongside, the same counter convention already used on the home page's
   Works section. The frame disassembles in reverse before the rotating
   -iris reveal opens onto the page -- see src/utils/iris.js, the same
   aperture motif every page-to-page navigation uses too, so the whole
   site reads as one authored system rather than a handful of unrelated
   effects. One GSAP timeline drives all of it; `onComplete` -- not a
   hand-maintained setTimeout -- tells React when it's safe to unmount,
   so the two can never drift out of sync. */
export default function IntroLoader() {
  const rootRef = useRef(null)
  const guideRefs = useRef([])
  const cropRefs = useRef([])
  const counterRef = useRef(null)
  const nameRef = useRef(null)
  const nameBarRef = useRef(null)
  const ruleRef = useRef(null)
  const factsRef = useRef(null)
  const factsBarRef = useRef(null)
  const [visible, setVisible] = useState(
    typeof window === 'undefined' ||
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (!visible) return

    // Same reasoning as the route transitions in App.jsx: the reveal now
    // fully depends on this JS running to completion, so a thrown error
    // must not be able to leave the overlay permanently covering the
    // (already fully rendered) page behind it.
    let ctx
    try {
      ctx = gsap.context(() => {
        const iris = { openness: 0 }
        const setFacts = i => {
          factsRef.current.textContent = FACTS[i]
          counterRef.current.textContent = `0${i + 1} / 0${FACTS.length}`
        }
        setFacts(0)

        const tl = gsap.timeline({ onComplete: () => setVisible(false) })

        // -- Frame construction: margin guides draw from the center out,
        // crop marks tick in at the corners once they land. --
        tl.fromTo(guideRefs.current.slice(0, 2), // top, bottom (horizontal)
          { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power4.out', stagger: 0.04 }, 0.05)
          .fromTo(guideRefs.current.slice(2, 4), // left, right (vertical)
            { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power4.out', stagger: 0.04 }, 0.05)
          .fromTo(cropRefs.current,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.4)', stagger: 0.03 },
            0.4)
          .fromTo(counterRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.55)

          // -- Beat 1: his name, revealed by the accent bar sliding off
          // (not blurring in) -- a hard, confident edge. --
          .to(nameBarRef.current, { scaleX: 0, duration: 0.5, ease: 'power4.inOut' }, 0.65)

          // -- Small divider, same "wipe" draw as the rest of the site's
          // hairline rules (CvPage, Resume). --
          .fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 1.15)

          // -- Beat 2: first fact, same bar-wipe device. --
          .to(factsBarRef.current, { scaleX: 0, duration: 0.4, ease: 'power4.inOut', transformOrigin: 'right' }, 1.35)
          // Hold so it's actually legible.
          .to({}, { duration: 0.65 })
          // Cover again from the left, swap the text while hidden, then
          // reveal fact two -- the same "wipe-cover, swap, wipe-reveal"
          // beat a lower-third title graphic uses to cycle captions.
          .to(factsBarRef.current, { scaleX: 1, duration: 0.3, ease: 'power3.in', transformOrigin: 'left' })
          .call(() => setFacts(1))
          .to(factsBarRef.current, { scaleX: 0, duration: 0.4, ease: 'power4.inOut', transformOrigin: 'right' })
          .to({}, { duration: 0.65 })

          // -- Clear the stage: a quick, plain fade (no blur) -- and
          // disassemble the frame in reverse, snappier than it built. --
          .to([nameRef.current, ruleRef.current, factsRef.current, counterRef.current], {
            opacity: 0, duration: 0.25, ease: 'power1.in',
          }, '>')
          .to(cropRefs.current, { opacity: 0, duration: 0.2 }, '<')
          .to(guideRefs.current.slice(0, 2), { scaleX: 0, duration: 0.35, ease: 'power3.in' }, '<')
          .to(guideRefs.current.slice(2, 4), { scaleY: 0, duration: 0.35, ease: 'power3.in' }, '<')

          // -- The same rotating-iris reveal every page transition opens
          // with (see src/utils/iris.js) -- inverted here versus
          // RouteTransition's use of it: that clips the *page content*
          // (openness 1 = fully visible), this clips the *overlay
          // itself* (so openness 1 -- a large clip region -- would mean
          // the ink is widely visible, the opposite of what "revealed"
          // should mean for an overlay). iris.openness here tracks reveal
          // progress; irisClipPath gets 1 minus it. --
          .to(iris, {
            openness: 1,
            duration: 0.6,
            ease: 'power3.out',
            onUpdate: () => {
              if (rootRef.current) rootRef.current.style.clipPath = irisClipPath(1 - iris.openness)
            },
          }, '-=0.15')
      }, rootRef)
    } catch {
      setVisible(false)
    }

    return () => ctx && ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return (
    <div className="il" ref={rootRef} aria-hidden="true">
      <div className="il-grain" aria-hidden="true" />

      <div className="il-frame">
        <div className="il-guide il-guide--t" ref={el => { guideRefs.current[0] = el }} />
        <div className="il-guide il-guide--b" ref={el => { guideRefs.current[1] = el }} />
        <div className="il-guide il-guide--l" ref={el => { guideRefs.current[2] = el }} />
        <div className="il-guide il-guide--r" ref={el => { guideRefs.current[3] = el }} />

        <span className="il-crop il-crop--tl" ref={el => { cropRefs.current[0] = el }} />
        <span className="il-crop il-crop--tr" ref={el => { cropRefs.current[1] = el }} />
        <span className="il-crop il-crop--bl" ref={el => { cropRefs.current[2] = el }} />
        <span className="il-crop il-crop--br" ref={el => { cropRefs.current[3] = el }} />

        <span className="il-counter" ref={counterRef}>01 / 02</span>

        <div className="il-stage">
          <div className="il-name-wrap">
            <p className="il-name" ref={nameRef}>Deepak John Mathew</p>
            <div className="il-name-bar" ref={nameBarRef} />
          </div>
          <div className="il-rule" ref={ruleRef} />
          <div className="il-facts-wrap">
            <p className="il-facts" ref={factsRef}>{FACTS[0]}</p>
            <div className="il-facts-bar" ref={factsBarRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
