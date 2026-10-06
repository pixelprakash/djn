import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { BLOG_POSTS } from './blogData'
import { useCms, POSTS_QUERY, mapPosts } from '../lib/cms'
import Reveal from '../components/Reveal'
import { Slideshow, PhotoGrid } from '../components/PhotoGallery'
import './BlogPost.css'

// Body text from Sanity is rich text: paragraphs (rendered with the page's
// own .bp-p style) plus bold / italic / links.
const BODY_COMPONENTS = {
  block: { normal: ({ children }) => <p className="bp-p">{children}</p> },
  marks: {
    link: ({ value, children }) => {
      const href = value && value.href
      const external = /^https?:/.test(href || '')
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const [slideshow, setSlideshow] = useState(null)
  const [copied, setCopied] = useState(false)
  const { data: posts, loading } = useCms('posts', POSTS_QUERY, mapPosts, BLOG_POSTS)

  const idx  = posts.findIndex(p => p.slug === slug)
  const post = posts[idx]
  const prevP = idx > 0 ? posts[idx - 1] : null
  const nextP = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null

  useEffect(() => { window.scrollTo({ top: 0 }) }, [slug])

  // Native share sheet where there is one (phones); otherwise copy the link.
  const shareLink = async () => {
    const url = window.location.href
    try {
      if (navigator.share) { await navigator.share({ title: post && post.title, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* dismissed the share sheet, or clipboard blocked: nothing to do */ }
  }

  // The live and built-in copies use different photo URLs, so the page waits
  // for the live answer rather than swapping the cover after it has painted.
  if (loading) return <div className="bp" aria-busy="true" />

  if (!post) {
    return (
      <div className="bp">
        <div className="bp-inner">
          <p className="bp-missing">
            That post doesn’t exist. <Link to="/blogs">← Back to Blogs</Link>
          </p>
        </div>
      </div>
    )
  }

  const cover   = post.images[0]
  const gallery = post.images.slice(1)

  return (
    <div className="bp">

      {/* ── HERO: a tinted title band (same family as the page heroes), with the
          cover photograph straddling its lower edge ── */}
      <header className={`bp-hero${cover ? ' bp-hero--cover' : ''}`}>
        <div className="bp-band">
          <Link to="/blogs" className="bp-back">
            <span aria-hidden="true">←</span> Blogs
          </Link>

          <div className="bp-meta">
            <span className="bp-tag">{post.tag}</span>
            <span className="bp-date">{post.date}</span>
          </div>

          <h1 className="bp-title">{post.title}</h1>
          {post.venue && <p className="bp-venue">{post.venue}</p>}
        </div>

        {cover && (
          <button
            type="button"
            className="bp-cover"
            onClick={() => setSlideshow({ images: post.images, startIdx: 0 })}
            aria-label={`Open photographs (${post.images.length})`}
          >
            <img
              className="bp-cover-img"
              src={cover}
              alt={post.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {post.images.length > 1 && (
              <span className="bp-cover-count" aria-hidden="true">
                {post.images.length} photos
              </span>
            )}
          </button>
        )}
      </header>

      {/* ── ARTICLE + DETAILS RAIL ── */}
      <div className="bp-layout">
        <Reveal as="article" className="bp-article">
          {post.body
            ? <PortableText value={post.body} components={BODY_COMPONENTS} />
            : post.paragraphs.map((para, i) => (
                <p key={i} className="bp-p">{para}</p>
              ))}
          {post.externalNote && (
            <p className="bp-p bp-external-note">{post.externalNote}</p>
          )}
        </Reveal>

        <aside className="bp-rail" aria-label="About this post">
          <div className="bp-card">
            <h2 className="bp-card-title">About this post</h2>
            <dl className="bp-facts">
              <div><dt>Category</dt><dd>{post.tag}</dd></div>
              {post.date && <div><dt>Date</dt><dd>{post.date}</dd></div>}
              {post.venue && <div><dt>Venue</dt><dd>{post.venue}</dd></div>}
              {post.images.length > 0 && (
                <div><dt>Photographs</dt><dd>{post.images.length}</dd></div>
              )}
            </dl>

            <div className="bp-card-actions">
              <button type="button" className="bp-btn" onClick={shareLink}>
                {copied ? 'Link copied' : 'Share this post'}
              </button>
              {post.originalHref && (
                <a
                  href={post.originalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="bp-btn bp-btn--ghost"
                >
                  View original post <span aria-hidden="true">&#8599;</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      {gallery.length > 0 && (
        <Reveal as="section" className="bp-gallery-sec" aria-label="More photographs">
          <p className="bp-gallery-label">More from this post &mdash; {gallery.length} photo{gallery.length === 1 ? '' : 's'}</p>
          <PhotoGrid
            images={gallery}
            onOpen={i => setSlideshow({ images: gallery, startIdx: i })}
          />
        </Reveal>
      )}

      {/* ── PREV / NEXT ── */}
      <Reveal as="nav" className="bp-pn" aria-label="Adjacent posts">
        <div className="bp-pn-inner-sep" aria-hidden />
        <div className="bp-pn-cell">
          {prevP ? (
            <Link to={`/blogs/${prevP.slug}`} className="bp-pn-link" aria-label={`Previous: ${prevP.title}`}>
              <span className="bp-pn-dir">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Previous
              </span>
              <div className="bp-pn-thumb">
                <img src={(prevP.thumbs && prevP.thumbs[0]) || prevP.images[0]} alt={prevP.title} loading="lazy" />
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
            <Link to={`/blogs/${nextP.slug}`} className="bp-pn-link" aria-label={`Next: ${nextP.title}`}>
              <span className="bp-pn-dir">
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
              <div className="bp-pn-thumb">
                <img src={(nextP.thumbs && nextP.thumbs[0]) || nextP.images[0]} alt={nextP.title} loading="lazy" />
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
