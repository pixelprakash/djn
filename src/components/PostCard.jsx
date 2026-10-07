import { useState } from 'react'
import { Slideshow } from './PhotoGallery'
import './PostCard.css'

/* One short update, laid out the way it reads on LinkedIn: who posted and
   when, the text (long ones fold behind "…see more"), a photo grid that
   opens a slideshow, the reaction/comment counts, and a link back to the
   original. Deliberately NOT a fake Like/Comment/Share bar -- those can't
   do anything on a portfolio, and buttons that do nothing are worse than
   none. Content comes from Sanity ("LinkedIn-style post"). */

const AUTHOR = { name: 'Deepak John Mathew', role: 'Professor of Design · IIT Hyderabad' }
const FOLD_CHARS = 240

// #hashtags and @names pick up the accent colour, like on LinkedIn; web
// addresses in the text (posters often say "Apply here https://...") become
// real links, without swallowing the full stop that ends the sentence.
function Rich({ text }) {
  return text.split(/(https?:\/\/[^\s<>"]+|#[\p{L}\p{N}_]+|(?<![\p{L}\p{N}_.])@[\p{L}\p{N}_.]+)/u).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?)\]]+$/, '')
      return (
        <span key={i}>
          <a className="pc-url" href={url} target="_blank" rel="noreferrer">{url.replace(/^https?:\/\/(www\.)?/, '')}</a>
          {part.slice(url.length)}
        </span>
      )
    }
    return /^[#@]/.test(part) ? <span key={i} className="pc-tag">{part}</span> : part
  })
}

const fmtDate = iso => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PostCard({ post }) {
  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(null)

  const long = post.text.length > FOLD_CHARS || post.text.split('\n').length > 4
  const shown = post.images.slice(0, 4)
  const extra = post.images.length - shown.length

  return (
    <article className="pc">
      <header className="pc-head">
        <span className="pc-avatar" aria-hidden="true">
          <img src="/profliepicnobg.webp" alt="" draggable="false" />
        </span>
        <div className="pc-who">
          <span className="pc-name">{AUTHOR.name}</span>
          <span className="pc-role">{AUTHOR.role}</span>
          <time className="pc-date" dateTime={post.date}>{fmtDate(post.date)}</time>
        </div>
        {(post.pinned || post.topic) && (
          <span className="pc-badges">
            {post.pinned && <span className="pc-badge pc-badge--pin">Pinned</span>}
            {post.topic && <span className="pc-badge">{post.topic}</span>}
          </span>
        )}
      </header>

      <p className={`pc-text${long && !open ? ' pc-text--fold' : ''}`}>
        <Rich text={post.text} />
      </p>
      {long && (
        <button
          type="button"
          className="pc-more"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Show less' : '…see more'}
        </button>
      )}

      {shown.length > 0 && (
        <div className={`pc-grid pc-grid--${Math.min(shown.length, 4)}`}>
          {shown.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="pc-cell"
              onClick={() => setSlide({ startIdx: i })}
              aria-label={`Open photo ${i + 1} of ${post.images.length}${extra > 0 && i === shown.length - 1 ? ` (+${extra} more)` : ''}`}
            >
              <img src={img.thumb} alt={img.alt} loading="lazy" decoding="async" />
              {extra > 0 && i === shown.length - 1 && (
                <span className="pc-extra" aria-hidden="true">+{extra}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {post.url && (
        <footer className="pc-foot">
          {post.url && (
            <a className="pc-link" href={post.url} target="_blank" rel="noreferrer">
              View on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
        </footer>
      )}

      {slide && (
        <Slideshow
          images={post.images.map(i => i.src)}
          startIdx={slide.startIdx}
          onClose={() => setSlide(null)}
        />
      )}
    </article>
  )
}
