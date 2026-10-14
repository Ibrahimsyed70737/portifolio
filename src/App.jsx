import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'
import Scene from './scene/Scene.jsx'
import { SIDES } from './scene/CameraRig.jsx'
import Sections from './ui/Sections.jsx'
import Chrome from './ui/Chrome.jsx'
import Loader from './ui/Loader.jsx'
import CursorLabel from './ui/CursorLabel.jsx'
import { nav, scrollState } from './lib/bus.js'

// Canvas textures draw text, so these fonts must be ready before the scene mounts.
const FONTS = ['600 48px Caveat', '400 20px "JetBrains Mono"', '200 60px Inter', '300 60px Inter', '400 20px Inter', '600 20px Inter', '700 60px Inter']

// ?shot=3 jumps straight to a section (handy for screenshots).
const SHOT = new URLSearchParams(location.search).get('shot')

export default function App() {
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [project, setProject] = useState(0)
  const [section, setSection] = useState(0)
  const [dpr, setDpr] = useState(1.5)
  const sections = useRef([])
  const lenisRef = useRef()

  useEffect(() => {
    const fallback = setTimeout(() => setFontsReady(true), 3500)
    Promise.all(FONTS.map((f) => document.fonts.load(f))).finally(() => {
      clearTimeout(fallback)
      setFontsReady(true)
    })
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.075, wheelMultiplier: 0.9 })
    lenisRef.current = lenis
    lenis.stop()

    let tops = []
    let last = -1
    const measure = () => {
      tops = sections.current.map((el) => el.getBoundingClientRect().top + window.scrollY)
    }
    const update = () => {
      const y = lenis.scroll
      const n = tops.length - 1
      let i = 0
      while (i < n && y >= tops[i + 1]) i++
      const f = i >= n ? n : i + (y - tops[i]) / (tops[i + 1] - tops[i])
      scrollState.f = Math.max(0, f)
      const s = Math.round(scrollState.f)
      if (s !== last) {
        last = s
        scrollState.section = s
        setSection(s)
      }
      document.documentElement.style.setProperty('--progress', (y / Math.max(1, lenis.limit)).toFixed(4))
    }
    measure()
    update()
    const ro = new ResizeObserver(() => {
      measure()
      update()
    })
    ro.observe(document.body)
    lenis.on('scroll', update)

    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    nav.to = (i, immediate = false) => {
      const el = sections.current[i]
      if (el) lenis.scrollTo(el, { duration: 1.8, immediate, force: true })
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!entered) return
    lenisRef.current?.start()
    if (SHOT) {
      scrollState.snap = true
      nav.to(+SHOT, true)
    }
  }, [entered])

  return (
    <>
      <div className="stage">
        {fontsReady && (
          <Canvas
            shadows
            dpr={dpr}
            camera={{ fov: 35, near: 0.03, far: 40, position: [5.6, 3.6, 7.2] }}
            gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          >
            {/* drop resolution on slower GPUs instead of dropping frames */}
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))} />
            <Suspense fallback={null}>
              <Scene project={project} started={entered} onReady={() => setSceneReady(true)} />
            </Suspense>
          </Canvas>
        )}
      </div>
      <div className={`scrim scrim-${SIDES[section]}`} />
      <Chrome section={section} entered={entered} />
      <main>
        <Sections
          register={(i, el) => (sections.current[i] = el)}
          entered={entered}
          project={project}
          setProject={setProject}
        />
      </main>
      <CursorLabel />
      <Loader ready={sceneReady} onDone={() => setEntered(true)} />
    </>
  )
}
