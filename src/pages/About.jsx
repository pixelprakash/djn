import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <div className="about-inner">

        <header className="about-header">
          <p className="about-eyebrow">Who I am</p>
          <h1 className="about-name">Deepak<br /><em>John Mathew</em></h1>
        </header>

        <div className="about-body">
          <div className="about-bio">
            <p>Professor of Design at the Indian Institute of Technology Hyderabad, working at the intersection of research, education, and practice. With over two decades of experience, my work spans digital heritage, immersive technologies, sustainable materials, and the pedagogy of design.</p>
            <p>I believe design is fundamentally a human act — one that requires curiosity, rigour, and a deep sensitivity to context. My research is driven by questions that matter to communities, to culture, and to the future.</p>
            <p>Before IIT Hyderabad, I studied and practiced across institutions in India and abroad, developing a design philosophy rooted in craft, photography, and critical inquiry.</p>
          </div>

          <div className="about-aside">
            <div className="about-fact-group">
              <p className="about-fact-label">Currently</p>
              <p className="about-fact-value">Professor, Dept. of Design<br />IIT Hyderabad</p>
            </div>
            <div className="about-fact-group">
              <p className="about-fact-label">Recognition</p>
              <p className="about-fact-value">Lifetime Achievement Award<br />Design Research Council of India, 2025</p>
            </div>
            <div className="about-fact-group">
              <p className="about-fact-label">Book</p>
              <p className="about-fact-value">Principles of Design<br />Through Photography, 2011</p>
            </div>
            <div className="about-fact-group">
              <p className="about-fact-label">Website</p>
              <a href="https://deepakjohnmathew.net" target="_blank" rel="noreferrer" className="about-link">deepakjohnmathew.net ↗</a>
            </div>
          </div>
        </div>

        <div className="about-divider" />

        <div className="about-interests">
          <p className="about-fact-label" style={{ marginBottom: '20px' }}>Areas of Interest</p>
          <div className="about-interest-list">
            {["Design Research", "VR & Immersive Media", "Heritage Preservation", "Sustainable Design", "Design Education", "Photography"].map(item => (
              <div key={item} className="about-interest-item">{item}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}