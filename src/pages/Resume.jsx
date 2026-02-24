import './Resume.css'

const papers = [
  { year: 2023, title: "Virtual reality for creativity practice and art and design education: a literature review", venue: "ICoRD 2023", cite: 1 },
  { year: 2022, title: "A critical review of national education policy 2020: role of twenty-first-century skills and scope of design education in Indian schools", venue: "Int. Journal of Design Education", cite: 3 },
  { year: 2022, title: "Factors Influencing the Exterior Design of Autonomous Passenger Drones: Literature Review", venue: "Proceedings of the Design Society", cite: 2 },
  { year: 2022, title: "Design Briefs: Review, Reframing Briefs, and Analysis of a Study", venue: "Int. Journal of Design Education", cite: 1 },
  { year: 2022, title: "New age zero waste sustainable apparel industry: Design practices, innovative approaches, and technological intervention", venue: "Circular Economy and Sustainability", cite: 2 },
  { year: 2022, title: "Table for Two — A parallel interactive narrative in VR (PIN VR)", venue: "The Changing Face of VR", cite: 1 },
  { year: 2022, title: "Understanding Working Scenarios of Urban Air Mobility", venue: "Proceedings of the Design Society", cite: 1 },
  { year: 2021, title: "Enhancing creative learning methods by immersive virtual reality: A pilot study in classroom environment", venue: "ICoRD 2021", cite: 4 },
  { year: 2021, title: "Bio-bricks: Circular economy and new products", venue: "ICoRD 2021", cite: 6 },
  { year: 2021, title: "Digital preservation of the Qutb Shahi monuments: Archiving architecture for historical education", venue: "ICoRD 2021", cite: 1 },
  { year: 2020, title: "Users' Survey for Development of Passenger Drones", venue: "Proceedings of the Design Society: DESIGN Conference", cite: 12 },
  { year: 2019, title: "Bio-Brick — Development of sustainable and cost effective building material", venue: "ICED 2019", cite: 16 },
  { year: 2019, title: "A study on consumer awareness towards green fashion in India", venue: "ICoRD 2019", cite: 12 },
  { year: 2017, title: "Evolution of design briefs: Expressions from professional design practice", venue: "ICoRD 2017", cite: 4 },
]

const talks = [
  { name: "UX India 2017", url: "https://youtu.be/bl7LfV_cfTg?si=p5BmLM3DC1_mKZEc" },
  { name: "UX India 2018", url: "https://youtu.be/eMVpSbObgYM?si=MSyLfFUPFgu7n2tI" },
  { name: "Silver Jubilee — CPDM", url: "https://youtu.be/jW6mTsrgjXw?si=E6b6IfJWXuiCezkY" },
  { name: "ADI Futurescapes", url: "https://youtu.be/tJzj7cLSWNA?si=J8LCsRYCumvJ_IUP" },
]

const awards = [
  { year: 2025, text: "Lifetime Achievement Award for Design Research — Design Research Council of India" },
  { year: null, text: "Jury Member — India's Best Design Awards" },
  { year: 2006, text: "Photography Award — India Habitat Centre" },
  { year: 1999, text: "Photography Award — Alliance Française" },
  { year: 1996, text: "Photography Award — Inlaks Fine Arts & National Scholarship" },
]

const researchAreas = [
  "Digital Heritage Preservation",
  "VR/AR for Design Education",
  "Autonomous Passenger Drones",
  "Bio-bricks & Sustainable Materials",
  "Photography & Design",
]

export default function Resume() {
  return (
    <div className="resume">

      {/* Header */}
      <header className="resume-header">
        <div>
          <h1 className="resume-name">
            <span>Deepak</span> John Mathew
          </h1>
          <p className="resume-title">Professor · Design · IIT Hyderabad</p>
        </div>
        <div className="resume-links">
          <a href="https://deepakjohnmathew.net" target="_blank" rel="noreferrer">deepakjohnmathew.net ↗</a>
          <a href="https://design.iith.ac.in/iitdesign_peoples/deepak-john-mathew-phd/" target="_blank" rel="noreferrer">IIT Hyderabad Profile ↗</a>
          <a href="https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ" target="_blank" rel="noreferrer">Google Scholar ↗</a>
          <a href="https://www.linkedin.com/in/deepak-john-mathew" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </header>

      {/* Research Areas */}
      <section className="section">
        <h2 className="section-label">Research Areas</h2>
        <div className="tags">
          {researchAreas.map(area => (
            <span key={area} className="tag">{area}</span>
          ))}
        </div>
      </section>

      {/* Education & Position */}
      <section className="section">
        <h2 className="section-label">Position</h2>
        <div className="entry">
          <span className="entry-year">Current</span>
          <div className="entry-body">
            <p className="entry-title">Professor, Department of Design</p>
            <p className="entry-meta">Indian Institute of Technology Hyderabad</p>
          </div>
        </div>
        <div className="entry">
          <span className="entry-year">2011</span>
          <div className="entry-body">
            <p className="entry-title">Principles of Design Through Photography</p>
            <p className="entry-meta">Book Publication</p>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section">
        <h2 className="section-label">Awards & Recognition</h2>
        <ul className="award-list">
          {awards.map((a, i) => (
            <li key={i}>
              <span>{a.text}</span>
              <span className="award-year">{a.year ?? '—'}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Talks */}
      <section className="section">
        <h2 className="section-label">Talks</h2>
        <div className="talk-grid">
          {talks.map(t => (
            <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="talk-link">
              <span className="talk-name">{t.name}</span>
              <span className="talk-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="section">
        <h2 className="section-label">Selected Publications</h2>
        {papers.map((p, i) => (
          <div key={i} className="paper">
            <p className="paper-title">{p.title}</p>
            <div className="paper-meta">
              <span>{p.venue}</span>
              <span>{p.year}</span>
              {p.cite > 0 && <span className="paper-cite">{p.cite} citation{p.cite > 1 ? 's' : ''}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Profiles */}
      <section className="section">
        <h2 className="section-label">Profiles & Gallery</h2>
        <div className="entry">
          <span className="entry-year">Academic</span>
          <div className="entry-body" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <a href="https://www.researchgate.net/profile/Deepak-Mathew-3" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>ResearchGate ↗</a>
            <a href="https://nid.academia.edu/DeepakMathew" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>Academia.edu ↗</a>
          </div>
        </div>
        <div className="entry">
          <span className="entry-year">Gallery</span>
          <div className="entry-body">
            <a href="https://galleryragini.com/deepak-john-mathew/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>Gallery Ragini ↗</a>
          </div>
        </div>
        <div className="entry">
          <span className="entry-year">Social</span>
          <div className="entry-body" style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.instagram.com/deepakjohnmathew/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>Instagram ↗</a>
            <a href="https://www.facebook.com/deepakjohnmathew/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>Facebook ↗</a>
          </div>
        </div>
      </section>

    </div>
  )
}