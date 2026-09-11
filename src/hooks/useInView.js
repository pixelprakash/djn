import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* One-shot "has this element scrolled into view yet" flag.
   - Reduced-motion users, and browsers without IntersectionObserver, get
     `true` immediately so nothing is ever hidden behind motion that won't run.
   - Anything already on (or just below) screen when it mounts reveals
     synchronously — no wait, no flash of blank on a fast scroll or a
     mid-page landing.
   - The positive bottom rootMargin starts the reveal a little before the
     element actually reaches the fold, so it's settled by the time you see it.
   - Content is also gated on the `js-ready` class (main.jsx), so a hard JS
     failure just shows everything.
   Returns [ref, inView]. */
export function useInView({
  threshold = 0.1,
  rootMargin = '0px 0px 12% 0px',
  once = true,
} = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (prefersReduced()) { setInView(true); return }

    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh * 1.15 && rect.bottom > -1) {
      setInView(true)
      return
    }

    let settled = false
    const show = () => { if (!settled) { settled = true; setInView(true) } }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            show()
            if (once) io.disconnect()
          } else if (!once && settled) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )
    io.observe(el)

    const safety = setTimeout(show, 10000)

    return () => { io.disconnect(); clearTimeout(safety) }
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
