import { useEffect, useRef, useState } from 'react'

export default function Loader({ ready, onDone }) {
  const [n, setN] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)
  const readyRef = useRef(ready)
  readyRef.current = ready

  useEffect(() => {
    let raf
    let v = 0
    const start = performance.now()
    let prev = start
    const tick = () => {
      const now = performance.now()
      const dt = Math.min(0.25, (now - prev) / 1000)
      prev = now
      const t = (now - start) / 1000
      const cap = readyRef.current ? 100 : Math.min(88, t * 40)
      v += (cap - v) * (1 - Math.exp(-3.4 * dt))
      if (readyRef.current && 100 - v < 0.6) v = 100
      setN(Math.floor(v))
      if (v >= 100) {
        setOut(true)
        setTimeout(onDone, 250)
        setTimeout(() => setGone(true), 1500)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (gone) return null
  return (
    <div className={`loader ${out ? 'out' : ''}`} aria-hidden={out}>
      <div className="loader-row">
        <span>Syed Ibrahim Khaliulla</span>
        <span>Portfolio, 2026</span>
      </div>
      <div className="loader-num">{String(n).padStart(3, '0')}</div>
      <div className="loader-row">
        <span>setting up the desk</span>
        <span className="bar">
          <i style={{ transform: `scaleX(${n / 100})` }} />
        </span>
      </div>
    </div>
  )
}
