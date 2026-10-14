import { useCallback, useState } from 'react'

/* Which home-page layout to show: 1 = the photo-led layout, 2 = the work-first
   layout. Chosen with the on-page switch (HomeLayoutSwitch), remembered in
   localStorage, and settable by address (?layout=2) so a version can be linked
   to directly. */
const KEY = 'djm-home-layout'
const read = () => {
  try {
    const q = new URLSearchParams(window.location.search).get('layout')
    if (q === '1' || q === '2') return Number(q)
    const s = localStorage.getItem(KEY)
    if (s === '1' || s === '2') return Number(s)
  } catch { /* storage blocked: default */ }
  return 1
}

export default function useHomeLayout() {
  const [layout, setLayout] = useState(read)
  const choose = useCallback(n => {
    setLayout(n)
    try {
      localStorage.setItem(KEY, String(n))
      const url = new URL(window.location.href)
      url.searchParams.set('layout', String(n))
      window.history.replaceState(window.history.state, '', url)
    } catch { /* ignore */ }
    document.getElementById('root')?.scrollTo({ top: 0 })
  }, [])
  return [layout, choose]
}
