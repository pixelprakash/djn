import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

/* Counts up to the number inside `value` when it scrolls into view,
   preserving any thousands separators and non-numeric prefix/suffix
   ("6,212", "₹10 Cr", "12+" all work). Falls straight to the final value
   for reduced-motion users. */
export default function CountUp({ value, duration = 1500 }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const target = parseNumber(value)
  const animatable = typeof target === 'number' && !Number.isNaN(target)

  const [display, setDisplay] = useState(animatable ? withNumber(value, 0) : value)
  const raf = useRef(0)

  useEffect(() => {
    if (!inView || !animatable) { setDisplay(value); return }
    if (prefersReduced()) { setDisplay(value); return }

    const start = performance.now()
    const step = now => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(withNumber(value, Math.round(target * eased)))
      if (t < 1) raf.current = requestAnimationFrame(step)
      else setDisplay(value)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, value, target, duration, animatable])

  return <span ref={ref}>{display}</span>
}

function prefersReduced() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function parseNumber(v) {
  const m = String(v).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

/* Swap the number portion of the original string for `n`, re-formatted
   with grouping so "6,212" counts as "1,234" not "1234". */
function withNumber(original, n) {
  const str = String(original)
  const m = str.match(/-?[\d,]+(?:\.\d+)?/)
  if (!m) return str
  return str.replace(m[0], n.toLocaleString('en-US'))
}
