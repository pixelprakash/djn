import { Link } from 'react-router-dom'
import { useRef } from 'react'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'
import Portrait from '../components/Portrait'
import { SOCIALS } from '../data/socials'
import usePageTitle from '../hooks/usePageTitle'
import { aboutMeMeta } from '../seo/routes'
import useStackedLayers from '../hooks/useStackedLayers'
import { preloadForPath } from '../routePreload'
import './AboutMe.css'

/* The full biography (/about/me), linked from the About band on the home page.
   The text is the professor's own, from the "About" page of his earlier site
   (deepakjohnmathew.net/index.php/author/); the short side headings are ours,
   to help a reader find the part they came for. */
const BIO = [
  {
    id: 'am-now',
    heading: 'At IIT Hyderabad',
    text: 'Professor Deepak John Mathew is a distinguished academic and practitioner in design, currently a Professor (HAG) at the Department of Design at the Indian Institute of Technology (IIT) Hyderabad. His diverse interests include digital heritage preservation, augmented and virtual reality (AR/VR), photography and imaging, design education, and design innovation. He played a pivotal role in establishing the design department at IIT Hyderabad and significantly contributed to developing the design education curriculum. Additionally, he serves as the Principal Design Investigator at the Design Innovation Centre at IIT Hyderabad, funded by the Ministry of Education. Here, he focuses on merging design and technology to address real-world challenges through innovative solutions.',
  },
  {
    id: 'am-background',
    heading: 'Background & practice',
    text: 'Dr. Mathew holds a Ph.D. in Design Education and a Master’s in Fine Arts (Graphic Arts) from the M.S. University, Vadodara. His expertise encompasses photography, design innovation, AR/VR, and digital heritage preservation. With a rich teaching background in subjects like Analytical Drawing, Composition, Photography, Art History, Color and Form, Illustration, Printmaking, and Painting, he has influenced many students. Beyond academia, Dr. Mathew has curated numerous exhibitions and exhibited his work internationally. He is the author of “Principles of Design through Photography” and a regular contributor to magazines such as Indian Architecture and Builder and Better Photography.',
  },
  {
    id: 'am-drones',
    heading: 'Drone research',
    text: 'Dr. Mathew is also deeply engaged in research on autonomous drones, focusing on their design and application. His work includes developing autonomous passenger drones, using advanced technologies like VR and AR to enhance their functionality and usability. His research at IIT Hyderabad explores innovative drone applications in digital heritage preservation and design education. He aims to leverage drone technology to address real-world challenges, fostering creative entrepreneurial cooperation and collaboration between designers and engineers.',
  },
]

const NEXT = [
  ['/resume', 'Full résumé'],
  ['/work', 'Selected work'],
  ['/contact', 'Get in touch'],
]

export default function AboutMe() {
  usePageTitle(aboutMeMeta())
  const pageRef = useRef(null)
  useStackedLayers(pageRef)

  return (
    <div className="am" ref={pageRef}>
      <PageHero
        title="About Me"
        sub="Prof. Deepak John Mathew, Department of Design, IIT Hyderabad."
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
      />

      <div className="am-body">
        {BIO.map(part => (
          <Reveal as="section" className="am-part" key={part.id} aria-labelledby={part.id}>
            <h2 className="am-h" id={part.id}>{part.heading}</h2>
            <p className="am-text">{part.text}</p>
          </Reveal>
        ))}

        <div className="am-more">
          <nav className="am-next" aria-label="Continue reading">
            {NEXT.map(([to, label]) => (
              <Link key={to} to={to} className="am-next-link" onMouseEnter={() => preloadForPath(to)} onFocus={() => preloadForPath(to)}>
                {label} <span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </nav>
          <nav className="am-profiles" aria-label="Profiles">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label} <span aria-hidden="true">&#8599;</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
