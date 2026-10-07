import { Link } from 'react-router-dom'
import { Deadline, Cta } from './NewsBits'
import { fmtDate, newsPath } from '../lib/news'
import './PostCard.css'

/* One update as a card (the /news archive): photos first (a poster is shown
   whole, never cropped), then a topic label, date and deadline, the title
   (a link to the update's own page), a short preview of the text, the
   call-to-action button and an optional link out. The whole card opens the
   update's page (the title's link is stretched over it); the photos and
   full text live there. Content comes from Sanity ("News, update or
   announcement"). */

export default function PostCard({ post, wide = false }) {
  const shown = post.images.slice(0, 4)
  const extra = post.images.length - shown.length

  return (
    <article className={`pc${post.pinned ? ' pc--pinned' : ''}${wide ? ' pc--wide' : ''}`}>
      {shown.length > 0 && (
        <div className={`pc-grid pc-grid--${Math.min(shown.length, 4)}`}>
          {shown.map((img, i) => (
            <div
              key={img.src}
              className="pc-cell"
              // A lone image (usually a poster) sits whole on a blurred copy
              // of itself, so every card's picture area is the same shape.
              style={shown.length === 1 ? { '--pc-fill': `url("${img.thumb}")` } : undefined}
            >
              <img src={img.thumb} alt={img.alt} loading="lazy" decoding="async" />
              {extra > 0 && i === shown.length - 1 && (
                <span className="pc-extra" aria-hidden="true">+{extra}</span>
              )}
            </div>
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
        <h3 className="pc-title">
          <Link to={newsPath(post)}>{post.title || post.text.split('\n')[0]}</Link>
        </h3>

        <p className="pc-text">{post.text.replace(/\s+/g, ' ')}</p>

        {(post.cta || post.url) && (
          <div className="pc-actions">
            <Cta cta={post.cta} />
            {post.url && (
              <a className="pc-link" href={post.url} target="_blank" rel="noreferrer">
                Read more<span className="pc-sr"> about {post.title || 'this update'}</span> <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
