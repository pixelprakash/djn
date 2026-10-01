import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { BLOG_POSTS } from './blogData'
import { preloadForPath } from '../routePreload'
import './Blog.css'

/* Listing cards read straight off the shared post data (src/pages/blogData.js)
   -- each post's own cover photo (images[0]) and its internal /blog/:slug
   page, instead of a separate placeholder dataset that links out. */
const POSTS = BLOG_POSTS.map(function(p, i) {
  return {
    date: p.date,
    tag: p.tag,
    title: p.title,
    desc: p.desc,
    href: '/blog/' + p.slug,
    img: p.images[0],
    featured: i === 0,
  }
})

const ALL_TAGS = ['All', ...Array.from(new Set(POSTS.map(function(p) { return p.tag })))]

export default function Blog() {
  const [active, setActive] = useState('All')

  const visible  = active === 'All' ? POSTS : POSTS.filter(function(p) { return p.tag === active })
  const featured = visible.find(function(p) { return p.featured })
  const rest     = visible.filter(function(p) { return !p.featured || active !== 'All' })

  return (
    <div className="bl">

      {/* -- HEADER -- */}
      <header className="bl-head">
        <div className="bl-head-left">
          <h1 className="bl-title">Blog &amp; Notes</h1>
          <p className="bl-sub">Photography, design research, education, and everything in between.</p>
        </div>
      </header>

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
        <a
          href="https://djmphotography.blogspot.com"
          target="_blank"
          rel="noreferrer"
          className="bl-external"
        >
          Full archive &#8599;
        </a>
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
