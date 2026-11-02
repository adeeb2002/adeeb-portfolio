import { useEffect, useState } from 'react'

// Types and deletes each phrase in a loop.
export default function Typewriter({ words, speed = 70, pause = 1600 }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0])
      return
    }
    let w = 0
    let i = 0
    let deleting = false
    let timer

    const step = () => {
      const word = words[w]
      i += deleting ? -1 : 1
      setText(word.slice(0, i))

      let wait = deleting ? speed / 2 : speed
      if (!deleting && i === word.length) {
        deleting = true
        wait = pause
      } else if (deleting && i === 0) {
        deleting = false
        w = (w + 1) % words.length
        wait = 350
      }
      timer = setTimeout(step, wait)
    }
    timer = setTimeout(step, 600)
    return () => clearTimeout(timer)
  }, [words, speed, pause])

  return (
    <span className="typed">
      {text}
      <i className="caret" aria-hidden="true" />
    </span>
  )
}
