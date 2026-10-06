import { useSyncExternalStore } from 'react'

/* Whether the visitor asked their system for reduced motion. A tiny stand-in
   for framer-motion's hook of the same name, so loading the site's pages no
   longer pulls in that whole library just to read one media query. */
const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = cb => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const get = () => window.matchMedia(QUERY).matches

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, get, () => false)
}
