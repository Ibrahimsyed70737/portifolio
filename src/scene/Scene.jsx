import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import * as THREE from 'three'
import CameraRig from './CameraRig.jsx'
import Hot from './Hot.jsx'
import { Monitor, Laptop } from './Screens.jsx'
import { Chair, FloorPlant, WallClock, Headphones, Cube, PencilCup, Rug } from './Models.jsx'
import * as tex from './textures.js'
import { nav, scrollState } from '../lib/bus.js'
import { certifications, experience } from '../data.js'

RectAreaLightUniformsLib.init()

const METAL = { color: '#2a2a2c', metalness: 0.6, roughness: 0.38 }

function Segment({ a, b, r = 0.011 }) {
  const { pos, quat, len } = useMemo(() => {
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const d = B.clone().sub(A)
    const len = d.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    return { pos: A.add(B).multiplyScalar(0.5), quat, len }
  }, [a, b])
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, len, 12]} />
      <meshStandardMaterial {...METAL} />
    </mesh>
  )
}

function Room() {
  const win = useMemo(() => tex.windowTexture(), [])
  const poster = useMemo(() => tex.posterTexture(), [])
  const area = useRef()
  useLayoutEffect(() => area.current.lookAt(-0.4, 0, 0.6), [])
  const frame = '#f7f4ee'
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.76} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#c9b08e" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.1, -1.15]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#ebe5db" roughness={0.95} />
      </mesh>
      <group position={[-1.05, 1.12, -1.145]}>
        <mesh position-z={0.001}>
          <planeGeometry args={[1.2, 0.96]} />
          <meshBasicMaterial map={win} toneMapped={false} />
        </mesh>
        {[
          [0, 0.495, 1.28, 0.03],
          [0, -0.495, 1.28, 0.03],
          [-0.625, 0, 0.03, 1.02],
          [0.625, 0, 0.03, 1.02],
          [0, 0, 0.018, 0.96],
          [0, 0.08, 1.22, 0.018],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.012]} castShadow>
            <boxGeometry args={[w, h, 0.024]} />
            <meshStandardMaterial color={frame} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, -0.52, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.025, 0.11]} />
          <meshStandardMaterial color="#efe9df" roughness={0.8} />
        </mesh>
      </group>
      <rectAreaLight ref={area} position={[-1.05, 1.12, -1.1]} width={1.2} height={0.96} intensity={4} color="#fff3df" />
      <mesh position={[0.02, 1.48, -1.148]}>
        <planeGeometry args={[0.42, 0.574]} />
        <meshStandardMaterial map={poster} roughness={0.85} />
      </mesh>
    </group>
  )
}

function Desk() {
  const wood = useMemo(() => tex.woodTexture(), [])
  return (
    <group>
      <RoundedBox args={[3.3, 0.06, 1.5]} radius={0.012} smoothness={4} position-y={-0.03} receiveShadow castShadow>
        <meshStandardMaterial map={wood} roughness={0.58} />
      </RoundedBox>
      {[
        [-1.55, -0.65],
        [1.55, -0.65],
        [-1.55, 0.65],
        [1.55, 0.65],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.42, z]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      ))}
      {/* felt desk mat */}
      <RoundedBox args={[0.92, 0.004, 0.37]} radius={0.002} position={[0.25, 0.002, 0.15]} receiveShadow>
        <meshStandardMaterial color="#3d3a37" roughness={1} />
      </RoundedBox>
    </group>
  )
}

function Keyboard() {
  const keys = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    const c = new THREE.Color()
    let k = 0
    for (let r = 0; r < 4; r++)
      for (let col = 0; col < 14; col++) {
        m.position.set(-0.198 + col * 0.0305, 0, -0.055 + r * 0.03)
        m.updateMatrix()
        keys.current.setMatrixAt(k, m.matrix)
        const accent = (r === 0 && col === 0) || (r === 2 && col === 13)
        keys.current.setColorAt(k, c.set(accent ? '#e39a54' : '#2c2b2e'))
        k++
      }
    keys.current.instanceMatrix.needsUpdate = true
    keys.current.instanceColor.needsUpdate = true
  }, [])
  return (
    <group position={[0.12, 0.004, 0.15]} rotation-y={0.02}>
      <RoundedBox args={[0.46, 0.016, 0.15]} radius={0.005} position-y={0.008} castShadow receiveShadow>
        <meshStandardMaterial color="#1b1a1c" roughness={0.5} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[null, null, 56]} position-y={0.02} castShadow>
        <boxGeometry args={[0.026, 0.009, 0.026]} />
        <meshStandardMaterial roughness={0.55} />
      </instancedMesh>
      <mesh position={[0, 0.02, 0.063]} castShadow>
        <boxGeometry args={[0.2, 0.009, 0.024]} />
        <meshStandardMaterial color="#2c2b2e" roughness={0.55} />
      </mesh>
      <mesh position={[0.4, 0.013, 0.02]} scale={[0.031, 0.014, 0.05]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#1b1a1c" roughness={0.4} />
      </mesh>
    </group>
  )
}

const L0 = [-1.38, 0.02, -0.5]
const L1 = [-1.33, 0.56, -0.56]
const L2 = [-1.03, 0.7, -0.26]
const LT = [-0.72, 0, 0.08]

function Lamp() {
  const [on, setOn] = useState(false)
  const head = useRef()
  const light = useRef()
  const bulb = useRef()
  const level = useRef(0)
  const target = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(...LT)
    return o
  }, [])
  useLayoutEffect(() => head.current.lookAt(...LT), [])
  useFrame((_, dt) => {
    level.current = THREE.MathUtils.damp(level.current, on ? 1 : 0, 9, dt)
    light.current.intensity = level.current * 5.5
    bulb.current.emissiveIntensity = 0.2 + level.current * 7
  })
  return (
    <group>
      <Hot label={on ? 'lights off' : 'lights on'} onClick={() => setOn((v) => !v)}>
        <mesh position={[L0[0], 0.01, L0[2]]} castShadow receiveShadow>
          <cylinderGeometry args={[0.085, 0.09, 0.02, 32]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <Segment a={L0} b={L1} />
        <Segment a={L1} b={L2} />
        {[L1, L2].map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.018, 16, 12]} />
            <meshStandardMaterial color="#e39a54" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        <group ref={head} position={L2}>
          <mesh rotation-x={-Math.PI / 2} position-z={0.03} castShadow>
            <cylinderGeometry args={[0.03, 0.085, 0.13, 32, 1, true]} />
            <meshStandardMaterial color="#1d1c1e" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh position-z={0.06}>
            <sphereGeometry args={[0.03, 20, 16]} />
            <meshStandardMaterial ref={bulb} color="#fff1d6" emissive="#ffcf8a" emissiveIntensity={0.2} toneMapped={false} />
          </mesh>
        </group>
      </Hot>
      <primitive object={target} />
      <spotLight
        ref={light}
        position={L2}
        target={target}
        angle={0.78}
        penumbra={0.75}
        distance={4}
        decay={1.5}
        color="#ffb468"
      />
    </group>
  )
}

function PhotoFrame() {
  const photo = useTexture(`${import.meta.env.BASE_URL}photo.jpg`)
  photo.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={[1.08, 0, -0.3]} rotation-y={-0.4}>
      <Hot label="about me" onClick={() => nav.to(1)}>
        <group position-y={0.147} rotation-x={-0.12}>
          <RoundedBox args={[0.22, 0.29, 0.018]} radius={0.004} castShadow>
            <meshStandardMaterial color="#3b2a1d" roughness={0.55} />
          </RoundedBox>
          <mesh position-z={0.0095}>
            <planeGeometry args={[0.195, 0.262]} />
            <meshStandardMaterial color="#efe6d4" roughness={0.9} />
          </mesh>
          <mesh position-z={0.0105}>
            <planeGeometry args={[0.165, 0.22]} />
            <meshStandardMaterial map={photo} roughness={0.45} />
          </mesh>
        </group>
        <mesh position={[0, 0.11, -0.07]} rotation-x={0.38} castShadow>
          <boxGeometry args={[0.04, 0.23, 0.006]} />
          <meshStandardMaterial color="#2a1d14" />
        </mesh>
      </Hot>
    </group>
  )
}

function Polaroid() {
  const photo = useTexture(`${import.meta.env.BASE_URL}retro.jpg`)
  photo.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={[-0.32, 1.27, -1.146]} rotation-z={0.07}>
      <Hot label="me, 1986 (allegedly)" lift={0}>
        <mesh>
          <planeGeometry args={[0.13, 0.16]} />
          <meshStandardMaterial color="#efe9dc" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.012, 0.0006]}>
          <planeGeometry args={[0.11, 0.1466]} />
          <meshStandardMaterial map={photo} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.082, 0.0012]} rotation-z={-0.1}>
          <planeGeometry args={[0.05, 0.016]} />
          <meshStandardMaterial color="#d9c98f" roughness={0.9} transparent opacity={0.85} />
        </mesh>
      </Hot>
    </group>
  )
}

function Steam() {
  const map = useMemo(() => tex.steamTexture(), [])
  const refs = useRef([])
  useFrame(({ clock, camera }) => {
    const time = clock.elapsedTime
    refs.current.forEach((m, k) => {
      if (!m) return
      const ph = (time * 0.2 + k / 3) % 1
      m.position.set(Math.sin(time * 0.8 + k * 2) * 0.012, 0.12 + ph * 0.15, 0)
      m.scale.setScalar(0.6 + ph * 0.9)
      m.material.opacity = Math.sin(ph * Math.PI) * 0.2
      m.quaternion.copy(camera.quaternion)
    })
  })
  return [0, 1, 2].map((k) => (
    <mesh key={k} ref={(el) => (refs.current[k] = el)}>
      <planeGeometry args={[0.07, 0.14]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} opacity={0} />
    </mesh>
  ))
}

function Mug() {
  return (
    <group position={[1.25, 0, 0.18]}>
      <Hot label="coffee no. 3">
        <mesh position-y={0.05} castShadow receiveShadow>
          <cylinderGeometry args={[0.045, 0.042, 0.1, 32, 1, true]} />
          <meshStandardMaterial color="#b4573a" roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position-y={0.003}>
          <cylinderGeometry args={[0.042, 0.042, 0.006, 32]} />
          <meshStandardMaterial color="#b4573a" roughness={0.4} />
        </mesh>
        <mesh position-y={0.084}>
          <cylinderGeometry args={[0.043, 0.043, 0.002, 32]} />
          <meshStandardMaterial color="#2a160b" roughness={0.15} />
        </mesh>
        <mesh position={[0.05, 0.052, 0]} castShadow>
          <torusGeometry args={[0.026, 0.0075, 12, 28]} />
          <meshStandardMaterial color="#b4573a" roughness={0.4} />
        </mesh>
      </Hot>
      <Steam />
    </group>
  )
}

function Phone() {
  const map = useMemo(() => tex.phoneTexture(), [])
  const body = useRef()
  const st = useRef({ last: -1, buzz: -10 })
  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const s = scrollState.section
    if (s !== st.current.last) {
      if (s === 5) st.current.buzz = time
      st.current.last = s
    }
    const b = time - st.current.buzz
    const amp = b > 0.6 && b < 1.6 ? 1 - (b - 0.6) : 0
    body.current.rotation.y = 0.3 + Math.sin(time * 90) * 0.035 * amp
  })
  return (
    <group position={[0.84, 0, 0.46]}>
      <Hot label="call or text" onClick={() => nav.to(5)}>
        <group ref={body} rotation-y={0.3}>
          <RoundedBox args={[0.078, 0.009, 0.16]} radius={0.004} position-y={0.0045} castShadow>
            <meshStandardMaterial color="#141416" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          <mesh position-y={0.0093} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.07, 0.15]} />
            <meshBasicMaterial map={map} toneMapped={false} />
          </mesh>
        </group>
      </Hot>
    </group>
  )
}

function Notebook() {
  const map = useMemo(() => tex.notebookTexture(experience), [])
  return (
    <group position={[-0.42, 0, 0.42]} rotation-y={0.07}>
      <Hot label="experience" onClick={() => nav.to(3)}>
        <mesh position-y={0.003} castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.006, 0.31]} />
          <meshStandardMaterial color="#4a2e20" roughness={0.7} />
        </mesh>
        <mesh position-y={0.0062} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[0.44, 0.293]} />
          <meshStandardMaterial map={map} roughness={0.95} />
        </mesh>
        <mesh position={[0.27, 0.005, 0.02]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 12]} />
          <meshStandardMaterial color="#1d2a4a" metalness={0.4} roughness={0.35} />
        </mesh>
      </Hot>
    </group>
  )
}

function Book({ size: [w, h, d], color }) {
  return (
    <group>
      <mesh position-x={0.003} castShadow receiveShadow>
        <boxGeometry args={[w - 0.006, h - 0.005, d - 0.008]} />
        <meshStandardMaterial color="#e6d9bf" roughness={0.9} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position-y={s * (h / 2 - 0.0015)} castShadow receiveShadow>
          <boxGeometry args={[w, 0.003, d]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      <mesh position-x={-w / 2 + 0.002}>
        <boxGeometry args={[0.004, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

const STACK = [
  { size: [0.24, 0.035, 0.17], color: '#6d2f25', r: 0.05 },
  { size: [0.22, 0.03, 0.16], color: '#2d4656', r: -0.09 },
  { size: [0.2, 0.04, 0.15], color: '#c49a3c', r: 0.13 },
]

function Books() {
  let y = 0
  return (
    <group position={[-1.32, 0, 0.36]}>
      <Hot label="currently reading">
        {STACK.map((b, i) => {
          const yy = y + b.size[1] / 2
          y += b.size[1]
          return (
            <group key={i} position-y={yy} rotation-y={b.r}>
              <Book size={b.size} color={b.color} />
            </group>
          )
        })}
      </Hot>
    </group>
  )
}

const LEAVES = Array.from({ length: 9 }, (_, i) => ({
  a: (i / 9) * Math.PI * 2 + (i % 2) * 0.3,
  tilt: 0.1 + (i % 3) * 0.1,
  h: 0.2 + (((i * 37) % 10) / 10) * 0.15,
  c: i % 2 ? '#3e6a44' : '#557f4c',
}))

function Plant() {
  const g = useRef()
  useFrame(({ clock }) => {
    g.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.015
    g.current.rotation.x = Math.sin(clock.elapsedTime * 0.45) * 0.01
  })
  return (
    <group position={[1.45, 0, -0.55]}>
      <Hot label="kevin, the plant">
        <mesh position-y={0.065} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.052, 0.13, 28]} />
          <meshStandardMaterial color="#cfc5b6" roughness={0.85} />
        </mesh>
        <mesh position-y={0.124}>
          <cylinderGeometry args={[0.064, 0.064, 0.004, 28]} />
          <meshStandardMaterial color="#2a1c12" roughness={1} />
        </mesh>
        <group ref={g} position-y={0.125}>
          {LEAVES.map((l, i) => (
            <group key={i} rotation-y={l.a}>
              <mesh position={[Math.sin(l.tilt) * (l.h / 2), l.h / 2, 0]} rotation-z={-l.tilt} scale={[0.022, l.h / 2, 0.006]} castShadow>
                <sphereGeometry args={[1, 12, 16]} />
                <meshStandardMaterial color={l.c} roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      </Hot>
    </group>
  )
}

const SHELF_BOOKS = [
  [0.035, 0.24, '#7a3a2c'],
  [0.03, 0.21, '#d6c8ad'],
  [0.045, 0.26, '#2f4859'],
  [0.028, 0.2, '#c49a3c'],
  [0.04, 0.23, '#3d5a3f'],
  [0.033, 0.19, '#6a4b6b'],
]

function Shelf() {
  const certs = useMemo(() => certifications.map((c) => tex.certTexture(c.title, c.issuer)), [])
  let x = -0.64
  return (
    <group position={[1.05, 0.98, -1.02]}>
      <Hot label="toolbox" onClick={() => nav.to(4)} lift={0.006}>
        <RoundedBox args={[1.4, 0.03, 0.24]} radius={0.006} castShadow receiveShadow>
          <meshStandardMaterial color="#8a6447" roughness={0.6} />
        </RoundedBox>
        {[-0.55, 0.55].map((bx) => (
          <mesh key={bx} position={[bx, -0.07, -0.1]} castShadow>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial {...METAL} />
          </mesh>
        ))}
        {SHELF_BOOKS.map(([w, h, c], i) => {
          const px = x + w / 2
          x += w + 0.003
          return (
            <mesh key={i} position={[px, 0.015 + h / 2, -0.01]} castShadow receiveShadow>
              <boxGeometry args={[w, h, 0.17]} />
              <meshStandardMaterial color={c} roughness={0.7} />
            </mesh>
          )
        })}
        <mesh position={[-0.38, 0.015 + 0.105, -0.01]} rotation-z={-0.32} castShadow>
          <boxGeometry args={[0.03, 0.22, 0.16]} />
          <meshStandardMaterial color="#8c3f2e" roughness={0.7} />
        </mesh>
        {certs.map((map, i) => (
          <group key={i} position={[-0.12 + i * 0.235, 0.015 + 0.078, -0.06]} rotation-x={-0.16}>
            <mesh castShadow>
              <boxGeometry args={[0.21, 0.16, 0.01]} />
              <meshStandardMaterial color="#2a1e15" roughness={0.6} />
            </mesh>
            <mesh position-z={0.0055}>
              <planeGeometry args={[0.192, 0.145]} />
              <meshStandardMaterial map={map} roughness={0.7} />
            </mesh>
          </group>
        ))}
        <group position={[0.6, 0.015, 0]}>
          <mesh position-y={0.03} castShadow>
            <cylinderGeometry args={[0.035, 0.028, 0.06, 20]} />
            <meshStandardMaterial color="#b4573a" roughness={0.6} />
          </mesh>
          <mesh position-y={0.09} scale={[0.026, 0.05, 0.026]} castShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#4f7a4c" roughness={0.7} />
          </mesh>
        </group>
      </Hot>
    </group>
  )
}

export default function Scene({ project, started, onReady }) {
  useEffect(() => {
    onReady?.()
  }, [])

  return (
    <>
      <color attach="background" args={['#ebe5db']} />
      <fog attach="fog" args={['#ebe5db', 7, 16]} />
      <ambientLight intensity={0.55} color="#fff8ef" />
      <hemisphereLight args={['#e4eeff', '#c9b08e', 1.0]} />
      <directionalLight
        position={[-2.2, 4.2, 2.8]}
        intensity={2.4}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-2.6}
        shadow-camera-right={2.6}
        shadow-camera-top={2.6}
        shadow-camera-bottom={-2.6}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <CameraRig started={started} />
      <Room />
      <Desk />
      <Lamp />
      <Monitor project={project} />
      <Laptop />
      <Keyboard />
      <PhotoFrame />
      <Polaroid />
      <Mug />
      <Phone />
      <Notebook />
      <Books />
      <Plant />
      <Shelf />
      <Chair />
      <FloorPlant />
      <WallClock />
      <Headphones />
      <Cube />
      <PencilCup />
      <Rug />
    </>
  )
}
