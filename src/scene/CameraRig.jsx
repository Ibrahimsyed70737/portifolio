import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/bus.js'

// One camera stop per page section. `side` is where the text sits,
// so the object is framed on the opposite side.
export const KEYS = [
  { pos: [2.05, 1.3, 2.45], look: [0.05, 0.28, -0.3], side: 'left' }, // hero: whole desk
  { pos: [0.55, 0.3, 0.94], look: [1.1, 0.14, -0.3], side: 'left' }, // about: photo frame
  { pos: [0.15, 0.52, 1.4], look: [0.15, 0.4, -0.42], side: 'left' }, // work: monitor
  { pos: [-0.36, 1.05, 0.95], look: [-0.42, 0.0, 0.42], side: 'right' }, // experience: notebook
  { pos: [0.95, 1.3, 0.55], look: [1.1, 1.22, -1.05], side: 'left' }, // toolbox: shelf
  { pos: [1.0, 0.56, 0.86], look: [0.84, 0.0, 0.46], side: 'left' }, // contact: phone
]
export const SIDES = KEYS.map((k) => k.side)

const INTRO = new THREE.Vector3(5.6, 3.6, 7.2)
const sideX = { left: -0.17, right: 0.17, center: 0 }

const smooth = (t) => t * t * (3 - 2 * t)
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function CameraRig({ started }) {
  const look = useRef(new THREE.Vector3(...KEYS[0].look))
  const off = useRef({ x: 0, y: 0 })
  const intro = useRef(0)
  const v = useRef({ p: new THREE.Vector3(), l: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3() })

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const { camera, size, pointer } = state
    const { p, l, b, d } = v.current
    const n = KEYS.length - 1
    const f = THREE.MathUtils.clamp(scrollState.f, 0, n)
    const i = Math.min(Math.floor(f), n - 1)
    // hold on each object while its text is being read, then glide to the next
    const t = smooth(THREE.MathUtils.clamp((f - i - 0.18) / 0.64, 0, 1))
    const A = KEYS[i]
    const B = KEYS[i + 1]

    p.fromArray(A.pos).lerp(b.fromArray(B.pos), t)
    l.fromArray(A.look).lerp(b.fromArray(B.look), t)

    // lift the camera along its arc so moves feel like a hand-held dolly, not a straight line
    p.y += Math.sin(t * Math.PI) * 0.18

    const portrait = size.width < size.height * 0.95
    if (portrait) p.copy(d.subVectors(p, l).multiplyScalar(1.55).add(l))

    if (started) intro.current = scrollState.snap ? 1 : Math.min(1, intro.current + dt / 2.8)
    const e = ease(intro.current)
    p.lerpVectors(INTRO, p, e)

    const dist = p.distanceTo(l)
    p.x += pointer.x * 0.05 * dist
    p.y += pointer.y * 0.03 * dist

    const k = scrollState.snap ? 1 : 1 - Math.exp(-4.5 * dt)
    camera.position.lerp(p, k)
    look.current.lerp(l, k)
    camera.lookAt(look.current)

    // shift the frame so the object sits beside the text, not under it
    const tx = portrait ? 0 : THREE.MathUtils.lerp(sideX[A.side], sideX[B.side], t)
    const ty = portrait ? 0.16 : 0
    off.current.x = scrollState.snap ? tx : THREE.MathUtils.damp(off.current.x, tx, 4, dt)
    off.current.y = scrollState.snap ? ty : THREE.MathUtils.damp(off.current.y, ty, 4, dt)
    camera.setViewOffset(size.width, size.height, off.current.x * size.width, off.current.y * size.height, size.width, size.height)
  })

  return null
}
