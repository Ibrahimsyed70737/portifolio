import { useEffect, useState } from 'react'
import { nav } from '../lib/bus.js'

const LINKS = ['About', 'Work', 'Experience', 'Toolbox', 'Contact']

// Bar sits flat at the top, slides away while scrolling down, returns on scroll up.
function useBarState() {
  const [state, setState] = useState('at-top')
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 40) setState('at-top')
      else if (y > last + 4) setState('hidden')
      else if (y < last - 4) setState('shown')
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return state
}

export default function Chrome({ section, entered }) {
  const bar = useBarState()
  return (
    <div className={`chrome ${entered ? 'on' : ''} ${bar}`}>
      <div className="progress" />
      <header className="top">
        <button className="mark" onClick={() => nav.to(0)} aria-label="Back to top">
          <span className="logo" aria-hidden>
            SI<i />
          </span>
          <span className="name">Syed Ibrahim</span>
        </button>
        <nav aria-label="Sections">
          <ul className="navl">
            {LINKS.map((l, i) => (
              <li key={l}>
                <button className={section === i + 1 ? 'on' : ''} onClick={() => nav.to(i + 1)}>
                  {l}
                </button>
              </li>
            ))}
          </ul>
          <a className="count" href="mailto:ibrahimibrahim70737@gmail.com">Contact</a>
        </nav>
      </header>
    </div>
  )
}
