import { useState } from 'react'
import './Contact.css'

const links = [
  { label: 'LinkedIn',       value: 'deepak-john-mathew',    href: 'https://www.linkedin.com/in/deepak-john-mathew' },
  { label: 'Instagram',      value: '@deepakjohnmathew',     href: 'https://www.instagram.com/deepakjohnmathew/' },
  { label: 'Google Scholar', value: 'View Publications',     href: 'https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ' },
  { label: 'ResearchGate',   value: 'Deepak Mathew',         href: 'https://www.researchgate.net/profile/Deepak-Mathew-3' },
  { label: 'Website',        value: 'deepakjohnmathew.net',  href: 'https://deepakjohnmathew.net' },
]

export default function Contact() {
  const [form, setForm]     = useState({ firstName:'', lastName:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle')

  const change = function(e) { setForm(function(prev) { return { ...prev, [e.target.name]: e.target.value } }) }

  const submit = async function(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    form.firstName + ' ' + form.lastName,
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
    } catch(err) {
      setStatus('error')
    }
  }

  return (
    <div className="contact-page">

      {/* -- HEADER -- */}
      <header className="contact-header">
        <div className="contact-header-left">
          <h1 className="contact-heading">Get in Touch</h1>
          <p className="contact-sub">For research collaborations, speaking engagements, and academic partnerships.</p>
        </div>
      </header>

      {/* -- BODY: form + info -- */}
      <div className="contact-body">

        {/* -- FORM -- */}
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="success-icon">&#10003;</div>
              <h3>Message sent</h3>
              <p>Thank you for writing — I'll respond as soon as I'm able.</p>
              <button className="cta-primary" onClick={function() { setStatus('idle') }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="contact-form" noValidate>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name <span aria-hidden="true">*</span></label>
                  <input id="firstName" type="text" name="firstName" value={form.firstName} onChange={change} required className="form-input" placeholder="Deepak" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name <span aria-hidden="true">*</span></label>
                  <input id="lastName" type="text" name="lastName" value={form.lastName} onChange={change} required className="form-input" placeholder="Mathew" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
                <input id="email" type="email" name="email" value={form.email} onChange={change} required className="form-input" placeholder="you@example.com" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
                <input id="subject" type="text" name="subject" value={form.subject} onChange={change} required className="form-input" placeholder="Research collaboration, keynote invitation, academic enquiry…" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message <span aria-hidden="true">*</span></label>
                <textarea id="message" name="message" value={form.message} onChange={change} required className="form-input form-textarea" placeholder="Share a little about your enquiry, and I'll follow up as soon as I can." rows={6} />
              </div>

              {status === 'error' && (
                <p className="form-error">Something went wrong. Please try again.</p>
              )}

              <button type="submit" className="cta-primary" disabled={status === 'sending'}>
                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              </button>

            </form>
          )}
        </div>

        {/* -- INFO PANEL -- */}
        <div className="contact-info">
          <div className="contact-list">
            {links.map(function(l, i) {
              return (
                <div key={i} className="contact-row">
                  <span className="contact-label">{l.label}</span>
                  <a href={l.href} target="_blank" rel="noreferrer" className="contact-value">{l.value}</a>
                </div>
              )
            })}
          </div>
          <div className="contact-location">
            <p className="contact-location-label">Based at</p>
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