import './Contact.css'

const links = [
  { label: "Email", value: "Press R to reveal", href: null, note: true },
  { label: "LinkedIn", value: "deepak-john-mathew", href: "https://www.linkedin.com/in/deepak-john-mathew" },
  { label: "Instagram", value: "@deepakjohnmathew", href: "https://www.instagram.com/deepakjohnmathew/" },
  { label: "Google Scholar", value: "View Publications", href: "https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ" },
  { label: "ResearchGate", value: "Deepak Mathew", href: "https://www.researchgate.net/profile/Deepak-Mathew-3" },
  { label: "Website", value: "deepakjohnmathew.net", href: "https://deepakjohnmathew.net" },
]

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-inner">
        <header className="contact-header">
          <p className="contact-eyebrow">Get in touch</p>
          <h1 className="contact-heading">Contact</h1>
          <p className="contact-sub">Open to research collaborations, speaking invitations, and design conversations.</p>
        </header>

        <div className="contact-list">
          {links.map((l, i) => (
            <div key={i} className="contact-row">
              <span className="contact-label">{l.label}</span>
              {l.href ? (
                <a href={l.href} target="_blank" rel="noreferrer" className="contact-value link">{l.value} ↗</a>
              ) : (
                <span className="contact-value muted">{l.value}</span>
              )}
            </div>
          ))}
        </div>

        <div className="contact-location">
          <p className="contact-eyebrow" style={{ marginBottom: '8px' }}>Based at</p>
          <p className="contact-place">Indian Institute of Technology Hyderabad<br /><span>Kandi, Sangareddy, Telangana 502284</span></p>
        </div>
      </div>
    </div>
  )
}