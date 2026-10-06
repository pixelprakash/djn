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

// #hashtags and @names pick up the accent colour, like on LinkedIn.
function Rich({ text }) {
  return text.split(/(#[\p{L}\p{N}_]+|@[\p{L}\p{N}_.]+)/u).map((part, i) =>
    /^[#@]/.test(part) ? <span key={i} className="pc-tag">{part}</span> : part
  )
}

const fmtDate = iso => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fmtCount = n => n.toLocaleString('en-IN')

export default function PostCard({ post }) {
  const [open, setOpen] = useState(false)
  const [slide, setSlide] = useState(null)

  const long = post.text.length > FOLD_CHARS || post.text.split('\n').length > 4
  const shown = post.images.slice(0, 4)
  const extra = post.images.length - shown.length
  const hasCounts = post.reactions != null || post.comments != null

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

      {(hasCounts || post.url) && (
        <footer className="pc-foot">
          <span className="pc-counts">
            {post.reactions != null && (
              <span className="pc-count">
                <svg className="pc-like" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="currentColor" />
                  <path fill="#fff" d="M8 11h2.2v6H8zm3.2 6V10.7l2.2-3.9c.9 0 1.5.8 1.3 1.6l-.4 1.8h2.4c.8 0 1.4.7 1.2 1.5l-.8 3.5c-.1.5-.6.9-1.2.9h-4.7z" />
                </svg>
                {fmtCount(post.reactions)}<span className="pc-sr"> reactions</span>
              </span>
            )}
            {post.comments != null && (
              <span className="pc-count">{fmtCount(post.comments)} comments</span>
            )}
          </span>
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
