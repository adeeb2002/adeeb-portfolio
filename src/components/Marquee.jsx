import { marquee } from '../data.js'

export default function Marquee() {
  // The list is rendered twice so the -50% loop is seamless.
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {marquee.map((item) => (
        <li key={item}>
          <span className="marquee__star">✦</span>
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="marquee" aria-label="Technologies">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
