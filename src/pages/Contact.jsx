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

      {/* -- HEADER -- same pattern: left text | right sticker -- */}
      <header className="contact-header">

        <div className="contact-header-left">
          <p className="contact-eyebrow">Get in touch</p>
          <h1 className="contact-heading">Let's Talk</h1>
          <p className="contact-sub">Open to research collaborations, speaking invitations, and design conversations.</p>
        </div>

        {/* Phone illustration sticker */}
        <div className="contact-sticker">
          <div className="contact-sticker-bubble">Let's talk!</div>
          <img
            src="/illustrations/illus-contact.png"
            alt="Deepak John Mathew on phone"
            className="contact-sticker-img"
            draggable="false"
          />
        </div>

      </header>

      {/* -- BODY: form + info -- */}
      <div className="contact-body">

        {/* -- FORM -- */}
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="success-icon">&#10003;</div>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. I will get back to you soon.</p>
              <button className="cta-primary" onClick={function() { setStatus('idle') }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="contact-form" noValidate>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name <span>*</span></label>
                  <input type="text" name="firstName" value={form.firstName} onChange={change} required className="form-input" placeholder="Deepak" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name <span>*</span></label>
                  <input type="text" name="lastName" value={form.lastName} onChange={change} required className="form-input" placeholder="Mathew" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <input type="email" name="email" value={form.email} onChange={change} required className="form-input" placeholder="you@example.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Subject <span>*</span></label>
                <input type="text" name="subject" value={form.subject} onChange={change} required className="form-input" placeholder="Research collaboration / Speaking invite / ..." />
              </div>

              <div className="form-group">
                <label className="form-label">Message <span>*</span></label>
                <textarea name="message" value={form.message} onChange={change} required className="form-input form-textarea" placeholder="Tell me about your project, idea, or question..." rows={6} />
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