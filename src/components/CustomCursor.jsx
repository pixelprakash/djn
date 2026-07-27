import { useEffect, useRef } from 'react'
import './CustomCursor.css'

/* Camera-viewfinder cursor — four AF-bracket corners around a center dot,
   nodding to the photography side of the profile without being a gimmick.
   Desktop (fine pointer) only; a plain mouse-follow with no state logic
   would be worse than the OS cursor, so every hoverable category gets a
   distinct, purposeful state instead of one generic "hover" look:
     - text        over inputs/textareas — cursor hides, native caret shows
     - view        over things that open larger (photos, project/blog
                    cards, videos) — brackets pull in tight + expand glyph
     - interactive over links/buttons/nav — brackets relax outward
     - default     everything else — resting viewfinder                  */

const VIEW_SELECTOR =
  '.pg-item, .hp-card, .bl-card, .bl-featured, .lab-video, .proj-card, .lab-slider-img'
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], select, label, .tn-link, .tn-cta, .tab-btn, .hp-ctrl, .ss-btn, .ss-tn'
const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]'

function classify(el) {
  if (!el || !el.closest) return 'default'
  if (el.closest(TEXT_SELECTOR)) return 'text'
  if (el.closest(VIEW_SELECTOR)) return 'view'
  if (el.closest(INTERACTIVE_SELECTOR)) return 'interactive'
  return 'default'
}

export default function CustomCursor() {
  const rootRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    const root = rootRef.current
    const html = document.documentElement
    html.classList.add('cc-enabled')

    let state = 'default'
    const setState = next => {
      if (next === state) return
      state = next
      root.dataset.state = next
    }

    const onMove = e => {
      // Show on the first real mousemove rather than waiting for a
      // document "mouseenter" — that event never fires if the page loads
      // with the pointer already sitting over it, which is common enough
      // that relying on it left the cursor permanently invisible.
      root.style.opacity = '1'
      root.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      setState(classify(e.target))
    }
    const onDown = () => root.classList.add('cc--down')
    const onUp   = () => root.classList.remove('cc--down')
    // relatedTarget is null only when the pointer leaves the document
    // entirely (vs. moving between elements inside it).
    const onOut = e => { if (!e.relatedTarget) root.style.opacity = '0' }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseout', onOut)

    return () => {
      html.classList.remove('cc-enabled')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <div className="cc" ref={rootRef} data-state="default" aria-hidden="true" style={{ opacity: 0 }}>
      <svg className="cc-brackets" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path className="cc-tl" d="M4 15V8a3 3 0 0 1 3-3h7" />
        <path className="cc-tr" d="M44 15V8a3 3 0 0 0-3-3h-7" />
        <path className="cc-bl" d="M4 33v7a3 3 0 0 0 3 3h7" />
        <path className="cc-br" d="M44 33v7a3 3 0 0 1-3 3h-7" />
      </svg>
      <span className="cc-dot" />
      <svg className="cc-expand" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
    </div>
  )
}
