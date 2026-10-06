import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { BLOG_POSTS } from './blogData'
import { useCms, POSTS_QUERY, mapPosts, FEED_QUERY, mapFeed } from '../lib/cms'
import PostCard from '../components/PostCard'
import PageHero from '../components/PageHero'
import useStackedLayers from '../hooks/useStackedLayers'
import { preloadForPath } from '../routePreload'
import './Blog.css'

/* Listing cards read off the shared post data (live from Sanity, else the
   built-in src/pages/blogData.js) -- each post's own cover photo and its
   internal /blogs/:slug page. */
const toCard = (p, i) => ({
  date: p.date,
  tag: p.tag,
  title: p.title,
  desc: p.desc,
  href: '/blogs/' + p.slug,
  img: (p.thumbs && p.thumbs[0]) || p.images[0],
  featured: i === 0,
})

export default function Blog() {
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const [active, setActive] = useState('All')
  const { data: posts, loading } = useCms('posts', POSTS_QUERY, mapPosts, BLOG_POSTS)
  // Photos differ between the live and built-in copies, so the cards wait
  // for the live answer instead of swapping pictures a moment after paint.
  // Short LinkedIn-style updates. No built-in copy: nothing published, nothing shown.
  const { data: feed } = useCms('feed', FEED_QUERY, mapFeed, [])
  const POSTS = useMemo(() => (loading ? [] : posts.map(toCard)), [loading, posts])
  const ALL_TAGS = useMemo(() => ['All', ...new Set(POSTS.map(p => p.tag))], [POSTS])

  const visible  = active === 'All' ? POSTS : POSTS.filter(function(p) { return p.tag === active })
  const featured = visible.find(function(p) { return p.featured })
  const rest     = visible.filter(function(p) { return !p.featured || active !== 'All' })

  return (
    <div className="bl" ref={pageRef}>

      {/* -- HEADER -- */}
      <PageHero
        title="Blogs &amp; Notes"
        sub="Photography, design research, education, and everything in between."
      />

      {/* -- FROM LINKEDIN: short updates -- */}
      {feed.length > 0 && (
        <section className="bl-feed" aria-labelledby="bl-feed-title">
          <div className="bl-feed-head">
            <h2 className="bl-section-title" id="bl-feed-title">From LinkedIn</h2>
            <p className="bl-feed-sub">Short updates, as he shares them.</p>
          </div>
          <div className="bl-feed-grid">
            <div className="bl-feed-list">
              {feed.map(post => <PostCard key={post.id} post={post} />)}
            </div>

            {/* Right-hand panel: balances the single feed column, and is the
                one place to follow him for new posts. */}
            <aside className="bl-follow" aria-label="Follow on LinkedIn">
              <h3 className="bl-follow-title">Follow for new posts</h3>
              <p className="bl-follow-text">
                New updates are shared on LinkedIn first and collected here.
              </p>
              <a
                className="bl-follow-btn"
                href="https://www.linkedin.com/in/deepak-john-mathew-b079ab1a/"
                target="_blank"
                rel="noreferrer"
              >
                Follow on LinkedIn <span aria-hidden="true">&#8599;</span>
              </a>
            </aside>
          </div>
        </section>
      )}

      {feed.length > 0 && (
        <h2 className="bl-section-title bl-section-title--articles">Articles &amp; exhibitions</h2>
      )}

      {/* -- TAG FILTERS -- */}
      <div className="bl-filters">
        {ALL_TAGS.map(function(t) {
          return (
            <button
              key={t}
              className={active === t ? 'bl-filter-btn bl-filter-btn--on' : 'bl-filter-btn'}
              onClick={function() { setActive(t) }}
            >
              {t}
            </button>
          )
        })}
        {/* "Full archive" link to the old Blogger blog -- switched off for now.
        <a
          href="https://djmphotography.blogspot.com"
          target="_blank"
          rel="noreferrer"
          className="bl-external"
        >
          Full archive &#8599;
        </a>
        */}
      </div>

      <div className="bl-body">

        {/* -- FEATURED POST -- */}
        {active === 'All' && featured && (
          <Link
            to={featured.href}
            className="bl-featured"
            onMouseEnter={() => preloadForPath(featured.href)}
            onFocus={() => preloadForPath(featured.href)}
            onTouchStart={() => preloadForPath(featured.href)}
          >
            <div className="bl-featured-img">
              <img
                src={featured.img}
                alt={featured.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="bl-featured-overlay" />
            </div>
            <div className="bl-featured-info">
              <div className="bl-featured-meta">
                <span className="bl-tag">{featured.tag}</span>
                <span className="bl-date">{featured.date}</span>
              </div>
              <h2 className="bl-featured-title">{featured.title}</h2>
              <p className="bl-featured-desc">{featured.desc}</p>
              <span className="bl-read-cta">Read post &#8594;</span>
            </div>
          </Link>
        )}

        {/* -- POST GRID -- */}
        <div className="bl-grid">
          {(active === 'All' ? rest : visible).map(function(p, i) {
            return (
              <Reveal
                as={Link}
                key={i}
                to={p.href}
                className="bl-card"
                delay={(i % 3) * 0.05}
                onMouseEnter={() => preloadForPath(p.href)}
                onFocus={() => preloadForPath(p.href)}
                onTouchStart={() => preloadForPath(p.href)}
              >
                <div className="bl-card-img">
                  <img src={p.img} alt={p.title} loading="lazy" />
                </div>
                <div className="bl-card-body">
                  <div className="bl-card-meta">
                    <span className="bl-tag">{p.tag}</span>
                    <span className="bl-date">{p.date}</span>
                  </div>
                  <h2 className="bl-card-title">{p.title}</h2>
                  <p className="bl-card-desc">{p.desc}</p>
                  <span className="bl-read">Read post &#8594;</span>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* -- ARCHIVE BANNER -- */}
        <Reveal
          as="a"
          href="https://djmphotography.blogspot.com"
          target="_blank"
          rel="noreferrer"
          className="bl-banner"
        >
          <div className="bl-banner-text">
            <p className="bl-banner-label">Full blog archive</p>
            <p className="bl-banner-title">Read all posts on DJM Photography &#8599;</p>
            <p className="bl-banner-sub">Photographs, talks, academic updates, and more at djmphotography.blogspot.com</p>
          </div>
          <div className="bl-banner-arrow">&#8599;</div>
        </Reveal>

      </div>
    </div>
  )
}
