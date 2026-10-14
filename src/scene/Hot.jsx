import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cursor } from '../lib/bus.js'

// Wraps a desk object: lifts it slightly on hover and shows a label next to the pointer.
export default function Hot({ label, onClick, lift = 0.012, children }) {
  const ref = useRef()
  const hover = useRef(false)

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, hover.current ? lift : 0, 10, dt)
  })

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation()
        hover.current = true
        cursor.set(label)
        if (onClick) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        hover.current = false
        cursor.set(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        if (!onClick) return
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
    </group>
  )
}
