import { useState, useCallback, useRef, useEffect } from 'react'
import './Lab.css'

/* ── Data ── */
const DOMAINS = [
  {
    id: '01',
    title: 'Digital Preservation of Indian Heritage',
    type: 'Heritage',
    desc: 'Study on digital preservation and virtual recreation of UNESCO and tentative heritage sites through photogrammetry, interactive mediums, and haptic VR experience — including Ramappa Temple, Thousand Pillar Temple, and Warangal Fort.',
    tags: ['Photogrammetry', 'VR', 'UNESCO', 'ASI'],
  },
  {
    id: '02',
    title: 'Gond Tribal Heritage of Telangana',
    type: 'Heritage',
    desc: 'Comprehensive documentation of tangible and intangible cultural heritage of the Gond tribe. Design intervention workshops for safeguarding Dhokra crafts of Ojha community. Virtual museum and digital repository creation.',
    tags: ['Documentation', 'Craft Revival', 'Virtual Museum'],
  },
  {
    id: '03',
    title: 'Autonomous Urban Air Mobility',
    type: 'Research',
    desc: 'Design and development of autonomous passenger drones as air taxis. Full-scale eVTOL prototype, interior design and user experience study. VR-based perception and safety validation with 103 participants.',
    tags: ['eVTOL', 'Drone Design', 'UX Study', 'DST'],
  },
  {
    id: '04',
    title: 'VR/AR in Learning Models',
    type: 'Experiment',
    desc: 'Integrating AI, AR and VR in learning models and measuring their impact. Virtual chemistry lab environments, VR-aided STEM content for schools, and interactive educational game design including Tatva Bhoomi.',
    tags: ['STEM', 'Game Design', 'VR Lab'],
  },
  {
    id: '05',
    title: 'Sustainable Product Innovation',
    type: 'Product',
    desc: 'Bio-bricks from agro-waste for sustainable housing. Solar-powered cookers for rural India. Ekant soundproof office pods. Solar vegetable dryer for small-scale vendors.',
    tags: ['Sustainability', 'Solar', 'Bio-materials'],
  },
  {
    id: '06',
    title: 'Colour in Indian Cinema',
    type: 'Research',
    desc: 'Investigating the technology, aesthetics, and praxis of colour in Indian cinema. Examines how colour grading, film stock, and digital pipelines shape narrative and cultural meaning.',
    tags: ['Cinema', 'Aesthetics', 'Praxis'],
  },
  {
    id: '07',
    title: 'Affect & Design Cognition',
    type: 'Framework',
    desc: 'The role of mood boards, arousal, and valence in conceptual design processes. Reimagining subjects through the practice of image making and haptic design of textiles.',
    tags: ['Cognition', 'Mood Boards', 'Haptics'],
  },
  {
    id: '08',
    title: 'Multiple Narratives in Cinematic VR',
    type: 'Experiment',
    desc: 'Exploring non-linear storytelling through cinematic virtual reality film making. Creating branching narratives that respond to viewer gaze and spatial position within the VR environment.',
    tags: ['VR Film', 'Narrative', 'Immersive'],
  },
]

const STATS = [
  { number: '6,212', label: 'Students enrolled' },
  { number: '921', label: 'Innovations delivered' },
  { number: '228', label: 'Workshops held' },
  { number: '9', label: 'Patents filed' },
  { number: '25', label: 'Startups supported' },
  { number: '210', label: 'Technology transfers' },
]

const VIDEOS = [
  { id: 'JVgO6pTn4jA', title: 'Design Innovation Centre at IIT Hyderabad' },
  { id: '_jiQ5xb13pE', title: 'Digital Heritage Preservation of Ramappa Temple' },
  { id: 'OxqstyCRBwU', title: 'Tangible and Intangible Cultural Heritage of Telangana' },
  { id: 'hinNkP3qjLo', title: 'Full-Scale Passenger Drone Cabin Prototype' },
  { id: 'Pb4BENo5VwI', title: 'Passenger Drone Digital Prototype' },
  { id: 'gVAsxlgAvqw', title: 'Dhokra Casting' },
  { id: '2pRFgecS3js', title: 'World of PAVs' },
  { id: 'K0GEoz2SyeE', title: 'Fourth All India DIC Meet 2024' },
]

const PATENTS = [
  { name: 'UVC Air Purifier', inventor: 'Priyabrata Rautray' },
  { name: 'Herbal Decoction Maker', inventor: 'Upasana Bhandari' },
  { name: 'Electric Truck Carrier', inventor: 'Vivekananda Chary' },
  { name: 'Gatti Maker', inventor: 'Vivekananda Chary' },
  { name: 'NCERT Models (colour coding)', inventor: 'Upasana Bhandari' },
  { name: 'Urban Air Mobility Aircraft', inventor: 'Ketan Chaturmutha' },
  { name: 'Autonomous UAM Aircraft', inventor: 'Ketan Chaturmutha' },
  { name: 'Autonomous Advanced Air Mobility', inventor: 'Ketan Chaturmutha' },
  { name: 'Autonomous UAM Intra-city', inventor: 'Ketan Chaturmutha' },
]

const COURSES = [
  'Elements of Design', 'Principles of Design', 'UI & UX', 'Creative Coding',
  'Basic Animation', 'Digital Fabrication', 'Sound Design', 'Data Visualization',
  'Product Semantics', 'Universal Design', 'Storyboarding', 'Automobile Design',
]

const PARTNERS = [
  'MeitY', 'SHRI', 'Suzuki', 'TalentSprint', 'Wacom India',
  'Govt. of Rajasthan', 'WWF', 'ASI Hyderabad', 'DST', 'DSIR',
  'Ministry of Culture', 'ICMR',
]

const SLIDER_IMAGES = Array.from({ length: 10 }, function (_, i) {
  return '/dicimgs/' + (i + 1) + '.webp'
})

/* ── Image Slider ── */
function ImageSlider() {
  return (
    <div className="lab-slider-wrap">
      <div className="lab-slider">
        {[...SLIDER_IMAGES, ...SLIDER_IMAGES].map(function (src, i) {
          return (
            <img
              key={i}
              src={src}
              alt={'DIC Lab image ' + ((i % 10) + 1)}
              className="lab-slider-img"
              loading="lazy"
              draggable="false"
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── Video Card ── */
function VideoCard({ videoId, title }) {
  var [playing, setPlaying] = useState(false)
  var [loaded, setLoaded] = useState(false)
  var play = useCallback(function () { setPlaying(true) }, [])

  if (playing) {
    return (
      <div className="lab-video">
        <iframe
          src={'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1'}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="lab-video-iframe"
        />
      </div>
    )
  }

  return (
    <div className="lab-video" role="button" tabIndex={0} onClick={play} onKeyDown={function (e) { if (e.key === 'Enter') play() }}>
      <img
        src={'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg'}
        alt={title}
        loading="lazy"
        className="lab-video-thumb"
        onLoad={function () { setLoaded(true) }}
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div className="lab-video-overlay" />
      <div className="lab-video-play">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="none">
          <polygon points="6,3 20,12 6,21" />
        </svg>
      </div>
      <span className="lab-video-title">{title}</span>
    </div>
  )
}

/* ── Main ── */
export default function Lab() {
  return (
    <div className="lab">

      {/* ── HEADER ── */}
      <header className="lab-head">
        <div className="lab-head-left">
          <p className="lab-eyebrow">Design Innovation Centre · IIT Hyderabad</p>
          <h1 className="lab-title">DIC Lab</h1>
          <p className="lab-sub">Hub & Nodal — Interdisciplinary design research & innovation.</p>
        </div>
        <img src="/diclogo.png" alt="DIC Nodal logo" className="lab-logo" draggable="false" />
        <div className="lab-sticker">
          <div className="lab-sticker-bubble">Explore XR!</div>
          <img
            src="/illustrations/illus-lab.png"
            alt="VR headset illustration"
            className="lab-sticker-img"
            draggable="false"
          />
        </div>
      </header>
      <div className="lab-body">

        {/* 1. ABOUT */}
        <section className="lab-about">
          <h2 className="lab-section-title">About the Centre</h2>
          <p className="lab-desc lab-desc--full">
            The Design Innovation Centre (DIC) Nodal at IIT Hyderabad drives innovation through design and technology. The Department of Design along with partnering institutions engages in mutually beneficial innovation activities across cultural heritage, architecture, digital humanities, autonomous mobility, and sustainable product development.
          </p>
          <p className="lab-desc lab-desc--full">
            DIC creates a holistic and inter-disciplinary nature of design to cut across research and move projects from research to development. Our hub and partnering spokes incubate meaningful projects in line with contemporary trends in the design discipline — encouraging design praxis as a convergence of multiple interests across diverse contexts and scenarios.
          </p>
        </section>

        {/* 2. IMAGE SLIDER */}
        <section className="lab-section lab-section--flush">
          <ImageSlider />
        </section>

        {/* 3. STATS */}
        <section className="lab-section">
          <div className="lab-stats">
            {STATS.map(function (s) {
              return (
                <div className="lab-stat" key={s.label}>
                  <span className="lab-stat-num">{s.number}</span>
                  <span className="lab-stat-label">{s.label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. PROJECT FILMS */}
        <section className="lab-section">
          <h2 className="lab-section-title">Project Films</h2>
          <div className="lab-video-grid">
            {VIDEOS.map(function (v) {
              return <VideoCard key={v.id} videoId={v.id} title={v.title} />
            })}
          </div>
        </section>

        {/* 5. RESEARCH DOMAINS */}
        <section className="lab-section">
          <h2 className="lab-section-title">Research Domains</h2>
          <div className="lab-list">
            {DOMAINS.map(function (e, i) {
              return (
                <div
                  key={e.id}
                  className="lab-item"
                  style={{ animationDelay: (i * 0.07) + 's' }}
                >
                  <span className="lab-num">{e.id}</span>
                  <div className="lab-content">
                    <div className="lab-item-top">
                      <h3 className="lab-item-title">{e.title}</h3>
                      <div className="lab-meta">
                        <span className="lab-type">{e.type}</span>
                      </div>
                    </div>
                    <p className="lab-desc">{e.desc}</p>
                    <div className="lab-tags">
                      {e.tags.map(function (t) {
                        return <span className="lab-tag" key={t}>{t}</span>
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 6. PATENTS */}
        <section className="lab-section">
          <h2 className="lab-section-title">Patents</h2>
          <div className="lab-patent-grid">
            {PATENTS.map(function (p, i) {
              return (
                <div className="lab-patent" key={i}>
                  <span className="lab-patent-name">{p.name}</span>
                  <span className="lab-patent-inv">{p.inventor}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* 7. COURSES */}
        <section className="lab-section">
          <h2 className="lab-section-title">DIC Courses</h2>
          <div className="lab-course-grid">
            {COURSES.map(function (c) {
              return <span className="lab-course" key={c}>{c}</span>
            })}
          </div>
        </section>

        {/* 8. COLLABORATIONS */}
        <section className="lab-section">
          <h2 className="lab-section-title">Collaborations</h2>
          <div className="lab-partner-grid">
            {PARTNERS.map(function (p) {
              return <span className="lab-partner" key={p}>{p}</span>
            })}
          </div>
        </section>

      </div>
    </div>
  )
}