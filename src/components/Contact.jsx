import { useState } from 'react'
import { FiCheck, FiCopy, FiDownload, FiFileText, FiMail, FiPhone, FiSend } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import { profile } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
      return
    }
  } catch {
    /* fallback below */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

export default function Contact({ onOpenCv }) {
  const { t } = useLang()
  const c = t.contact
  const [copiedKey, setCopiedKey] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState(0)
  const [msg, setMsg] = useState('')

  const triggerCopy = (key, value) => {
    copyText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2400)
  }

  const formattedMessage = () => {
    const selectedType = c.types[type] || c.types[0]
    const sender = name.trim() || 'Prospective Client / Recruiter'
    const body = msg.trim() || 'I would love to discuss a mobile engineering opportunity with you.'
    return `Hello Adeeb,\n\nName: ${sender}\nInquiry: ${selectedType}\n\n${body}`
  }

  const handleSendEmail = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[Portfolio] ${c.types[type] || 'Mobile Inquiry'} — ${name.trim() || 'Inquiry'}`)
    const body = encodeURIComponent(formattedMessage())
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_self')
  }

  const handleSendWhatsapp = () => {
    const text = encodeURIComponent(formattedMessage())
    window.open(`${profile.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const items = [
    { icon: FiMail, label: profile.email, href: `mailto:${profile.email}?subject=Portfolio%20Contact`, copy: profile.email },
    { icon: FiPhone, label: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}`, copy: profile.phone },
    { icon: FaWhatsapp, label: c.whatsappLabel, href: profile.whatsapp },
    { icon: FaGithub, label: profile.githubLabel, href: profile.github },
    { icon: FaLinkedin, label: profile.linkedinLabel, href: profile.linkedin },
  ]

  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal variant="zoom" className="cta">
          <div className="cta__text">
            <p className="section__eyebrow">{c.eyebrow}</p>
            <h2 className="section__title">
              {c.titleLines[0]}
              <br />
              {c.titleLines[1]}
            </h2>
            <p>{c.text}</p>

            <div className="cta__btn-row">
              <a href={profile.cv} download className="btn btn--primary">
                <FiDownload /> {c.cv}
              </a>
              <button type="button" className="btn btn--ghost" onClick={onOpenCv}>
                <FiFileText /> {c.previewCv}
              </button>
            </div>

            <div className="cta__links">
              {items.map(({ icon: Icon, label, href, copy }, i) => (
                <div key={label} className="contact-item-wrap stagger stagger--right" style={{ '--i': i + 1 }}>
                  <a
                    href={href}
                    className="contact-item"
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <span>
                      <Icon />
                    </span>
                    <bdi dir="ltr">{label}</bdi>
                  </a>
                  {copy && (
                    <button
                      type="button"
                      className="contact-copy"
                      onClick={() => triggerCopy(label, copy)}
                      aria-label={c.copyEmail}
                      title={c.copyEmail}
                    >
                      {copiedKey === label ? <FiCheck /> : <FiCopy />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form className="cta__form card" onSubmit={handleSendEmail}>
            <h3>{c.formTitle}</h3>

            <label className="form-field">
              <span>{c.nameLabel}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.namePlaceholder}
              />
            </label>

            <label className="form-field">
              <span>{c.typeLabel}</span>
              <select value={type} onChange={(e) => setType(Number(e.target.value))}>
                {c.types.map((opt, idx) => (
                  <option key={opt} value={idx}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>{c.msgLabel}</span>
              <textarea
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder={c.msgPlaceholder}
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                <FiSend /> {c.sendEmailBtn}
              </button>
              <button type="button" className="btn btn--ghost" onClick={handleSendWhatsapp}>
                <FaWhatsapp /> {c.sendWhatsappBtn}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => triggerCopy('form', formattedMessage())}
              >
                {copiedKey === 'form' ? <FiCheck /> : <FiCopy />} {copiedKey === 'form' ? c.copied : c.copyMsgBtn}
              </button>
            </div>
            <p className="form-note">{c.formNote}</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
