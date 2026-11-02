import { FiArrowUpRight, FiFileText, FiMapPin } from 'react-icons/fi'
import { profile, stats } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import Typewriter from './Typewriter.jsx'

function Squiggle(props) {
  return (
    <svg viewBox="0 0 44 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 11 8 3l6 8 6-8 6 8 6-8 6 8" />
    </svg>
  )
}

function PlayMark(props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...props}>
      <path d="M8 6v28l24-14z" />
      <path d="M14 14v12l10-6z" opacity=".6" />
    </svg>
  )
}

function trackPointer(e) {
  if (e.pointerType && e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  e.currentTarget.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}

function resetPointer(e) {
  e.currentTarget.style.setProperty('--px', 0)
  e.currentTarget.style.setProperty('--py', 0)
}

export default function Hero({ onOpenCv }) {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="hero" id="home" onPointerMove={trackPointer} onPointerLeave={resetPointer}>
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />

      <div className="container hero__grid">
        <div className="hero__text">
          <div className="hero__badges-row">
            <p className="eyebrow eyebrow--intro">
              <span className="eyebrow__dot" /> {h.availability}
            </p>
            <p className="eyebrow eyebrow--loc">
              <FiMapPin /> {t.location}
            </p>
          </div>

          <h1 className="hero__title">
            {h.titleLines.map((line, i) => (
              <span className="line" key={line}>
                <span className="line__in" style={{ animationDelay: `${200 + i * 140}ms` }}>
                  {i === 0 ? <span className="hero__title-box">{line}</span> : line}
                </span>
              </span>
            ))}
          </h1>

          <Reveal as="p" delay={650} className="hero__typed">
            {h.craft} <Typewriter words={h.roles} />
          </Reveal>

          <Reveal as="p" delay={750} className="hero__lead">
            {h.hi} <strong>{t.name}</strong> — {h.intro}
          </Reveal>

          <Reveal delay={850} className="hero__actions">
            <a href="#projects" className="btn btn--primary">
              {h.myProjects} <FiArrowUpRight className="arrow-flip" />
            </a>
            <button type="button" className="btn btn--ghost" onClick={onOpenCv}>
              <FiFileText /> {h.previewCv}
            </button>
            <a href="#contact" className="btn btn--ghost">
              {h.letsTalk}
            </a>
          </Reveal>

          <div className="hero__stats">
            {stats.map((s, i) => (
              <Reveal key={h.stats[i]} delay={950 + i * 110} variant="zoom" className="stat">
                <strong>
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </strong>
                <span>{h.stats[i]}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={300} variant="zoom" className="hero__visual">
          <div className="hero__frame-outline" />
          <div className="hero__frame-fill" />
          <div className="hero__photo">
            <img src={profile.photo} alt={t.name} fetchPriority="high" />
          </div>
          <Squiggle className="deco deco--squiggle" width="44" />
          <span className="deco deco--circle" />
          <span className="deco deco--plus">+</span>
          <PlayMark className="deco deco--play" width="34" />
          <div className="hero__badge hero__badge--top" dir="ltr">
            <span className="hero__badge-dot" />
            {h.floatingBadges[0]}
          </div>
          <div className="hero__badge" dir="ltr">
            <span className="hero__badge-dot" />
            {h.badge}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
