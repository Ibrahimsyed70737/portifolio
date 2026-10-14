import { useEffect, useState } from 'react'

// A short, quiet fade: logo mark, then the room. No counter.
export default function Loader({ ready, onDone }) {
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!ready) return
    const a = setTimeout(() => {
      setOut(true)
      onDone()
    }, 300)
    const b = setTimeout(() => setGone(true), 1400)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [ready])

  if (gone) return null
  return (
    <div className={`loader ${out ? 'out' : ''}`} aria-hidden={out}>
      <span className="logo big" aria-hidden>
        SI<i />
      </span>
    </div>
  )
}
