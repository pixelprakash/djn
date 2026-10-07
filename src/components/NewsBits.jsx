import { closingInfo } from '../lib/news'
import './NewsBits.css'

/* Two small pieces used wherever an update appears. */

// "Closes in 12 days" / "Closed 28 Apr 2026" -- nothing if there is no date.
export function Deadline({ closesOn }) {
  const c = closingInfo(closesOn)
  if (!c) return null
  return <span className={`nb-deadline nb-deadline--${c.state}`}>{c.label}</span>
}

// The one clear action on an update ("Apply", "Register"...).
export function Cta({ cta, className = '' }) {
  if (!cta) return null
  return (
    <a className={`nb-cta ${className}`} href={cta.url} target="_blank" rel="noreferrer">
      {cta.label} <span aria-hidden="true">&#8599;</span>
    </a>
  )
}
