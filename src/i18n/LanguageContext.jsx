import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { content } from './content.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'portfolio-lang'
const THEME_KEY = 'portfolio-theme'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && content[saved]) return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

function initialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage unavailable */
  }
  return 'dark'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const [theme, setTheme] = useState(initialTheme)

  useLayoutEffect(() => {
    const t = content[lang]
    const root = document.documentElement
    root.lang = t.htmlLang
    root.dir = t.dir
    root.dataset.theme = theme
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* storage unavailable */
    }
  }, [lang, theme])

  const value = useMemo(
    () => ({
      lang,
      theme,
      t: content[lang],
      isRtl: content[lang].dir === 'rtl',
      toggle: () => setLang((l) => (l === 'en' ? 'ar' : 'en')),
      toggleTheme: () => setTheme((th) => (th === 'dark' ? 'light' : 'dark')),
    }),
    [lang, theme],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
