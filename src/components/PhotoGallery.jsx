import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import './PhotoGallery.css'

/* Shared by ProjectDetail and BlogPost -- any page that needs a click-to-
   enlarge photo grid with a fullscreen, keyboard-navigable slideshow. */

export function Slideshow({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const total     = images.length
  const stripRef  = useRef(null)
  const dialogRef = useRef(null)
  const closeRef  = useRef(null)
  const touchX    = useRef(null)

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
      // Keep Tab inside the dialog (WCAG 2.4.3): wrap at either end.
      if (e.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll('button')].filter(b => b.offsetParent !== null || b === document.activeElement)
        if (!items.length) return
        const first = items[0], last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
        else if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [prev, next, onClose])

  // Focus moves into the dialog when it opens and returns to whatever opened
  // it when it closes.
  useEffect(() => {
    const opener = document.activeElement
    if (closeRef.current) closeRef.current.focus({ preventScroll: true })
    return () => { if (opener && opener.focus) opener.focus({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const thumb = strip.children[idx]
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [idx])

  // Lock page scroll while open. The site scrolls inside #root (not the body),
  // so that has to be locked too or the page moves behind the slideshow.
  useEffect(() => {
    const scroller = document.getElementById('root')
    document.body.style.overflow = 'hidden'
    if (scroller) scroller.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      if (scroller) scroller.style.overflow = ''
    }
  }, [])

  // Rendered on <body>, not where it was opened: a position:fixed overlay
  // inside any transformed or clipped ancestor (a Reveal wrapper, a card with
  // overflow:hidden) is sized and clipped to that ancestor, not the screen.
  return createPortal(
    <div className="ss-bg" onClick={onClose}>
      <div
        className="ss-wrap"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo viewer, photo ${idx + 1} of ${total}`}
        onClick={e => e.stopPropagation()}
      >

        <button className="ss-x" ref={closeRef} onClick={onClose} aria-label="Close slideshow">✕</button>

        <div
          className="ss-stage"
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            // A horizontal swipe changes photo, like the arrows do.
            const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX)
            touchX.current = null
            if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
          }}
        >
          <button className="ss-btn ss-btn--prev" onClick={prev} aria-label="Previous photo">‹</button>
          <img
            key={idx}
            src={images[idx]}
            alt={`Photograph ${idx + 1} of ${total}`}
            className="ss-photo"
            loading="eager"
            decoding="async"
          />
          <button className="ss-btn ss-btn--next" onClick={next} aria-label="Next photo">›</button>
        </div>

        <div className="ss-foot">
          <span className="ss-idx" aria-hidden="true">
            {String(idx + 1).padStart(2,'0')}
            <span style={{margin:'0 5px',opacity:.25}}>/</span>
            {String(total).padStart(2,'0')}
          </span>
          <div className="ss-strip" ref={stripRef}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`ss-tn${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function PhotoGrid({ images, onOpen, label }) {
  const variant =
    images.length === 1 ? 'pg-1' :
    images.length === 2 ? 'pg-2' :
    images.length <= 4  ? 'pg-4' :
    'pg-many'

  return (
    <div className={`pg ${variant}`}>
      {images.map((src, i) => (
        <div
          key={i}
          className="pg-item"
          onClick={() => onOpen(i)}
          role="button"
          tabIndex={0}
          aria-label={`Open photo ${i + 1} of ${images.length}${label ? ` from ${label}` : ''}`}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(i) } }}
        >
          <img src={src} alt="" loading="lazy" decoding="async" />
          <div className="pg-veil" aria-hidden />
          <span className="pg-num">{String(i + 1).padStart(2,'0')}</span>
        </div>
      ))}
    </div>
  )
}
