import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './HomeLayoutSwitch.css'

/* A small round button, fixed at the corner of the home page, that opens into a
   switch for flipping between the two layouts while showing them (Option 1: photo
   first; Option 2: work first). Closed, it is just a quiet circle showing the
   current option, so it doesn't compete with the design; click it and it expands,
   pick a layout and it folds back. Escape or a click elsewhere also folds it.
   Rendered on <body> so the page's own styles can't touch it. Remove this
   component (and useHomeLayout) once one layout is chosen. */
export default function HomeLayoutSwitch({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const fab = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = e => { if (root.current && !root.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); fab.current?.focus() } }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return createPortal(
    <div className={`hls${open ? ' hls--open' : ''}`} ref={root}>
      {open && (
        <div className="hls-panel" role="group" aria-label="Home page layout">
          {[[1, 'Photo first'], [2, 'Work first']].map(([n, hint]) => (
            <button
              key={n}
              type="button"
              className={`hls-btn${value === n ? ' hls-btn--on' : ''}`}
              aria-pressed={value === n}
              onClick={() => { onChange(n); setOpen(false); fab.current?.focus() }}
            >
              Option {n}<span className="hls-hint"> · {hint}</span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        ref={fab}
        className="hls-fab"
        aria-expanded={open}
        aria-label={`Home page layout: Option ${value}. ${open ? 'Close' : 'Change layout'}`}
        onClick={() => setOpen(o => !o)}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="2" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="10" y="2" width="6" height="6" fill="currentColor" /><rect x="2" y="10" width="6" height="6" fill="currentColor" /><rect x="10" y="10" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            <span className="hls-num" aria-hidden="true">{value}</span>
          </>
        )}
      </button>
    </div>,
    document.body,
  )
}
