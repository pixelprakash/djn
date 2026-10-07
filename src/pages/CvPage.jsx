import { useParams, Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import usePageTitle from '../hooks/usePageTitle'
import { cvMeta, notFoundMeta } from '../seo/routes'
import { PAGES } from './cvData'
import './CvPage.css'

/* The content lives in cvData.js. */
/* Most entries read "2012 — …" / "2010–2014 — …" / "1992 onwards — …".
   Peel that prefix off so the year can sit in its own column. Entries
   without a clean leading-year prefix — and whole sections that have none
   (e.g. Thesis Guidance, or Conferences where the year is the heading) —
   fall back to a plain full-width list. */
/* An item is normally a plain string, but a handful of papers (ones that
   actually had a DOI in the source spreadsheet) are instead
   { text, href } so the entry can link straight to the published paper.
   Keeping the plain-string form as the default for everything else means
   most of this file never has to think about links at all. */
function splitYear(item) {
  const href = typeof item === 'object' ? item.href : null
  const text = typeof item === 'object' ? item.text : item
  const i = text.indexOf(' — ')
  if (i > 0 && i <= 24 && /^\d{4}/.test(text)) {
    return { year: text.slice(0, i), text: text.slice(i + 3), href }
  }
  return { year: null, text, href }
}

/* Anchor id for a section's heading, for the jump-nav below -- unique
   per page load (si guards the rare case of two sections sharing a
   heading, e.g. none today but cheap insurance). */
function sectionId(heading, si) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + si
}

export default function CvPage() {
  const { slug } = useParams()
  const page = PAGES[slug]
  usePageTitle(page ? cvMeta(slug) : notFoundMeta())

  if (!page) {
    return (
      <div className="cvp">
        <div className="cvp-inner">
          <p className="cvp-missing">
            That page doesn’t exist. <Link to="/resume">Back to résumé →</Link>
          </p>
        </div>
      </div>
    )
  }

  const showJump = page.sections.length > 1

  return (
    <div className="cvp">
      <div className="cvp-inner">

        {page.parent && (
          <Link to={page.parent.path} className="cvp-back">
            <span aria-hidden="true">←</span> {page.parent.label}
          </Link>
        )}

        <h1 className="cvp-title">{page.title}</h1>

        <div className="cvp-rule" aria-hidden="true" />

        {showJump && (
          <nav className="cvp-jump" aria-label="Jump to section">
            {page.sections.map((sec, si) => (
              <a key={si} href={`#${sectionId(sec.heading, si)}`} className="cvp-jump-link">
                {sec.heading}
              </a>
            ))}
          </nav>
        )}

        {page.sections.map((sec, si) => {
          const rows = sec.items.map(splitYear)
          const hasYears = rows.some(r => r.year)
          return (
            <Reveal as="section" key={si} id={sectionId(sec.heading, si)} className="cvp-section">
              <h2 className="cvp-sec-head">{sec.heading}</h2>
              <ul className={`cvp-list${hasYears ? '' : ' cvp-list--plain'}`}>
                {rows.map(({ year, text, href }, j) => (
                  <li key={j} className="cvp-item">
                    {hasYears && <span className="cvp-year">{year}</span>}
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="cvp-text cvp-text--link">
                        {text}
                      </a>
                    ) : (
                      <span className="cvp-text">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}

      </div>
    </div>
  )
}