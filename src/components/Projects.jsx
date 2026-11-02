import { useState } from 'react'
import { FiArrowUpRight, FiCheck, FiCpu, FiLayers, FiMaximize2, FiX } from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa6'
import { projects } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'
import Lightbox from './Lightbox.jsx'

function Tags({ tags }) {
  return (
    <div className="tags">
      {tags.map((tag, n) => (
        <span key={tag} className="stagger" style={{ '--i': n }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

function CaseStudyModal({ project, text, onClose }) {
  const { t } = useLang()
  const cover = project.cover ?? project.image ?? project.gallery?.[0]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={text.title} onClick={onClose}>
      <div className="case-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox__close case-modal__close" aria-label={t.projects.modalClose} onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="case-modal__media">
          <img src={cover} alt={text.title} />
        </div>

        <div className="case-modal__body">
          <span className="pill">{text.role}</span>
          <h3>{text.title}</h3>
          {text.architecture && (
            <p className="case-modal__arch">
              <FiCpu /> {text.architecture}
            </p>
          )}
          <p className="case-modal__desc">{text.text}</p>

          <h4>{t.projects.modalArch}</h4>
          <ul className="project__points">
            {(text.points || []).map((pt) => (
              <li key={pt}>
                <FiCheck /> <span>{pt}</span>
              </li>
            ))}
          </ul>

          <h4>{t.projects.modalStack}</h4>
          <Tags tags={text.tags} />

          {project.repo && (
            <div className="case-modal__footer">
              <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn--primary">
                <FaGithub /> {t.projects.viewRepo} <FiArrowUpRight className="arrow-flip" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FeaturedProject({ project, text, onOpenGallery, onOpenDetails }) {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const gallery = project.gallery.map((src, i) => ({ src, alt: text.alts[i] }))

  return (
    <Reveal variant="zoom" className="project project--featured">
      <div className="project__gallery">
        <button
          type="button"
          className="project__stage"
          onClick={() => onOpenGallery(active)}
          aria-label={`${t.projects.openGallery} ${text.title}`}
        >
          {gallery.map((g, i) => (
            <img
              key={g.src}
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className={i === active ? 'is-active' : ''}
            />
          ))}
          <span className="project__zoom">
            <FiMaximize2 /> {t.projects.viewLarger}
          </span>
        </button>

        <div className="project__thumbs" role="tablist" aria-label={t.projects.screenshots}>
          {gallery.map((g, i) => (
            <button
              type="button"
              key={g.src}
              role="tab"
              aria-selected={i === active}
              aria-label={`${t.projects.showScreenshot} ${i + 1}`}
              className={i === active ? 'is-active' : ''}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              <img src={g.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="project__body">
        <span className="project__ribbon">{t.projects.ribbon}</span>
        <h3>{text.title}</h3>
        <p className="project__ar" lang={text.subtitleLang} dir={text.subtitleDir}>
          {text.subtitle}
        </p>
        <p>{text.text}</p>

        <ul className="project__points">
          {text.points.map((p) => (
            <li key={p}>
              <FiCheck /> <span>{p}</span>
            </li>
          ))}
        </ul>

        <Tags tags={text.tags} />

        <div className="project__actions project__actions--dual">
          <button type="button" className="project__btn project__btn--solid" onClick={() => onOpenGallery(active)}>
            <FiMaximize2 /> {t.projects.viewGallery}
          </button>
          <button type="button" className="project__btn" onClick={onOpenDetails}>
            <FiLayers /> {t.projects.viewCaseStudy}
          </button>
        </div>
      </div>
    </Reveal>
  )
}

function ProjectCard({ project, text, index, onOpenDetails }) {
  const { t } = useLang()

  return (
    <Reveal
      delay={(index % 2) * 110}
      variant={index % 2 ? 'right' : 'left'}
      tilt
      className="project"
    >
      <div className="project__media" onClick={onOpenDetails} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenDetails()}>
        <img src={project.image} alt={text.title} loading="lazy" />
      </div>
      <div className="project__body">
        <Tags tags={text.tags} />
        <h3>{text.title}</h3>
        {text.architecture && <p className="project__arch">{text.architecture}</p>}
        <p>{text.text}</p>
        {text.points && (
          <ul className="project__points project__points--compact">
            {text.points.slice(0, 2).map((pt) => (
              <li key={pt}>
                <FiCheck /> <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="project__actions project__actions--dual">
          <button type="button" className="project__btn" onClick={onOpenDetails}>
            <FiLayers className="project__btn-icon" /> {t.projects.viewCaseStudy}
          </button>
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="project__btn project__btn--solid">
              <FaGithub className="project__btn-icon" /> {t.projects.viewRepo}
              <FiArrowUpRight className="project__btn-arrow arrow-flip" />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const { t } = useLang()
  const [viewer, setViewer] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [filter, setFilter] = useState('all')

  const filterKeys = ['all', 'healthcare', 'cloud', 'offline', 'commerce']
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  const featured = filtered.filter((p) => p.featured)
  const others = filtered.filter((p) => !p.featured)

  const detailProject = detailId ? projects.find((p) => p.id === detailId) : null

  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal as="h2" className="section__title">
          {t.projects.title}
        </Reveal>
        <Reveal as="p" delay={80} className="section__sub">
          {t.projects.sub}
        </Reveal>

        <div className="project-filters" role="tablist">
          {filterKeys.map((k) => (
            <button
              type="button"
              key={k}
              role="tab"
              aria-selected={filter === k}
              className={`filter-btn ${filter === k ? 'is-active' : ''}`}
              onClick={() => setFilter(k)}
            >
              {t.projects.filters[k]}
            </button>
          ))}
        </div>

        <div className="projects">
          {featured.map((p) => (
            <FeaturedProject
              key={p.id}
              project={p}
              text={t.projects.items[p.id]}
              onOpenGallery={(start) => setViewer({ id: p.id, start })}
              onOpenDetails={() => setDetailId(p.id)}
            />
          ))}
          {others.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              text={t.projects.items[p.id]}
              index={i}
              onOpenDetails={() => setDetailId(p.id)}
            />
          ))}
        </div>
      </div>

      {viewer && (
        <Lightbox
          images={projects
            .find((p) => p.id === viewer.id)
            .gallery.map((src, i) => ({ src, alt: t.projects.items[viewer.id].alts[i] }))}
          start={viewer.start}
          title={t.projects.items[viewer.id].title}
          onClose={() => setViewer(null)}
        />
      )}

      {detailProject && (
        <CaseStudyModal
          project={detailProject}
          text={t.projects.items[detailProject.id]}
          onClose={() => setDetailId(null)}
        />
      )}
    </section>
  )
}
