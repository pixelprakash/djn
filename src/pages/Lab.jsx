import './Lab.css'

const experiments = [
  {
    id: "01",
    title: "PIN VR — Parallel Interactive Narrative",
    type: "Prototype",
    year: "2022",
    desc: "A rotating cylindrical VR display designed for ergonomic script interaction. Two viewers share a simultaneous yet divergent narrative experience.",
  },
  {
    id: "02",
    title: "Immersive Classroom Study",
    type: "Experiment",
    year: "2021",
    desc: "Pilot study measuring the impact of VR-assisted instruction on creative confidence and learning outcomes in undergraduate design students.",
  },
  {
    id: "03",
    title: "Qutb Shahi 3D Archive",
    type: "Digital Tool",
    year: "2021",
    desc: "Photogrammetry-based digital preservation of a UNESCO-listed monument complex in Hyderabad. Built for researchers and educators.",
  },
  {
    id: "04",
    title: "Design Brief Taxonomy",
    type: "Framework",
    year: "2022",
    desc: "A reframed typology of design briefs developed through interviews with professional designers. Useful for both practice and pedagogy.",
  },
  {
    id: "05",
    title: "Drone Interior Mapping",
    type: "Study",
    year: "2021",
    desc: "Form, colour, and activity mapping for fully autonomous passenger drone interiors. Examines the psychological comfort of enclosed aerial spaces.",
  },
]

export default function Lab() {
  return (
    <div className="lab-page">
      <header className="lab-header">
        <p className="lab-eyebrow">Experiments & Prototypes</p>
        <h1 className="lab-heading">Lab</h1>
        <p className="lab-sub">Ongoing explorations at the edge of design research.</p>
      </header>

      <div className="lab-list">
        {experiments.map((e) => (
          <div key={e.id} className="lab-item">
            <span className="lab-num">{e.id}</span>
            <div className="lab-content">
              <div className="lab-item-top">
                <h2 className="lab-title">{e.title}</h2>
                <div className="lab-meta">
                  <span className="lab-type">{e.type}</span>
                  <span className="lab-year">{e.year}</span>
                </div>
              </div>
              <p className="lab-desc">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}