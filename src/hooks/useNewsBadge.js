import { useEffect, useSyncExternalStore } from 'react'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { isFresh } from '../lib/news'

/* Whether the navbar's News item should wear its "new" dot: the newest update
   was posted within the last few days AND this visitor hasn't opened News
   since it appeared. Opening any /news page marks everything seen (kept in
   localStorage, so it also holds across tabs); the next update brings the dot
   back. The feed is the same cached read the home page uses. */
const KEY = 'djm-news-seen'
const EVT = 'djm-news-seen'

const read = () => { try { return localStorage.getItem(KEY) || '' } catch { return '' } }
const subscribe = cb => {
  window.addEventListener(EVT, cb)
  window.addEventListener('storage', cb)
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener('storage', cb) }
}

export default function useNewsBadge(pathname) {
  const { data: feed } = useCms('feed', FEED_QUERY, mapFeed, [])
  const seen = useSyncExternalStore(subscribe, read, () => '')
  const newest = feed.reduce((m, p) => (p.date > m ? p.date : m), '')
  const onNews = pathname.startsWith('/news')

  useEffect(() => {
    if (!onNews || !newest || read() >= newest) return
    try { localStorage.setItem(KEY, newest) } catch { /* private mode: dot just stays for its 3 days */ }
    window.dispatchEvent(new Event(EVT))
  }, [onNews, newest])

  return !onNews && Boolean(newest) && isFresh(newest) && seen < newest
}
