import { useCallback, useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useLang } from '../i18n/LanguageContext.jsx'

// Full-screen image viewer: Esc closes, ←/→ navigate, click backdrop closes.
// Always laid out left-to-right so the arrows keep their physical meaning.
export default function Lightbox({ images, start = 0, title, onClose }) {
  const { t } = useLang()
  const [index, setIndex] = useState(start)
  const closeBtn = useRef(null)
  const count = images.length

  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeBtn.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [go, onClose])

  const current = images[index]

  return (
    <div
      className="lightbox"
      dir="ltr"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${t.lightbox.gallery}`}
      onClick={onClose}
    >
      <button ref={closeBtn} className="lightbox__close" aria-label={t.lightbox.close} onClick={onClose}>
        <FiX size={22} />
      </button>

      <button
        className="lightbox__nav lightbox__nav--prev"
        aria-label={t.lightbox.prev}
        onClick={(e) => {
          e.stopPropagation()
          go(-1)
        }}
      >
        <FiChevronLeft size={26} />
      </button>

      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img key={current.src} src={current.src} alt={current.alt} />
        <figcaption>
          <span dir="auto">{title}</span>
          <b>
            {index + 1} / {count}
          </b>
        </figcaption>
      </figure>

      <button
        className="lightbox__nav lightbox__nav--next"
        aria-label={t.lightbox.next}
        onClick={(e) => {
          e.stopPropagation()
          go(1)
        }}
      >
        <FiChevronRight size={26} />
      </button>

      <div className="lightbox__dots" onClick={(e) => e.stopPropagation()}>
        {images.map((img, i) => (
          <button
            key={img.src}
            className={i === index ? 'is-active' : ''}
            aria-label={`${t.lightbox.show} ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
