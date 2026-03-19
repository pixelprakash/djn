import { useState } from 'react'
import './Contact.css'

const links = [
  { label: 'LinkedIn',       value: 'deepak-john-mathew',    href: 'https://www.linkedin.com/in/deepak-john-mathew' },
  { label: 'Instagram',      value: '@deepakjohnmathew',     href: 'https://www.instagram.com/deepakjohnmathew/' },
  { label: 'Google Scholar', value: 'View Publications ↗',   href: 'https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ' },
  { label: 'ResearchGate',   value: 'Deepak Mathew ↗',       href: 'https://www.researchgate.net/profile/Deepak-Mathew-3' },
  { label: 'Website',        value: 'deepakjohnmathew.net ↗',href: 'https://deepakjohnmathew.net' },
]

export default function Contact() {
  const [form, setForm]     = useState({ firstName:'', lastName:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle')   // idle | sending | success | error

  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email,
          subject: form.subject,
          message: form.message,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ firstName:'', lastName:'', email:'', subject:'', message:'' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact-page">

      {/* ── HEADER ── */}
      <header className="contact-header">
        <div>
          <p className="contact-eyebrow">Get in touch</p>
          <h1 className="contact-heading">
            Let's <em>Talk</em>
          </h1>
        </div>
        <p className="contact-sub">
          Open to research collaborations,<br />
          speaking invitations, and design conversations.
        </p>
      </header>

      {/* ── BODY: form + info ── */}
      <div className="contact-body">

        {/* ── FORM ── */}
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="success-icon">✓</div>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
              <button className="cta-primary" onClick={() => setStatus('idle')}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="contact-form" noValidate>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name <span>*</span></label>
                  <input
                    type="text" name="firstName" value={form.firstName}
                    onChange={change} required
                    className="form-input" placeholder="Deepak"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name <span>*</span></label>
                  <input
                    type="text" name="lastName" value={form.lastName}
                    onChange={change} required
                    className="form-input" placeholder="Mathew"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <input
                  type="email" name="email" value={form.email}
                  onChange={change} required
                  className="form-input" placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject <span>*</span></label>
                <input
                  type="text" name="subject" value={form.subject}
                  onChange={change} required
                  className="form-input"
                  placeholder="Research collaboration / Speaking invite / ..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message <span>*</span></label>
                <textarea
                  name="message" value={form.message}
                  onChange={change} required
                  className="form-input form-textarea"
                  placeholder="Tell me about your project, idea, or question..."
                  rows={6}
                />
              </div>

              {status === 'error' && (
                <p className="form-error">Something went wrong. Please try again.</p>
              )}

              <button type="submit" className="cta-primary" disabled={status === 'sending'}>
                <span>{status === 'sending' ? 'Sending…' : 'Send Message →'}</span>
              </button>

            </form>
          )}
        </div>

        {/* ── INFO PANEL ── */}
        <div className="contact-info">

          {/* Links list */}
          <div className="contact-list">
            {links.map((l, i) => (
              <div key={i} className="contact-row">
                <span className="contact-label">{l.label}</span>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-value"
                >
                  {l.value}
                </a>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="contact-location">
            <p className="contact-eyebrow">Based at</p>
            <p className="contact-place">
              Indian Institute of Technology Hyderabad
              <span>Kandi, Sangareddy<br />Telangana 502284, India</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}