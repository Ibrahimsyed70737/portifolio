import { useEffect, useState } from 'react'
import { nav } from '../lib/bus.js'

const LINKS = ['about', 'work', 'experience', 'toolbox', 'contact']
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
          Ibrahim<span>.</span>
        </button>
        <nav aria-label="Sections">
          <ul className="navl">
            {LINKS.map((l, i) => (
              <li key={l}>
                <button className={section === i + 1 ? 'on' : ''} onClick={() => nav.to(i + 1)}>
                  <span className="k">0{i + 1}</span>
                  {l}
                </button>
              </li>
            ))}
          </ul>
          <span className="count">
            0{section} <i>/</i> 05
          </span>
        </nav>
      </header>
      <footer className="bottom">
        <span>Vijayawada, {time} IST</span>
        <span>{section === 0 ? 'scroll' : 'objects on the desk are clickable'}</span>
      </footer>
    </div>
  )
}
