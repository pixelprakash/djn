import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

/* The colour theme: 'light' (the default for everyone) or 'dark' (only when chosen
   with the switch). The page's <html data-theme> is set before first paint by a
   small script in index.html from the saved choice; this hook reads it, switches
   it, saves it, and keeps other open tabs in step. The device's own dark-mode
   setting is deliberately not followed. */
const KEY = 'djm-theme'
const current = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

/* While the theme changes, every element's own colour/background/border transition
   is switched off (tokens.css, html.theme-switching). Otherwise ~30 links, chips and
   buttons would each start a .2s fade toward their new colour underneath the reveal,
   so the new picture would be caught mid-fade and shimmer. The flag is set in the
   same style pass as the theme, so no transition ever starts. */
function paint(theme) {
  document.documentElement.classList.add('theme-switching')
  document.documentElement.setAttribute('data-theme', theme)
  const m = document.querySelector('meta[name="theme-color"]')
  if (m) m.setAttribute('content', theme === 'dark' ? '#0f0f11' : '#f7f7f7')
}

/* Lift the no-transition flag once the change (and its reveal) is over, after two
   frames so the last restyle has happened with transitions still off. */
function settle(done) {
  const lift = () => requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('theme-switching')))
  if (done) done.then(lift, lift)
  else lift()
}

/* Switch themes. Where the browser can do a View Transition, the new theme is
   revealed by a circle growing from the switch (a single GPU-composited move: no
   element changes colour at a different moment from another, so nothing
   flickers). Elsewhere, or when the visitor prefers reduced motion, it switches
   at once. `origin` is the element the circle grows from. */
function apply(theme, origin, update) {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!origin || calm || typeof document.startViewTransition !== 'function') {
    paint(theme)
    if (update) update()
    settle(null)
    return
  }
  const r = origin.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const t = document.startViewTransition(() => {
    paint(theme)
    if (update) flushSync(update) // the switch's own icon changes inside the new picture
  })
  settle(t.finished)
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => {})
}

export default function useTheme() {
  const [theme, setTheme] = useState(current)

  const choose = useCallback((next, origin) => {
    apply(next, origin, () => setTheme(next))
    try { localStorage.setItem(KEY, next) } catch { /* private mode: lasts for this visit */ }
  }, [])
  // `origin`: the element the reveal grows from (the switch that was pressed).
  const toggle = useCallback(origin => choose(current() === 'dark' ? 'light' : 'dark', origin), [choose])

  // Another tab changed it.
  useEffect(() => {
    const onStorage = e => { if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) { paint(e.newValue); setTheme(e.newValue); settle(null) } }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { theme, toggle, isDark: theme === 'dark' }
}
