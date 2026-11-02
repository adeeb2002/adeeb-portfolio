import { useEffect, useRef, useState } from 'react'
import { FiDownload, FiFileText, FiGlobe, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { navLinks, profile } from '../data.js'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function Navbar({ onOpenCv }) {
  const { t, theme, toggle, toggleTheme } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const bar = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`))
      },
      { rootMargin: '-40% 0px -52% 0px' },
    )
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#home" className="logo" onClick={close}>
          <span className="logo__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect width="32" height="32" rx="9" fill="#5b52e0" />
              <path d="M9 22 16 9l7 13h-4l-3-6-3 6z" fill="#fff" />
            </svg>
          </span>
          <span>{t.firstName}</span>
        </a>

        <nav className="nav__links" aria-label={t.nav.main}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className={active === l.href ? 'is-active' : ''}
            >
              {t.nav.links[l.id]}
            </a>
          ))}
          <button
            type="button"
            className="btn btn--ghost nav__cta"
            onClick={() => {
              close()
              onOpenCv?.()
            }}
          >
            <FiFileText /> {t.nav.previewCv}
          </button>
          <a href={profile.cv} download className="btn btn--outline nav__cta" onClick={close}>
            <FiDownload /> {t.nav.cv}
          </a>
        </nav>

        <div className="nav__end">
          <button
            type="button"
            className="theme-switch"
            onClick={toggleTheme}
            aria-label={t.themeAria}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          <button
            type="button"
            className="lang-switch"
            onClick={toggle}
            aria-label={t.switchAria}
            lang={t.dir === 'rtl' ? 'en' : 'ar'}
          >
            <FiGlobe aria-hidden="true" />
            <span>{t.switchTo}</span>
          </button>
          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      <div className="nav__progress" ref={bar} />
    </header>
  )
}
