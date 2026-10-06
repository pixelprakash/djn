import { useEffect } from 'react'
import '../styles/stack.css'

/* Stack-up scrolling for a page: every `[data-stack]` element inside the page
   root becomes a layer. CSS (src/styles/stack.css) pins each layer with
   `position: sticky`; this hook does the two things CSS cannot:

   1. A layer taller than the screen can't pin by its top (its lower part would
      never be reachable), so its sticky `top` is set to `viewport - height`:
      it scrolls until its bottom edge reaches the bottom of the screen, then
      holds there while the next layer slides over it.
   2. It writes `--cover` (0..1) on each layer: how far the next layer has
      climbed over it, which the CSS turns into the settle-back effect.

   Does nothing on phones (<= 860px). Respects reduced motion (layers still
   pin, but no scale/dim). */
export default function useStackedLayers(pageRef) {
  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const wide = window.matchMedia('(min-width: 861px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scroller = document.getElementById('root') || window
    const layers = [...root.querySelectorAll('[data-stack]')]
    if (!layers.length) return

    const navH = () => (window.innerWidth <= 640 ? 57 : 65)

    const place = () => {
      layers.forEach(l => {
        l.style.top = wide.matches
          ? `${Math.min(navH(), window.innerHeight - l.offsetHeight)}px`
          : ''
      })
    }

    let raf = 0
    const update = () => {
      raf = 0
      layers.forEach((l, i) => {
        // The thing that covers a layer: the next layer, or -- for the last (or
        // only) one, like a page hero -- whatever element follows it.
        const next = layers[i + 1] || l.nextElementSibling
        if (!wide.matches || calm.matches || !next) {
          l.style.setProperty('--cover', '0')
          return
        }
        const a = l.getBoundingClientRect()
        const nextTop = next.getBoundingClientRect().top
        const span = Math.min(a.height, window.innerHeight * 0.9)
        const p = Math.max(0, Math.min(1, (a.bottom - nextTop) / span))
        l.style.setProperty('--cover', p.toFixed(3))
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onResize = () => { place(); onScroll() }

    place()
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    layers.forEach(l => ro.observe(l))
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
      layers.forEach(l => { l.style.top = ''; l.style.removeProperty('--cover') })
    }
  }, [pageRef])
}
