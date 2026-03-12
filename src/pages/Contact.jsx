import { useState } from 'react'
import './Contact.css'

const links = [
  { label: "LinkedIn",       value: "deepak-john-mathew",   href: "https://www.linkedin.com/in/deepak-john-mathew" },
  { label: "Instagram",      value: "@deepakjohnmathew",    href: "https://www.instagram.com/deepakjohnmathew/" },
  { label: "Google Scholar", value: "View Publications",    href: "https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ" },
  { label: "ResearchGate",   value: "Deepak Mathew",        href: "https://www.researchgate.net/profile/Deepak-Mathew-3" },
  { label: "Website",        value: "deepakjohnmathew.net", href: "https://deepakjohnmathew.net" },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: ""
  })
  const [status, setStatus] = useState("idle")

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })
      if (res.ok) {
        setStatus("success")
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <header className="contact-header">
          <p className="contact-eyebrow">Get in touch</p>
          <h1 className="contact-heading">{"Let's"}<br /><em>Talk</em></h1>
          <p className="contact-sub">Open to research collaborations, speaking invitations, and design conversations.</p>
        </header>

        <div className="contact-layout">
          <div className="contact-form-wrap">
            {status === "success" ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h3>Message sent!</h3>
                <p>Thank you for reaching out. I will get back to you soon.</p>
                <button className="cta-primary" onClick={() => setStatus("idle")}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name <span>*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" placeholder="Deepak" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name <span>*</span></label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-input" placeholder="Mathew" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject <span>*</span></label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="form-input" placeholder="Research collaboration / Speaking invite / ..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Message <span>*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required className="form-input form-textarea" placeholder="Tell me about your project, idea, or question..." rows={5} />
                </div>
                {status === "error" && (
                  <p className="form-error">Something went wrong. Please try again.</p>
                )}
                <button type="submit" className="cta-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info">
            <div className="contact-list">
              {links.map((l, i) => (
                <div key={i} className="contact-row">
                  <span className="contact-label">{l.label}</span>
                  <a href={l.href} target="_blank" rel="noreferrer" className="contact-value">{l.value} ↗</a>
                </div>
              ))}
            </div>
            <div className="contact-location">
              <p className="contact-eyebrow">Based at</p>
              <p className="contact-place">
                Indian Institute of Technology Hyderabad
                <span>Kandi, Sangareddy<br />Telangana 502284</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}