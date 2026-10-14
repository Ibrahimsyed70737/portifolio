import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Hot from './Hot.jsx'

const DARK = { color: '#232325', metalness: 0.5, roughness: 0.4 }
const FLOOR_Y = -0.76

export function Chair() {
  const legs = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2)
  return (
    <group position={[-1.25, FLOOR_Y, 1.05]} rotation-y={0.55}>
      <Hot label="the thinking chair">
        {legs.map((a) => (
          <group key={a} rotation-y={a}>
            <mesh position={[0.15, 0.06, 0]} castShadow>
              <boxGeometry args={[0.3, 0.025, 0.035]} />
              <meshStandardMaterial {...DARK} />
            </mesh>
            <mesh position={[0.29, 0.025, 0]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <meshStandardMaterial {...DARK} />
            </mesh>
          </group>
        ))}
        <mesh position-y={0.26} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.36, 16]} />
          <meshStandardMaterial color="#8d8f93" metalness={0.8} roughness={0.3} />
        </mesh>
        <RoundedBox args={[0.5, 0.075, 0.48]} radius={0.03} smoothness={4} position-y={0.47} castShadow receiveShadow>
          <meshStandardMaterial color="#3a3b3f" roughness={0.85} />
        </RoundedBox>
        <group position={[0, 0.82, 0.25]} rotation-x={0.12}>
          <RoundedBox args={[0.46, 0.58, 0.05]} radius={0.025} smoothness={4} castShadow>
            <meshStandardMaterial color="#3a3b3f" roughness={0.85} />
          </RoundedBox>
        </group>
        <mesh position={[0, 0.6, 0.24]} rotation-x={0.12} castShadow>
          <boxGeometry args={[0.06, 0.26, 0.02]} />
          <meshStandardMaterial {...DARK} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.27, 0.6, 0.02]}>
            <mesh castShadow>
              <boxGeometry args={[0.03, 0.2, 0.03]} />
              <meshStandardMaterial {...DARK} />
            </mesh>
            <RoundedBox args={[0.06, 0.025, 0.26]} radius={0.01} position-y={0.1} castShadow>
              <meshStandardMaterial {...DARK} />
            </RoundedBox>
          </group>
        ))}
      </Hot>
    </group>
  )
}

const UP = new THREE.Vector3(0, 1, 0)
const BIG_LEAVES = Array.from({ length: 11 }, (_, i) => {
  const a = i * 2.4
  const y = 0.35 + (((i * 53) % 11) / 11) * 0.7
  const reach = (0.12 + (((i * 29) % 7) / 7) * 0.2) * (0.6 + y * 0.5)
  const tip = new THREE.Vector3(Math.cos(a) * reach, y, Math.sin(a) * reach)
  return {
    a,
    tip,
    mid: tip.clone().multiplyScalar(0.5),
    len: tip.length(),
    quat: new THREE.Quaternion().setFromUnitVectors(UP, tip.clone().normalize()),
    size: 0.1 + (((i * 17) % 5) / 5) * 0.06,
  }
})

export function FloorPlant() {
  const g = useRef()
  useFrame(({ clock }) => {
    g.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.012
  })
  return (
    <group position={[2.0, FLOOR_Y, -0.75]}>
      <Hot label="monstera, thriving">
        <mesh position-y={0.19} castShadow receiveShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.38, 32]} />
          <meshStandardMaterial color="#eae4da" roughness={0.8} />
        </mesh>
        <mesh position-y={0.375}>
          <cylinderGeometry args={[0.16, 0.16, 0.01, 32]} />
          <meshStandardMaterial color="#4a3526" roughness={1} />
        </mesh>
        <group ref={g} position-y={0.38}>
          {BIG_LEAVES.map((l, i) => (
            <group key={i}>
              <mesh position={l.mid} quaternion={l.quat}>
                <cylinderGeometry args={[0.005, 0.007, l.len, 6]} />
                <meshStandardMaterial color="#5f7f45" roughness={0.7} />
              </mesh>
              <group position={l.tip} rotation-y={-l.a}>
                <mesh position-x={l.size * 0.8} rotation-z={-0.45} scale={[l.size * 1.2, 0.012, l.size]} castShadow>
                  <sphereGeometry args={[1, 16, 12]} />
                  <meshStandardMaterial color={i % 2 ? '#3f6b3a' : '#4e7d44'} roughness={0.55} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      </Hot>
    </group>
  )
}

// Shows the actual time in Vijayawada.
export function WallClock() {
  const h = useRef()
  const m = useRef()
  const s = useRef()
  const ticks = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), [])
  useFrame(() => {
    const now = new Date()
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000)
    const sec = ist.getSeconds() + ist.getMilliseconds() / 1000
    const min = ist.getMinutes() + sec / 60
    const hr = (ist.getHours() % 12) + min / 60
    s.current.rotation.z = -(sec / 60) * Math.PI * 2
    m.current.rotation.z = -(min / 60) * Math.PI * 2
    h.current.rotation.z = -(hr / 12) * Math.PI * 2
  })
  return (
    <group position={[1.3, 1.56, -1.13]}>
      <Hot label="IST, live" lift={0}>
        <mesh rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.135, 0.135, 0.03, 48]} />
          <meshStandardMaterial color="#1f1f21" roughness={0.4} />
        </mesh>
        <mesh position-z={0.0155}>
          <circleGeometry args={[0.122, 48]} />
          <meshStandardMaterial color="#faf8f3" roughness={0.6} />
        </mesh>
        {ticks.map((a, i) => (
          <mesh key={i} position={[Math.sin(a) * 0.105, Math.cos(a) * 0.105, 0.017]} rotation-z={-a}>
            <planeGeometry args={[i % 3 ? 0.004 : 0.008, i % 3 ? 0.012 : 0.022]} />
            <meshBasicMaterial color="#1f1f21" />
          </mesh>
        ))}
        <group ref={h} position-z={0.018}>
          <mesh position-y={0.03}>
            <planeGeometry args={[0.008, 0.065]} />
            <meshBasicMaterial color="#1f1f21" />
          </mesh>
        </group>
        <group ref={m} position-z={0.019}>
          <mesh position-y={0.045}>
            <planeGeometry args={[0.005, 0.095]} />
            <meshBasicMaterial color="#1f1f21" />
          </mesh>
        </group>
        <group ref={s} position-z={0.02}>
          <mesh position-y={0.04}>
            <planeGeometry args={[0.002, 0.11]} />
            <meshBasicMaterial color="#c4511a" />
          </mesh>
        </group>
        <mesh position-z={0.021}>
          <circleGeometry args={[0.006, 16]} />
          <meshBasicMaterial color="#c4511a" />
        </mesh>
      </Hot>
    </group>
  )
}

export function Headphones() {
  return (
    <group position={[-0.47, 0, -0.55]} rotation-y={0.25}>
      <Hot label="focus mode">
        <mesh position-y={0.006} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.065, 0.012, 32]} />
          <meshStandardMaterial color="#d8d4cc" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position-y={0.14} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.27, 12]} />
          <meshStandardMaterial color="#d8d4cc" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position-y={0.278}>
          <boxGeometry args={[0.07, 0.012, 0.03]} />
          <meshStandardMaterial color="#d8d4cc" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position-y={0.2} castShadow>
          <torusGeometry args={[0.09, 0.011, 12, 40, Math.PI]} />
          <meshStandardMaterial color="#1e1e20" roughness={0.5} />
        </mesh>
        {[-1, 1].map((sx) => (
          <group key={sx} position={[sx * 0.092, 0.17, 0]}>
            <mesh rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[0.048, 0.048, 0.034, 28]} />
              <meshStandardMaterial color="#1e1e20" roughness={0.55} />
            </mesh>
            <mesh position-x={-sx * 0.019} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.04, 0.04, 0.006, 28]} />
              <meshStandardMaterial color="#c4511a" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </Hot>
    </group>
  )
}

const FACE_COLORS = ['#c41e1e', '#f2f2f2', '#1e6fd9', '#f5c400', '#1f9d55', '#f07b16']

export function Cube() {
  const stickers = useMemo(() => {
    const out = []
    let seed = 9
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const step = 0.0186
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        const pick = () => FACE_COLORS[Math.floor(rnd() * 6)]
        out.push({ p: [i * step, 0.0281, j * step], r: [-Math.PI / 2, 0, 0], c: pick() })
        out.push({ p: [i * step, j * step, 0.0281], r: [0, 0, 0], c: pick() })
        out.push({ p: [0.0281, j * step, i * step], r: [0, Math.PI / 2, 0], c: pick() })
        out.push({ p: [-0.0281, j * step, i * step], r: [0, -Math.PI / 2, 0], c: pick() })
      }
    return out
  }, [])
  return (
    <group position={[0.68, 0.028, -0.14]} rotation-y={0.5}>
      <Hot label="solved it once">
        <RoundedBox args={[0.056, 0.056, 0.056]} radius={0.004} castShadow>
          <meshStandardMaterial color="#111" roughness={0.4} />
        </RoundedBox>
        {stickers.map((st, i) => (
          <mesh key={i} position={st.p} rotation={st.r}>
            <planeGeometry args={[0.0165, 0.0165]} />
            <meshStandardMaterial color={st.c} roughness={0.35} />
          </mesh>
        ))}
      </Hot>
    </group>
  )
}

const PENCILS = [
  { c: '#f2b632', tilt: [0.12, 0, 0.1], h: 0.17 },
  { c: '#1d2a4a', tilt: [-0.1, 0, 0.14], h: 0.15 },
  { c: '#c4511a', tilt: [0.05, 0, -0.16], h: 0.16 },
]

export function PencilCup() {
  return (
    <group position={[0.8, 0, -0.42]}>
      <Hot label="mostly unused pens">
        <mesh position-y={0.05} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 24, 1, true]} />
          <meshStandardMaterial color="#cfc9bf" metalness={0.4} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position-y={0.002}>
          <cylinderGeometry args={[0.035, 0.035, 0.004, 24]} />
          <meshStandardMaterial color="#cfc9bf" metalness={0.4} roughness={0.35} />
        </mesh>
        {PENCILS.map((p, i) => (
          <mesh key={i} position-y={p.h / 2 + 0.01} rotation={p.tilt} castShadow>
            <cylinderGeometry args={[0.0045, 0.0045, p.h, 6]} />
            <meshStandardMaterial color={p.c} roughness={0.5} />
          </mesh>
        ))}
      </Hot>
    </group>
  )
}

export function Rug() {
  const map = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 340
    const g = c.getContext('2d')
    g.fillStyle = '#e2d8c8'
    g.fillRect(0, 0, 512, 340)
    g.strokeStyle = '#b9a88f'
    g.lineWidth = 6
    g.strokeRect(22, 22, 468, 296)
    g.lineWidth = 2
    g.strokeRect(36, 36, 440, 268)
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(120,100,70,${Math.random() * 0.06})`
      g.fillRect(Math.random() * 512, Math.random() * 340, 2, 2)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.rotation.x = -Math.PI / 2
  }, [])
  return (
    <mesh ref={ref} position={[-0.2, FLOOR_Y + 0.004, 0.9]} receiveShadow>
      <planeGeometry args={[2.6, 1.7]} />
      <meshStandardMaterial map={map} roughness={1} />
    </mesh>
  )
}
