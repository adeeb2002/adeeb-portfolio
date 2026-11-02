import { useState } from 'react'
import { FiArrowUpRight, FiDatabase, FiLayers, FiSmartphone, FiZap } from 'react-icons/fi'
import { projects } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

const icons = [FiLayers, FiDatabase, FiSmartphone, FiZap]

// Auto-advancing preview of selected work. Each progress bar's fill animation
// drives the slide change (so hovering pauses it), and it never auto-plays
// for people who prefer reduced motion.
function Showcase() {
  const { t } = useLang()
  const [active, setActive] = useState(0)

  const slides = projects.map((p) => {
    const text = t.projects.items[p.id]
    return {
      id: p.id,
      title: text.title,
      image: p.cover ?? p.image ?? p.gallery[0],
      tags: text.tags.slice(0, 3),
    }
  })
  const slide = slides[active]

  const next = () => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    setActive((i) => (i + 1) % slides.length)
  }

  return (
    <Reveal variant="zoom" className="showcase">
      <div className="showcase__bars">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={i < active ? 'is-done' : i === active ? 'is-active' : ''}
            aria-label={`${t.why.showProject} ${s.title}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
          >
            <span>
              <i onAnimationEnd={i === active ? next : undefined} />
            </span>
          </button>
        ))}
      </div>

      <div className="showcase__stage">
        {slides.map((s, i) => (
          <figure key={s.id} className={`showcase__slide ${i === active ? 'is-active' : ''}`} aria-hidden={i !== active}>
            <img className="showcase__img" src={s.image} alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} />
          </figure>
        ))}
      </div>

      <div className="showcase__info">
        <span className="showcase__label">{t.why.label}</span>
        <h3 key={slide.id}>{slide.title}</h3>
        <div className="tags" key={`${slide.id}-tags`}>
          {slide.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a href="#projects" className="showcase__link">
          {t.why.explore} <FiArrowUpRight className="arrow-flip" />
        </a>
      </div>
    </Reveal>
  )
}

export default function Why() {
  const { t } = useLang()

  return (
    <section className="section why" id="about">
      <div className="container">
        <div className="why__head">
          <Reveal as="h2" className="section__title">
            {t.why.titleLines[0]}
            <br />
            {t.why.titleLines[1]}
          </Reveal>
          <Reveal as="p" delay={100} className="why__intro">
            {t.why.intro}
          </Reveal>
        </div>

        <div className="why__grid">
          <Showcase />

          {t.why.items.map((h, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={h.title} delay={i * 110} tilt className="card why__item">
                <div className="why__top">
                  <span className="why__icon">
                    <Icon />
                  </span>
                  <span className="why__num">0{i + 1}</span>
                </div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
