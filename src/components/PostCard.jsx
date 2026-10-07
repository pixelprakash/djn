import { useState } from 'react'
import { Slideshow } from './PhotoGallery'
import './PostCard.css'

/* One news item, update or announcement: photos first (a poster is shown
   whole, never cropped), then a topic label and date, the title, and the
   text (long ones fold behind "…see more"). Photos open a slideshow; an
   optional link goes to the original. Content comes from Sanity ("News,
   update or announcement"). */

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
    <article className={`pc${post.pinned ? ' pc--pinned' : ''}`}>
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

      <div className="pc-body">
        <div className="pc-meta">
          {post.pinned && <span className="pc-pin">Pinned</span>}
          {post.topic && <span className="pc-topic">{post.topic}</span>}
          <time className="pc-date" dateTime={post.date}>{fmtDate(post.date)}</time>
        </div>
        {post.title && <h3 className="pc-title">{post.title}</h3>}

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

        {post.url && (
          <a className="pc-link" href={post.url} target="_blank" rel="noreferrer">
            Read more<span className="pc-sr"> about {post.title || 'this update'}</span> <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

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
