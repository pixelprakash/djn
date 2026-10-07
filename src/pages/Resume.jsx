import Reveal from '../components/Reveal'
import { social } from '../data/socials'
import { useRef } from 'react'
import Portrait from '../components/Portrait'
import PageHero from '../components/PageHero'
import usePageTitle from '../hooks/usePageTitle'
import { resumeMeta } from '../seo/routes'
import useStackedLayers from '../hooks/useStackedLayers'
import { positions, education, awards, papers, researchAreas } from './resumeData'
import './Resume.css'

/* -- DATA -- (the lists live in resumeData.js) */

const links = [
  { label: 'Website',       href: 'https://deepakjohnmathew.net',                                          text: 'deepakjohnmathew.net' },
  { label: 'IIT Hyderabad', href: 'https://design.iith.ac.in/iitdesign_peoples/deepak-john-mathew-phd/',   text: 'IIT Profile' },
  { label: 'Google Scholar',href: social('Google Scholar').href,                                    text: 'Scholar' },
  { label: 'LinkedIn',      href: social('LinkedIn').href,                                          text: 'LinkedIn' },
]

/* -- COMPONENT -- */
export default function Resume() {
  usePageTitle(resumeMeta())
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  return (
    <div className="resume" ref={pageRef}>

      {/* -- HEADER -- */}
      <PageHero
        title={<>Deepak John<br />Mathew</>}
        sub="Professor of Design · IIT Hyderabad"
        aside={
          <Portrait
            className="ph-portrait"
            src="/profliepicnobg.webp"
            alt="Portrait of Prof. Deepak John Mathew"
            draggable="false"
            loading="eager"
            decoding="async"
          />
        }
      >
        <p className="r-nodal">
          Principal Investigator &amp; Nodal Coordinator, Design Innovation Centre<br />
          Ministry of Education, Govt. of India
        </p>
        <div className="r-links">
          {links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.text}</a>
          ))}
        </div>
      </PageHero>

      {/* -- RESEARCH AREAS -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Research Areas</h2>
        <div className="r-tags">
          {researchAreas.map(a => <span key={a} className="r-tag">{a}</span>)}
        </div>
      </Reveal>

      {/* -- ACADEMIC POSITIONS -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Academic Positions</h2>
        <div className="r-entries">
          {positions.map((p, i) => (
            <div key={i} className="r-entry">
              <span className="r-period">{p.period}</span>
              <div>
                <p className="r-entry-title">{p.role}</p>
                <p className="r-entry-sub">{p.org}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* -- EDUCATION -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Education</h2>
        <div className="r-entries">
          {education.map((e, i) => (
            <div key={i} className="r-entry">
              <span className="r-period">{e.year}</span>
              <div>
                <p className="r-entry-title">{e.degree}</p>
                <p className="r-entry-sub">{e.inst}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* -- AWARDS -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Awards &amp; Scholarships</h2>
        <div className="r-awards">
          {awards.map((a, i) => (
            <div key={i} className="r-award">
              <span className="r-award-year">{a.year}</span>
              <p className="r-award-text">{a.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* -- PUBLICATIONS -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Selected Publications</h2>
        <div className="r-papers">
          {papers.map((p, i) => (
            <div key={i} className="r-paper">
              <span className="r-paper-year">{p.year}</span>
              <div>
                <p className="r-paper-title">{p.title}</p>
                <p className="r-paper-venue">{p.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* -- PROFILES -- */}
      <Reveal as="section" className="r-section">
        <h2 className="r-section-title">Profiles &amp; Gallery</h2>
        <div className="r-entries">
          <div className="r-entry">
            <span className="r-period">Academic</span>
            <div className="r-profile-links">
              <a href="https://www.researchgate.net/profile/Deepak-Mathew-3" target="_blank" rel="noreferrer">ResearchGate <span aria-hidden="true">&#8594;</span></a>
              <a href="https://nid.academia.edu/DeepakMathew" target="_blank" rel="noreferrer">Academia.edu <span aria-hidden="true">&#8594;</span></a>
            </div>
          </div>
          <div className="r-entry">
            <span className="r-period">Gallery</span>
            <div className="r-profile-links">
              <a href="https://galleryragini.com/deepak-john-mathew/" target="_blank" rel="noreferrer">Gallery Ragini <span aria-hidden="true">&#8594;</span></a>
            </div>
          </div>
          <div className="r-entry">
            <span className="r-period">Social</span>
            <div className="r-profile-links">
              <a href={social('Instagram').href} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">&#8594;</span></a>
              <a href={social('Facebook').href} target="_blank" rel="noreferrer">Facebook <span aria-hidden="true">&#8594;</span></a>
            </div>
          </div>
        </div>
      </Reveal>

    </div>
  )
}