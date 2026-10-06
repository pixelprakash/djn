import { useEffect } from 'react'

const SITE = 'Deepak John Mathew'
const HOME = 'Deepak John Mathew — Professor of Design, IIT Hyderabad'

/* Sets the browser tab / window title for the current page (WCAG 2.4.2 Page
   Titled). It is a single-page app, so without this every page would keep the
   home page's title -- which is also what a screen reader announces and what
   browser history lists. Pass nothing for the home page. */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : HOME
  }, [title])
}
