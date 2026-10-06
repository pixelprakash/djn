// import { useEffect, useRef } from 'react'
import './Portrait.css'

/* The cut-out portrait on a backdrop panel, shared by the Home hero and the
   Resume header. Currently STATIC black-and-white: the interaction below is
   switched off for now. To bring it back, uncomment the import above, the
   refs + effect, the ref/marks in the JSX, and the matching block in
   Portrait.css -- they belong together.

   The interaction (both mouse-only; touch has no hover and reduced-motion
   visitors get neither):
   - Depth: the figure drifts a few pixels *against* the pointer, eased.
   - Focus lock: on hover, four corner brackets -- the same mark the site's
     intro uses -- tighten in while the greyscale lifts to colour.

   `className` is the page's own panel class (it owns size, radius and the
   responsive rules); everything else passes straight through to the img. */
// The portrait ships in three sizes; the browser picks the smallest that is
// sharp for the screen (a phone needs ~35 KB, not the 175 KB original).
const PORTRAIT = {
  src: '/profliepicnobg-900.webp',
  srcSet: '/profliepicnobg-560.webp 560w, /profliepicnobg-900.webp 900w, /profliepicnobg.webp 1380w',
  sizes: '(max-width: 860px) 300px, 560px',
  width: 1380,
  height: 1504, // intrinsic size: reserves the space, no layout shift
}

export default function Portrait({ className = '', ...imgProps }) {
  const img = imgProps.src === '/profliepicnobg.webp' ? { ...imgProps, ...PORTRAIT } : imgProps
  /*
  const boxRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    const img = imgRef.current
    if (!box || !img) return
    const mq = q => window.matchMedia(q).matches
    if (mq('(prefers-reduced-motion: reduce)') || !mq('(hover: hover) and (pointer: fine)')) return

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      img.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.06)`
      raf = (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) ? requestAnimationFrame(tick) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = e => {
      const r = box.getBoundingClientRect()
      tx = -((e.clientX - r.left) / r.width - 0.5) * 14
      ty = -((e.clientY - r.top) / r.height - 0.5) * 9
      kick()
    }
    const leave = () => { tx = 0; ty = 0; kick() }

    box.addEventListener('pointermove', move)
    box.addEventListener('pointerleave', leave)
    return () => {
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  */

  return (
    <div className={`pf ${className}`} /* ref={boxRef} */>
      <img /* ref={imgRef} */ {...img} />
      {/*
      <i className="pf-mark pf-mark--tl" aria-hidden="true" />
      <i className="pf-mark pf-mark--tr" aria-hidden="true" />
      <i className="pf-mark pf-mark--bl" aria-hidden="true" />
      <i className="pf-mark pf-mark--br" aria-hidden="true" />
      */}
    </div>
  )
}
