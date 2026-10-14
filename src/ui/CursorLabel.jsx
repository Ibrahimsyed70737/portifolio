import { useEffect, useRef, useState } from 'react'
import { cursor } from '../lib/bus.js'

// Small tag that trails the pointer while it is over a desk object.
export default function CursorLabel() {
  const ref = useRef()
  const [label, setLabel] = useState(null)
  const [last, setLast] = useState('')

  useEffect(() => {
    const unsub = cursor.subscribe((l) => {
      setLabel(l)
      if (l) setLast(l)
    })
    let x = innerWidth / 2
    let y = innerHeight / 2
    let tx = x
    let ty = y
    let raf
    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    addEventListener('pointermove', move)
    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      if (ref.current) ref.current.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      unsub()
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className={`clabel ${label ? 'on' : ''}`} aria-hidden>
      <span>{label || last}</span>
    </div>
  )
}
