import { useEffect, useState } from 'react'
import { nav } from '../lib/bus.js'

const LINKS = ['About', 'Work', 'Experience', 'Toolbox', 'Contact']
const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })

function useIST() {
  const [t, setT] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setT(fmt.format(new Date())), 15000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Chrome({ section, entered }) {
  const time = useIST()
  return (
    <div className={`chrome ${entered ? 'on' : ''}`}>
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
      <footer className="bottom">
        <span>Vijayawada, {time} IST</span>
        <span>{section === 0 ? 'Scroll to explore' : 'Objects on the desk are clickable'}</span>
      </footer>
    </div>
  )
}
