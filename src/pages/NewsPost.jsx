import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import RichText from '../components/RichText'
import { Deadline, Cta } from '../components/NewsBits'
import { Slideshow, PhotoGrid } from '../components/PhotoGallery'
import NotFound from './NotFound'
import usePageTitle from '../hooks/usePageTitle'
import useStackedLayers from '../hooks/useStackedLayers'
import { useCms, FEED_QUERY, mapFeed } from '../lib/cms'
import { fmtDate } from '../lib/news'
import { newsMeta, newsPostMeta } from '../seo/routes'
import './News.css'
import './NewsPost.css'

/* One update on its own page: a shareable address, the whole text and all
   its photos, the deadline and the action button. */
export default function NewsPost() {
  const { slug } = useParams()
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const [slideshow, setSlideshow] = useState(null)
  const { data: feed, loading } = useCms('feed', FEED_QUERY, mapFeed, [])
  const post = feed.find(p => p.slug === slug)

  usePageTitle(post ? newsPostMeta(post) : newsMeta())

  if (!post) return loading ? <div className="nw" aria-busy="true" /> : <NotFound />

  const heading = post.title || post.text.split('\n')[0]

  return (
    <div className="nw" ref={pageRef}>
      <PageHero
        title={heading}
        sub={[post.topic, fmtDate(post.date)].filter(Boolean).join(' · ')}
      />

      <div className="nw-sheet">
        <article className="np">
          <Link className="np-back" to="/news"><span aria-hidden="true">&larr;</span> All news</Link>

          {(post.closesOn || post.cta) && (
            <div className="np-actions">
              <Deadline closesOn={post.closesOn} />
              <Cta cta={post.cta} />
            </div>
          )}

          <p className="np-text"><RichText text={post.text} /></p>

          {post.url && (
            <a className="np-link" href={post.url} target="_blank" rel="noreferrer">
              Read more<span className="np-sr"> about {heading}</span> <span aria-hidden="true">&#8599;</span>
            </a>
          )}

          {post.images.length > 0 && (
            <div className="np-photos">
              <PhotoGrid
                images={post.images.map(i => i.thumb)}
                label={heading}
                onOpen={i => setSlideshow({ startIdx: i })}
              />
            </div>
          )}
        </article>
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
