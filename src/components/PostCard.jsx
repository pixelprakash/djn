import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Slideshow } from './PhotoGallery'
import RichText from './RichText'
import { Deadline, Cta } from './NewsBits'
import { fmtDate, newsPath } from '../lib/news'
import './PostCard.css'

/* One update as a card (the /news archive): photos first (a poster is shown
   whole, never cropped), then a topic label, date and deadline, the title
   (a link to the update's own page), the text (long ones fold behind
   "…see more"), the call-to-action button and an optional link out.
   Photos open a slideshow. Content comes from Sanity ("News, update or
   announcement"). */

const FOLD_CHARS = 240

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
          <Deadline closesOn={post.closesOn} />
        </div>
        {post.title && (
          <h3 className="pc-title">
            <Link to={newsPath(post)}>{post.title}</Link>
          </h3>
        )}

        <p className={`pc-text${long && !open ? ' pc-text--fold' : ''}`}>
          <RichText text={post.text} />
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

        <Cta cta={post.cta} className="pc-cta" />

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
