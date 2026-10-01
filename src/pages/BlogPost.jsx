import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BLOG_POSTS } from './blogData'
import Reveal from '../components/Reveal'
import { Slideshow, PhotoGrid } from '../components/PhotoGallery'
import './BlogPost.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [slideshow, setSlideshow] = useState(null)

  const idx  = BLOG_POSTS.findIndex(p => p.slug === slug)
  const post = BLOG_POSTS[idx]
  const prevP = idx > 0 ? BLOG_POSTS[idx - 1] : null
  const nextP = idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null

  useEffect(() => { window.scrollTo({ top: 0 }) }, [slug])

  if (!post) {
    return (
      <div className="bp">
        <div className="bp-inner">
          <p className="bp-missing">
            That post doesn’t exist. <Link to="/blog">← Back to Blog</Link>
          </p>
        </div>
      </div>
    )
  }

  const cover   = post.images[0]
  const gallery = post.images.slice(1)

  return (
    <div className="bp">

      {/* ── COVER ── */}
      <section className="bp-hero" aria-label="Post cover">
        <img
          className="bp-hero-img"
          src={cover}
          alt={post.title}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="bp-hero-grad" aria-hidden />
      </section>

      <div className="bp-inner">

        <Link to="/blog" className="bp-back">
          <span aria-hidden="true">←</span> Blog
        </Link>

        <div className="bp-meta">
          <span className="bp-tag">{post.tag}</span>
          <span className="bp-date">{post.date}</span>
        </div>

        <h1 className="bp-title">{post.title}</h1>
        {post.venue && <p className="bp-venue">{post.venue}</p>}

        <div className="bp-rule" aria-hidden="true" />

        <Reveal as="article" className="bp-article">
          {post.paragraphs.map((para, i) => (
            <p key={i} className="bp-p">{para}</p>
          ))}
          {post.externalNote && (
            <p className="bp-p bp-external-note">{post.externalNote}</p>
          )}
        </Reveal>

        {gallery.length > 0 && (
          <Reveal as="section" className="bp-gallery-sec" aria-label="More photographs">
            <p className="bp-gallery-label">More from this post &mdash; {gallery.length} photo{gallery.length === 1 ? '' : 's'}</p>
            <PhotoGrid
              images={gallery}
              onOpen={i => setSlideshow({ images: gallery, startIdx: i })}
            />
          </Reveal>
        )}

        <a
          href={post.originalHref}
          target="_blank"
          rel="noreferrer"
          className="bp-original"
        >
          View original post on DJM Photography &#8599;
        </a>

      </div>

      {/* ── PREV / NEXT ── */}
      <Reveal as="nav" className="bp-pn" aria-label="Adjacent posts">
        <div className="bp-pn-inner-sep" aria-hidden />
        <div className="bp-pn-cell">
          {prevP ? (
            <Link to={`/blog/${prevP.slug}`} className="bp-pn-link" aria-label={`Previous: ${prevP.title}`}>
              <span className="bp-pn-dir">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Previous
              </span>
              <div className="bp-pn-thumb">
                <img src={prevP.images[0]} alt={prevP.title} loading="lazy" />
              </div>
              <span className="bp-pn-title">{prevP.title}</span>
            </Link>
          ) : (
            <div className="bp-pn-link bp-pn-empty">
              <span className="bp-pn-dir" style={{opacity:.2}}>— Most recent</span>
            </div>
          )}
        </div>
        <div className="bp-pn-cell bp-pn-cell-right">
          {nextP ? (
            <Link to={`/blog/${nextP.slug}`} className="bp-pn-link" aria-label={`Next: ${nextP.title}`}>
              <span className="bp-pn-dir">
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
              <div className="bp-pn-thumb">
                <img src={nextP.images[0]} alt={nextP.title} loading="lazy" />
              </div>
              <span className="bp-pn-title">{nextP.title}</span>
            </Link>
          ) : (
            <div className="bp-pn-link bp-pn-empty">
              <span className="bp-pn-dir" style={{opacity:.2}}>Earliest —</span>
            </div>
          )}
        </div>
      </Reveal>

      {slideshow && (
        <Slideshow
          images={slideshow.images}
          startIdx={slideshow.startIdx}
          onClose={() => setSlideshow(null)}
        />
      )}
    </div>
  )
}
