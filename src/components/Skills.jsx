import { FaAndroid, FaDatabase, FaFire, FaGithub, FaLinux } from 'react-icons/fa6'
import { FiBookOpen, FiSmartphone } from 'react-icons/fi'
import { techIcons } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

const icons = {
  android: FaAndroid,
  mobile: FiSmartphone,
  fire: FaFire,
  database: FaDatabase,
  github: FaGithub,
  linux: FaLinux,
}

export default function Skills() {
  const { t } = useLang()
  const s = t.skills

  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal as="h2" className="section__title">
          {s.title}
        </Reveal>
        <Reveal as="p" delay={80} className="section__sub">
          {s.sub}
        </Reveal>

        <div className="skills__tech">
          {techIcons.map((key, i) => {
            const Icon = icons[key]
            return (
              <Reveal key={key} delay={i * 80} variant="zoom" tilt className="tech" style={{ '--i': i }}>
                <span className="tech__icon">
                  <Icon />
                </span>
                {s.tech[i]}
              </Reveal>
            )
          })}
        </div>

        <div className="skills__categories">
          {s.categories.map((cat, idx) => (
            <Reveal key={cat.title} delay={idx * 100} tilt className="card skills__cat-card">
              <div className="card__title">
                <span>{cat.title}</span>
                <span className="pill">{cat.badge}</span>
              </div>
              <ul className="chips">
                {cat.items.map((item, i) => (
                  <li key={item} className="stagger" style={{ '--i': i }}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="skills__grid">
          <Reveal variant="left" tilt className="card">
            <h3 className="card__title">{s.skillSetTitle}</h3>
            <ul className="chips">
              {s.skillSet.map((item, i) => (
                <li key={item} className="stagger" style={{ '--i': i }}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} tilt className="card">
            <h3 className="card__title">{s.softTitle}</h3>
            <ul className="list">
              {s.soft.map((item, i) => (
                <li key={item} className="stagger stagger--left" style={{ '--i': i }}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={240} variant="right" tilt className="card">
            <h3 className="card__title">
              {s.eduTitle} <span className="pill">{s.eduStatus}</span>
            </h3>
            <p className="card__text edu">
              <FiBookOpen /> {s.eduText}
            </p>
            <h3 className="card__title card__title--gap">{s.langTitle}</h3>
            <ul className="langs">
              {s.languages.map((l, i) => (
                <li key={l.name} className="stagger stagger--left" style={{ '--i': i + 2 }}>
                  <strong>{l.name}</strong> <span>{l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal variant="zoom" className="interests">
          <span>{s.interestsTitle}</span>
          {s.interests.map((item, n) => (
            <b key={item} className="stagger" style={{ '--i': n }}>
              {item}
            </b>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
