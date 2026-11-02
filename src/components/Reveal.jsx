import { useEffect, useRef, useState } from 'react'

// Animates content in once it scrolls into view.
//  variant: 'up' | 'left' | 'right' | 'zoom'
//  tilt:    adds a 3D mouse-follow tilt with a moving glare
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
  tilt = false,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const tiltProps = tilt
    ? {
        onPointerMove(e) {
          if (e.pointerType && e.pointerType !== 'mouse') return
          const el = ref.current
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width
          const y = (e.clientY - r.top) / r.height
          el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`)
          el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`)
          el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
          el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        },
        onPointerLeave() {
          const el = ref.current
          el.style.setProperty('--rx', '0deg')
          el.style.setProperty('--ry', '0deg')
        },
      }
    : {}

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${tilt ? 'tilt' : ''} ${shown ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms`, ...style }}
      {...tiltProps}
      {...rest}
    >
      {children}
    </Tag>
  )
}
