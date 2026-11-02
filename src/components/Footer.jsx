import { useLang } from '../i18n/LanguageContext.jsx'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>{t.footer.rights}</p>
        <a href="#home" className="to-top">
          {t.footer.top} <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  )
}
