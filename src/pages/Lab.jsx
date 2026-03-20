import './Lab.css'

const EXPERIMENTS = [
  {
    id: '01',
    title: 'PIN VR -- Parallel Interactive Narrative',
    type: 'Prototype',
    year: '2022',
    desc: 'A rotating cylindrical VR display designed for ergonomic script interaction. Two viewers share a simultaneous yet divergent narrative experience inside the same virtual space.',
  },
  {
    id: '02',
    title: 'Immersive Classroom Study',
    type: 'Experiment',
    year: '2021',
    desc: 'Pilot study measuring the impact of VR-assisted instruction on creative confidence and learning outcomes in undergraduate design students at IIT Hyderabad.',
  },
  {
    id: '03',
    title: 'Qutb Shahi 3D Archive',
    type: 'Digital Tool',
    year: '2021',
    desc: 'Photogrammetry-based digital preservation of a UNESCO-listed monument complex in Hyderabad. Built for researchers, educators, and heritage professionals.',
  },
  {
    id: '04',
    title: 'Design Brief Taxonomy',
    type: 'Framework',
    year: '2022',
    desc: 'A reframed typology of design briefs developed through structured interviews with professional designers. Useful for both studio practice and design pedagogy.',
  },
  {
    id: '05',
    title: 'Drone Interior Mapping',
    type: 'Study',
    year: '2021',
    desc: 'Form, colour, and activity mapping for fully autonomous passenger drone interiors. Examines the psychological comfort and spatial experience of enclosed aerial spaces.',
  },
  {
    id: '06',
    title: 'Bio-Brick Material Research',
    type: 'Research',
    year: '2021',
    desc: 'Exploration of bio-bricks as a circular-economy building material. Investigates sustainable production methods and structural viability for low-cost architecture.',
  },
]

export default function Lab() {
  return (
    <div className="lab">

      {/* -- HEADER -- same 3-col pattern: eyebrow+title+sub | sticker -- */}
      <header className="lab-head">

        {/* Left: eyebrow + title + subtitle */}
        <div className="lab-head-left">
          <p className="lab-eyebrow">Experiments &amp; Prototypes</p>
          <h1 className="lab-title">DIC Lab</h1>
          <p className="lab-sub">Ongoing explorations at the edge of design research.</p>
        </div>

        {/* Right: VR headset illustration */}
        <div className="lab-sticker">
          <div className="lab-sticker-bubble">Explore XR!</div>
          <img
            src="/illustrations/illus-lab.png"
            alt="Deepak John Mathew in VR"
            className="lab-sticker-img"
            draggable="false"
          />
        </div>

      </header>

      <div className="lab-body">
        <div className="lab-list">
          {EXPERIMENTS.map(function(e, i) {
            return (
              <div
                key={e.id}
                className="lab-item"
                style={{ animationDelay: (i * 0.07) + 's' }}
              >
                <span className="lab-num">{e.id}</span>
                <div className="lab-content">
                  <div className="lab-item-top">
                    <h2 className="lab-item-title">{e.title}</h2>
                    <div className="lab-meta">
                      <span className="lab-type">{e.type}</span>
                      <span className="lab-year">{e.year}</span>
                    </div>
                  </div>
                  <p className="lab-desc">{e.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}