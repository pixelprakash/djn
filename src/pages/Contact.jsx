import { useRef, useState } from 'react'
import PageHero from '../components/PageHero'
import usePageTitle from '../hooks/usePageTitle'
import { contactMeta } from '../seo/routes'
import useStackedLayers from '../hooks/useStackedLayers'
import './Contact.css'

// ── One thing to fill in ─────────────────────────────────────────────
// The form posts to Formspree. Create a (free) form at formspree.io, then
// replace YOUR_FORM_ID with its id (the part after /f/). Until then every
// submission fails and the visitor sees the error message below.
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

const links = [
  { label: 'LinkedIn',       value: 'deepak-john-mathew',    href: 'https://www.linkedin.com/in/deepak-john-mathew-b079ab1a/' },
  { label: 'Instagram',      value: '@deepakjohnmathew',     href: 'https://www.instagram.com/deepakjohnmathew/' },
  { label: 'Google Scholar', value: 'View publications',     href: 'https://scholar.google.com/citations?hl=en&user=UBODlvYAAAAJ' },
  { label: 'ResearchGate',   value: 'Deepak Mathew',         href: 'https://www.researchgate.net/profile/Deepak-Mathew-3' },
  { label: 'Website',        value: 'deepakjohnmathew.net',  href: 'https://deepakjohnmathew.net' },
]

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Indian+Institute+of+Technology+Hyderabad+Kandi+Sangareddy'

const FIELD_ORDER = ['firstName', 'lastName', 'email', 'subject', 'message']
const EMPTY = { firstName: '', lastName: '', email: '', subject: '', message: '' }

function FieldError({ id, message }) {
  return message ? <p className="form-field-error" id={`${id}-error`}>{message}</p> : null
}

export default function Contact() {
  usePageTitle(contactMeta())
  const pageRef = useRef(null)
  useStackedLayers(pageRef)
  const [form, setForm]     = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})       // field name -> message

  const change = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // clear that field's message as soon as it is being corrected
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  // WCAG 3.3.1 / 3.3.3: say which fields are wrong and how to fix them, tie
  // each message to its field, and put focus on the first problem.
  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Please enter your first name.'
    if (!form.lastName.trim())  e.lastName  = 'Please enter your last name.'
    if (!form.email.trim())     e.email     = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address, like name@example.com.'
    if (!form.subject.trim())   e.subject   = 'Please enter a subject.'
    if (!form.message.trim())   e.message   = 'Please write a message.'
    return e
  }

  const submit = async e => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    const first = FIELD_ORDER.find(f => found[f])
    if (first) {
      setStatus('idle')
      document.getElementById(first)?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
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
        setForm(EMPTY)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length
  const errorSummary = errorCount > 0
  // aria attributes that tie a field to its message
  const fieldA11y = name => ({
    'aria-required': true,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <div className="contact-page" ref={pageRef}>

      <PageHero
        title="Get in Touch"
        sub="For research collaborations, speaking engagements, and academic partnerships."
      />

      <div className="contact-body">

        {/* -- FORM -- */}
        <section className="contact-main" aria-labelledby="cf-title">
          <h2 className="contact-section-title" id="cf-title">Send a message</h2>
          <p className="contact-intro">
            Share a little about your enquiry and I will follow up as soon as I can.
          </p>

          <div className="contact-card">
            {status === 'success' ? (
              <div className="contact-success" role="status">
                <div className="success-icon" aria-hidden="true">&#10003;</div>
                <h3>Message sent</h3>
                <p>Thank you for writing. I will respond as soon as I am able.</p>
                <button type="button" className="cta-primary" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form" noValidate>

                {errorSummary && (
                  <p className="form-error form-error--summary" role="alert">
                    Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below.
                  </p>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First name <span aria-hidden="true">*</span></label>
                    <input id="firstName" type="text" name="firstName" value={form.firstName} onChange={change} required autoComplete="given-name" className="form-input" placeholder="Deepak" {...fieldA11y('firstName')} />
                    <FieldError id="firstName" message={errors.firstName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last name <span aria-hidden="true">*</span></label>
                    <input id="lastName" type="text" name="lastName" value={form.lastName} onChange={change} required autoComplete="family-name" className="form-input" placeholder="Mathew" {...fieldA11y('lastName')} />
                    <FieldError id="lastName" message={errors.lastName} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                  <input id="email" type="email" name="email" value={form.email} onChange={change} required autoComplete="email" className="form-input" placeholder="you@example.com" {...fieldA11y('email')} />
                  <FieldError id="email" message={errors.email} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
                  <input id="subject" type="text" name="subject" value={form.subject} onChange={change} required className="form-input" placeholder="e.g. Research collaboration" {...fieldA11y('subject')} />
                  <FieldError id="subject" message={errors.subject} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message <span aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" value={form.message} onChange={change} required className="form-input form-textarea" placeholder="What would you like to discuss?" rows={6} {...fieldA11y('message')} />
                  <FieldError id="message" message={errors.message} />
                </div>

                {status === 'error' && (
                  <p className="form-error" role="alert">Something went wrong. Please try again.</p>
                )}

                <button type="submit" className="cta-primary" disabled={status === 'sending'}>
                  <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
                </button>

              </form>
            )}
          </div>
        </section>

        {/* -- BESIDE THE FORM: where, and elsewhere -- */}
        <aside className="contact-aside" aria-label="Other ways to reach and find me">

          <section className="contact-block">
            <h2 className="contact-block-title">Based at</h2>
            <p className="contact-place">Indian Institute of Technology Hyderabad</p>
            <p className="contact-address">Kandi, Sangareddy<br />Telangana 502284, India</p>
            <a className="contact-maplink" href={MAP_URL} target="_blank" rel="noreferrer">
              View on map <span aria-hidden="true">&#8599;</span>
            </a>
          </section>

          <section className="contact-block">
            <h2 className="contact-block-title">Elsewhere online</h2>
            <ul className="contact-links">
              {links.map(l => (
                <li key={l.label}>
                  <a className="contact-link" href={l.href} target="_blank" rel="noreferrer">
                    <span className="contact-link-label">{l.label}</span>
                    <span className="contact-link-value">{l.value}</span>
                    <span className="contact-link-arrow" aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

        </aside>
      </div>
    </div>
  )
}
