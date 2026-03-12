import "./Resume.css";

// ── Data ──────────────────────────────────────────────
const positions = [
  { period: "2023 – present", role: "Professor HAG, Department of Design", org: "IIT Hyderabad" },
  { period: "2017 – present", role: "Professor, Department of Design", org: "IIT Hyderabad" },
  { period: "2023 – present", role: "Adjunct Professor", org: "IIT Jodhpur" },
  { period: "2023 – present", role: "Adjunct Professor", org: "IIT Roorkee" },
  { period: "2022 – present", role: "Adjunct Professor, Dept. of Mech. & Product Design Engineering", org: "Swinburne University, Melbourne" },
  { period: "2014 – Oct 2022", role: "Head of Department, Department of Design", org: "IIT Hyderabad" },
  { period: "2014 – 2017", role: "Associate Professor, Department of Design", org: "IIT Hyderabad" },
  { period: "2007 – 2013", role: "Associate Senior Faculty", org: "National Institute of Design, Ahmedabad" },
  { period: "2004 – 2007", role: "Faculty", org: "National Institute of Design, Ahmedabad" },
  { period: "2002 – 2013", role: "Head of Photography Department", org: "NID Ahmedabad" },
];

const education = [
  { year: "2005", degree: "Ph.D. in Design Education", inst: "Study of instructional strategy on color and form for Design Education" },
  { year: "2012", degree: "Supervisors Training for Practice-Based Ph.D.", inst: "University for the Creative Arts, Farnham, UK" },
  { year: "1996", degree: "M.A. Fine Arts (Graphic Arts)", inst: "M.S. University, Baroda" },
  { year: "1994", degree: "B.F.A. (Painting)", inst: "Fine Arts College, Trivandrum" },
  { year: "1990", degree: "B.Sc. (Physics)", inst: "Mahatma Gandhi University, Kerala" },
];

const awards = [
  { year: "2025", text: "Lifetime Achievement Award for Design Research — Design Research Council of India" },
  { year: "2012", text: "Partnership Development Seed Grant — Shastri Foundation, with OCAD University Canada" },
  { year: "2011", text: "UKIERI India UK Study Mission Grant (16,000 GBP) — British Council" },
  { year: "2011", text: "Commonwealth Fellowship for practice-based Ph.D. in Photography" },
  { year: "2008", text: "50,000 GBP Grant from UKIERI — Photography Design twin program, NID & UCA" },
  { year: "2006", text: "Photography Award — India Habitat Centre" },
  { year: "1999", text: "Young Artist of the Year — Alliance Française, New Delhi" },
  { year: "1997", text: "Kanoria Scholarship — Kanoria Art Centre, Ahmedabad" },
  { year: "1996", text: "Inlaks Fine Arts Award" },
  { year: "1994", text: "National Scholarship for Young Artists — Ministry of Human Resources, Govt. of India" },
];

const papers = [
  { year: 2024, title: "3D Game Asset Generation of Historical Architecture Through Photogrammetry", venue: "Encyclopedia of Computer Graphics and Games" },
  { year: 2024, title: "Navigating parallel interactive narratives in virtual reality", venue: "Media Practice & Education, Q1, H-Index 20" },
  { year: 2023, title: "Virtual reality for creativity practice and art and design education: a literature review", venue: "ICoRD 2023", cite: 1 },
  { year: 2023, title: "Games as Inherent Learning Environments: A Thematic Analysis in India", venue: "ICoRD 2023" },
  { year: 2022, title: "A critical review of national education policy 2020: role of twenty-first-century skills and scope of design education in Indian schools", venue: "Int. Journal of Design Education", cite: 3 },
  { year: 2022, title: "Factors Influencing the Exterior Design of Autonomous Passenger Drones: Literature Review", venue: "Proceedings of the Design Society", cite: 2 },
  { year: 2022, title: "Design Briefs: Review, Reframing Briefs, and Analysis of a Study", venue: "Int. Journal of Design Education", cite: 1 },
  { year: 2022, title: "Table for Two — A parallel interactive narrative in VR (PIN VR)", venue: "The Changing Face of VR", cite: 1 },
  { year: 2021, title: "Enhancing creative learning methods by immersive virtual reality: A pilot study in classroom environment", venue: "ICoRD 2021", cite: 4 },
  { year: 2021, title: "Bio-bricks: Circular economy and new products", venue: "ICoRD 2021", cite: 6 },
  { year: 2021, title: "Digital preservation of the Qutb Shahi monuments: Archiving architecture for historical education", venue: "ICoRD 2021", cite: 1 },
  { year: 2020, title: "Users Survey for Development of Passenger Drones", venue: "Proceedings of the Design Society: DESIGN Conference", cite: 12 },
  { year: 2019, title: "Bio-Brick — Development of sustainable and cost effective building material", venue: "ICED 2019", cite: 16 },
  { year: 2019, title: "A study on consumer awareness towards green fashion in India", venue: "ICoRD 2019", cite: 12 },
  { year: 2017, title: "Evolution of design briefs: Expressions from professional design practice", venue: "ICoRD 2017", cite: 4 },
];

const researchAreas = [
  "Digital Heritage Preservation", "VR/AR for Design Education",
  "Autonomous Passenger Drones", "Bio-bricks & Sustainable Materials",
  "Photography & Design", "Design Innovation", "Game-Based Learning",
];

const links = [
  { label: "Website",        href: "https://deepakjohnmathew.net",                                         text: "deepakjohnmathew.net" },
  { label: "IIT Hyderabad",  href: "https://design.iith.ac.in/iitdesign_peoples/deepak-john-mathew-phd/",  text: "Profile ↗" },
  { label: "Google Scholar", href: "https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ",         text: "Publications ↗" },
  { label: "LinkedIn",       href: "https://www.linkedin.com/in/deepak-john-mathew",                       text: "LinkedIn ↗" },
];

// ── Component ─────────────────────────────────────────
export default function Resume() {
  return (
    <div className="resume">

      {/* Header */}
      <header className="r-header">
        <img
          src="/djm-profile.jpg"
          alt="Deepak John Mathew"
          className="r-photo"
        />
        <div className="r-header-text">
          <p className="r-eyebrow">Curriculum Vitae</p>
          <h1 className="r-name">Deepak John <em>Mathew</em></h1>
          <p className="r-role">Professor of Design · IIT Hyderabad</p>
          <p className="r-nodal">Principal Investigator & Nodal Coordinator, Design Innovation Centre<br />Ministry of Education, Govt. of India</p>
          <div className="r-links">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                {l.text}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Research Areas */}
      <section className="r-section">
        <h2 className="r-section-title">Research Areas</h2>
        <div className="r-tags">
          {researchAreas.map((a) => <span key={a} className="r-tag">{a}</span>)}
        </div>
      </section>

      {/* Positions */}
      <section className="r-section">
        <h2 className="r-section-title">Academic Positions</h2>
        {positions.map((p, i) => (
          <div key={i} className="r-entry">
            <span className="r-period">{p.period}</span>
            <div>
              <p className="r-entry-title">{p.role}</p>
              <p className="r-entry-sub">{p.org}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="r-section">
        <h2 className="r-section-title">Education</h2>
        {education.map((e, i) => (
          <div key={i} className="r-entry">
            <span className="r-period">{e.year}</span>
            <div>
              <p className="r-entry-title">{e.degree}</p>
              <p className="r-entry-sub">{e.inst}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Awards */}
      <section className="r-section">
        <h2 className="r-section-title">Awards & Scholarships</h2>
        {awards.map((a, i) => (
          <div key={i} className="r-award">
            <span className="r-award-year">{a.year}</span>
            <p className="r-award-text">{a.text}</p>
          </div>
        ))}
      </section>

      {/* Publications */}
      <section className="r-section">
        <h2 className="r-section-title">Selected Publications</h2>
        {papers.map((p, i) => (
          <div key={i} className="r-paper">
            <p className="r-paper-title">{p.title}</p>
            <div className="r-paper-meta">
              <span>{p.venue}</span>
              <span>{p.year}</span>
              {p.cite && <span className="r-cite">{p.cite} citation{p.cite > 1 ? "s" : ""}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Profiles */}
      <section className="r-section">
        <h2 className="r-section-title">Profiles & Gallery</h2>
        <div className="r-entry">
          <span className="r-period">Academic</span>
          <div className="r-profile-links">
            <a href="https://www.researchgate.net/profile/Deepak-Mathew-3" target="_blank" rel="noreferrer">ResearchGate ↗</a>
            <a href="https://nid.academia.edu/DeepakMathew" target="_blank" rel="noreferrer">Academia.edu ↗</a>
          </div>
        </div>
        <div className="r-entry">
          <span className="r-period">Gallery</span>
          <div className="r-profile-links">
            <a href="https://galleryragini.com/deepak-john-mathew/" target="_blank" rel="noreferrer">Gallery Ragini ↗</a>
          </div>
        </div>
        <div className="r-entry">
          <span className="r-period">Social</span>
          <div className="r-profile-links">
            <a href="https://www.instagram.com/deepakjohnmathew/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.facebook.com/deepakjohnmathew/" target="_blank" rel="noreferrer">Facebook ↗</a>
          </div>
        </div>
      </section>

    </div>
  );
}