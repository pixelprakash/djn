import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PostCard from '../components/PostCard'
import RichText from '../components/RichText'
import { Deadline, Cta } from '../components/NewsBits'
import { Slideshow } from '../components/PhotoGallery'
import NotFound from './NotFound'
import usePageTitle from '../hooks/usePageTitle'
import useStackedLayers from '../hooks/useStackedLayers'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { fmtDate } from '../lib/news'
import { newsMeta, newsPostMeta } from '../seo/routes'
import './News.css'
import './NewsPost.css'

/* One update on its own page. Left: the picture (a poster is shown whole),
   any further photos, and the full text. Right: a sticky "details" card with
   what a visitor needs to act -- topic, date, deadline, the action button,
   the original link, share. Below: a few more updates. On a phone the order
   is picture, details, text. */
export default function NewsPost() {
  const { slug } = useParams()
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const [slideshow, setSlideshow] = useState(null)
  const [copied, setCopied] = useState(false)
  const { data: feed, loading } = useCms('feed', FEED_QUERY, mapFeed, [])
  const post = feed.find(p => p.slug === slug)

  usePageTitle(post ? newsPostMeta(post) : newsMeta())

  if (!post) return loading ? <div className="nw" aria-busy="true" /> : <NotFound />

  const heading = post.title || post.text.split('\n')[0]
  const more = feed.filter(p => p.id !== post.id).slice(0, 3)
  const [cover, ...rest] = post.images

  // Native share sheet where there is one (phones); otherwise copy the link.
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) { await navigator.share({ title: heading, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* dismissed the share sheet, or clipboard blocked: nothing to do */ }
  }

  return (
    <div className="nw" ref={pageRef}>
      <PageHero
        className="nw-post-hero"
        title={heading}
        sub={[post.topic, fmtDate(post.date)].filter(Boolean).join(' · ')}
      />

      <div className="nw-sheet">
        <Link className="np-back" to="/news"><span aria-hidden="true">&larr;</span> All news</Link>

        <article className={`np${cover ? '' : ' np--no-media'}`}>
          {cover && (
            <div className="np-media">
              <button
                type="button"
                className="np-cover"
                style={{ '--np-fill': `url("${cover.thumb}")` }}
                onClick={() => setSlideshow({ startIdx: 0 })}
                aria-label={`Open photo 1 of ${post.images.length}`}
              >
                <img src={cover.src} alt={cover.alt} decoding="async" />
              </button>
              {rest.length > 0 && (
                <div className="np-thumbs">
                  {rest.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      className="np-thumb"
                      onClick={() => setSlideshow({ startIdx: i + 1 })}
                      aria-label={`Open photo ${i + 2} of ${post.images.length}`}
                    >
                      <img src={img.thumb} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <aside className="np-aside" aria-label="Details">
            <h2 className="np-aside-title">Details</h2>
            <dl className="np-facts">
              {post.topic && (<><dt>Topic</dt><dd>{post.topic}</dd></>)}
              <dt>Posted</dt><dd>{fmtDate(post.date)}</dd>
              {post.closesOn && (<><dt>Deadline</dt><dd><Deadline closesOn={post.closesOn} /></dd></>)}
            </dl>
            <Cta cta={post.cta} className="np-cta" />
            {post.url && (
              <a className="np-ghost" href={post.url} target="_blank" rel="noreferrer">
                Read the original<span className="np-sr"> of {heading}</span> <span aria-hidden="true">&#8599;</span>
              </a>
            )}
            <button type="button" className="np-ghost np-share" onClick={share}>
              {copied ? 'Link copied' : 'Share this update'}
            </button>
          </aside>

          <div className="np-text">
            <p><RichText text={post.text} /></p>
          </div>
        </article>

        {more.length > 0 && (
          <section className="np-more" aria-labelledby="np-more-title">
            <div className="np-more-head">
              <h2 id="np-more-title">More updates</h2>
              <Link to="/news">All news <span aria-hidden="true">&rarr;</span></Link>
            </div>
            <div className="nw-grid">
              {more.map(p => (
                <div className="nw-cell" key={p.id}><PostCard post={p} /></div>
              ))}
            </div>
          </section>
        )}
      </div>

      {slideshow && (
        <Slideshow
          images={post.images.map(i => i.src)}
          startIdx={slideshow.startIdx}
          onClose={() => setSlideshow(null)}
        />
      )}
    </div>
  )
}
