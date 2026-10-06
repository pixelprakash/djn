import { useState, useEffect, useCallback, useRef } from 'react'
import './PhotoGallery.css'

/* Shared by ProjectDetail and BlogPost -- any page that needs a click-to-
   enlarge photo grid with a fullscreen, keyboard-navigable slideshow. */

export function Slideshow({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const total     = images.length
  const stripRef  = useRef(null)

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [prev, next, onClose])

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

  return (
    <div className="ss-bg" onClick={onClose}>
      <div className="ss-wrap" onClick={e => e.stopPropagation()}>

        <button className="ss-x" onClick={onClose} aria-label="Close slideshow">✕</button>

        <div className="ss-stage">
          <button className="ss-btn ss-btn--prev" onClick={prev} aria-label="Previous photo">‹</button>
          <img
            key={idx}
            src={images[idx]}
            alt=""
            className="ss-photo"
            loading="eager"
            decoding="async"
          />
          <button className="ss-btn ss-btn--next" onClick={next} aria-label="Next photo">›</button>
        </div>

        <div className="ss-foot">
          <span className="ss-idx">
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
    </div>
  )
}

export function PhotoGrid({ images, onOpen }) {
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
          aria-label={`Open photo ${i + 1}`}
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
