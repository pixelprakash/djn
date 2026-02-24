import './Work.css'

const projects = [
  {
    year: "2023",
    title: "Digital Heritage Preservation",
    category: "Research Project",
    desc: "Archiving the Qutb Shahi monuments through photogrammetry and immersive digital reconstruction for historical education and cultural memory.",
    tags: ["Heritage", "Digital Archiving", "3D Reconstruction"],
  },
  {
    year: "2022",
    title: "Autonomous Passenger Drone UX",
    category: "Design Research",
    desc: "Exploring interior and exterior design parameters for urban air mobility vehicles — form, color, ergonomics, and passenger psychology.",
    tags: ["UAM", "Industrial Design", "User Research"],
  },
  {
    year: "2021",
    title: "VR for Design Education",
    category: "Pedagogy & Research",
    desc: "Developing immersive virtual reality tools to scaffold creative learning in design classrooms. Pilot studies across IIT Hyderabad.",
    tags: ["VR/AR", "Education", "Interaction Design"],
  },
  {
    year: "2020",
    title: "Bio-Brick Research",
    category: "Sustainable Design",
    desc: "Designing cost-effective, sustainable building materials using biological processes. Exploring circular economy applications in construction.",
    tags: ["Sustainability", "Materials", "Circular Economy"],
  },
  {
    year: "2019",
    title: "Green Fashion Awareness Study",
    category: "Consumer Research",
    desc: "Understanding consumer attitudes toward sustainable fashion in India. Mapping awareness, ethical ideologies, and purchasing behaviour.",
    tags: ["Fashion", "Consumer Research", "Sustainability"],
  },
  {
    year: "2018",
    title: "Furniture for Pre-Primary Children",
    category: "Product Design",
    desc: "Ergonomic and developmental furniture design tailored for children aged 3–6, considering anthropometric data and play-based learning.",
    tags: ["Ergonomics", "Product Design", "Children"],
  },
]

export default function Work() {
  return (
    <div className="work-page">
      <header className="work-header">
        <p className="work-eyebrow">Selected Projects</p>
        <h1 className="work-heading">Work</h1>
        <p className="work-sub">Design research, pedagogy, and practice spanning two decades.</p>
      </header>

      <div className="work-grid">
        {projects.map((p, i) => (
          <div key={i} className="work-card">
            <div className="work-card-top">
              <span className="work-card-year">{p.year}</span>
              <span className="work-card-cat">{p.category}</span>
            </div>
            <h2 className="work-card-title">{p.title}</h2>
            <p className="work-card-desc">{p.desc}</p>
            <div className="work-card-tags">
              {p.tags.map(t => <span key={t} className="work-tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}