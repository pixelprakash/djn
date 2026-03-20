import { useState } from 'react'
import './Blog.css'

const POSTS = [
  {
    date: 'Aug 2021',
    tag: 'Academic',
    title: '9th and 10th Convocation -- IIT Hyderabad',
    desc: 'Photographs and reflections from the 9th and 10th Convocation ceremony at IIT Hyderabad -- a celebration of students, mentors, and the years of work behind every degree.',
    href: 'http://djmphotography.blogspot.com/2021/08/9th-and-10th-convocation-iith.html',
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=600&fit=crop&q=85',
    featured: true,
  },
  {
    date: 'Aug 2021',
    tag: 'Talk',
    title: 'WDO Education Forum -- Talk by Prof. Deepak John Mathew',
    desc: 'A talk at the World Design Organisation Research and Education Forum -- exploring the role of design education in shaping a sustainable and equitable future.',
    href: 'http://djmphotography.blogspot.com/2021/08/wdo-education-forum-talk-by-prof-deepak.html',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=440&fit=crop&q=80',
  },
  {
    date: 'Apr 2021',
    tag: 'Talk',
    title: 'UX India 2017 -- Keynote Talk',
    desc: 'Notes and photographs from the UX India 2017 conference talk -- on bridging user research, visual communication, and design thinking in the Indian context.',
    href: 'http://djmphotography.blogspot.com/2021/04/ux-india-talk.html',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&h=440&fit=crop&q=80',
  },
  {
    date: 'Oct 2016',
    tag: 'Education',
    title: 'Department of Design Offers Minor in Design at IIT Hyderabad',
    desc: 'The Department of Design at IIT Hyderabad now offers a Minor in Design for B.Tech students -- an opportunity to develop design thinking and creative problem-solving alongside engineering.',
    href: 'http://djmphotography.blogspot.com/2016/10/department-of-design-offers-minor-in.html',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&h=440&fit=crop&q=80',
  },
  {
    date: 'Feb 2014',
    tag: 'Announcement',
    title: 'IIT Hyderabad Launches New MDes and PhD Programs',
    desc: 'IIT Hyderabad is launching a two-year full-time M.Des. programme offering broad-based design understanding with student-driven specialisation, alongside a new PhD in Design.',
    href: 'http://djmphotography.blogspot.com/2014/02/iit-hyderabad-is-starting-new-mdes-and.html',
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&h=440&fit=crop&q=80',
  },
  {
    date: 'Jan 2025',
    tag: 'Research',
    title: 'Why Design Education Needs VR -- Now',
    desc: 'A reflection on three years of immersive classroom experiments and what we have learned about embodied learning in design studios.',
    href: 'http://djmphotography.blogspot.com',
    img: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=700&h=440&fit=crop&q=80',
  },
]

const ALL_TAGS = ['All', ...Array.from(new Set(POSTS.map(function(p) { return p.tag })))]

export default function Blog() {
  const [active, setActive] = useState('All')

  const visible  = active === 'All' ? POSTS : POSTS.filter(function(p) { return p.tag === active })
  const featured = visible.find(function(p) { return p.featured })
  const rest     = visible.filter(function(p) { return !p.featured || active !== 'All' })

  return (
    <div className="bl">

      {/* -- HEADER -- same pattern: left text | right sticker -- */}
      <header className="bl-head">

        <div className="bl-head-left">
          <p className="bl-eyebrow">Thoughts &amp; Writing</p>
          <h1 className="bl-title">Blog &amp; Notes</h1>
          <p className="bl-sub">Photography, design research, education, and everything in between.</p>
        </div>

        {/* Writing illustration sticker */}
        <div className="bl-sticker">
          <div className="bl-sticker-bubble">Writing...</div>
          <img
            src="/illustrations/illus-blog.png"
            alt="Deepak John Mathew writing"
            className="bl-sticker-img"
            draggable="false"
          />
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
          href="http://djmphotography.blogspot.com"
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
          <a href={featured.href} target="_blank" rel="noreferrer" className="bl-featured">
            <div className="bl-featured-img">
              <img
                src={featured.img}
                alt={featured.title}
                loading="eager"
                onError={function(e) { e.currentTarget.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=600&fit=crop&q=85' }}
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
          </a>
        )}

        {/* -- POST GRID -- */}
        <div className="bl-grid">
          {(active === 'All' ? rest : visible).map(function(p, i) {
            return (
              <a
                key={i}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="bl-card"
                style={{ animationDelay: (i * 0.06) + 's' }}
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
              </a>
            )
          })}
        </div>

        {/* -- ARCHIVE BANNER -- */}
        <a
          href="http://djmphotography.blogspot.com"
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
        </a>

      </div>
    </div>
  )
}