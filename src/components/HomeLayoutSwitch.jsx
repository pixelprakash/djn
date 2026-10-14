import { createPortal } from 'react-dom'
import './HomeLayoutSwitch.css'

/* A small switch, fixed at the bottom of the home page, for flipping between the
   two layouts while showing them (Option 1: photo first; Option 2: work first).
   Rendered on <body> so the page's own styles can't touch it. Remove this
   component (and useHomeLayout) once one layout is chosen. */
export default function HomeLayoutSwitch({ value, onChange }) {
  return createPortal(
    <div className="hls" role="group" aria-label="Home page layout">
      <span className="hls-label" aria-hidden="true">Layout</span>
      {[[1, 'Photo first'], [2, 'Work first']].map(([n, hint]) => (
        <button
          key={n}
          type="button"
          className={`hls-btn${value === n ? ' hls-btn--on' : ''}`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
        >
          Option {n}<span className="hls-hint"> · {hint}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
