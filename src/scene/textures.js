import * as THREE from 'three'

// Every surface detail on the desk is painted here on a 2D canvas.
// No downloaded models or images except the photo.

export function makeCanvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

export function toTexture(c) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

// Deterministic random so the desk looks the same on every visit.
export function rand(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function wrap(g, text, x, y, maxW, lh) {
  let line = ''
  for (const w of text.split(' ')) {
    const test = line ? line + ' ' + w : w
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y)
      y += lh
      line = w
    } else line = test
  }
  if (line) g.fillText(line, x, y)
  return y
}

export function woodTexture() {
  const [c, g] = makeCanvas(2048, 1024)
  const r = rand(7)
  g.fillStyle = '#6a4630'
  g.fillRect(0, 0, 2048, 1024)
  for (let i = 0; i < 420; i++) {
    const y = r() * 1024
    const amp = 3 + r() * 10
    const freq = 0.002 + r() * 0.006
    const ph = r() * 10
    g.strokeStyle = r() > 0.45 ? `rgba(38,22,12,${0.06 + r() * 0.16})` : `rgba(170,124,84,${0.04 + r() * 0.1})`
    g.lineWidth = 0.8 + r() * 3
    g.beginPath()
    for (let x = 0; x <= 2048; x += 24) {
      const yy = y + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 3.1 + ph) * amp * 0.25
      x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy)
    }
    g.stroke()
  }
  // a couple of knots
  for (let k = 0; k < 3; k++) {
    const kx = 300 + r() * 1500
    const ky = 150 + r() * 700
    for (let ring = 0; ring < 7; ring++) {
      g.strokeStyle = `rgba(40,22,12,${0.18 - ring * 0.02})`
      g.lineWidth = 2
      g.beginPath()
      g.ellipse(kx, ky, 10 + ring * 9, 4 + ring * 3.2, 0, 0, Math.PI * 2)
      g.stroke()
    }
  }
  return toTexture(c)
}

export function windowTexture() {
  const [c, g] = makeCanvas(640, 512)
  const r = rand(3)
  const sky = g.createLinearGradient(0, 0, 0, 512)
  sky.addColorStop(0, '#0d1430')
  sky.addColorStop(0.42, '#262a52')
  sky.addColorStop(0.72, '#7d4558')
  sky.addColorStop(1, '#e0874f')
  g.fillStyle = sky
  g.fillRect(0, 0, 640, 512)
  for (let i = 0; i < 90; i++) {
    g.fillStyle = `rgba(255,248,230,${0.15 + r() * 0.55})`
    const s = r() > 0.92 ? 2.2 : 1.3
    g.fillRect(r() * 640, r() * 230, s, s)
  }
  // moon with a soft halo
  const halo = g.createRadialGradient(470, 100, 10, 470, 100, 80)
  halo.addColorStop(0, 'rgba(255,236,200,0.35)')
  halo.addColorStop(1, 'rgba(255,236,200,0)')
  g.fillStyle = halo
  g.fillRect(380, 10, 180, 180)
  g.fillStyle = '#f4e7c9'
  g.beginPath()
  g.arc(470, 100, 20, 0, Math.PI * 2)
  g.fill()
  // far skyline
  let x = -5
  while (x < 640) {
    const w = 18 + r() * 42
    const h = 90 + r() * 150
    g.fillStyle = '#1d1728'
    g.fillRect(x, 512 - h, w, h)
    x += w + 1
  }
  // near skyline with lit windows
  x = -10
  while (x < 640) {
    const w = 34 + r() * 66
    const h = 50 + r() * 120
    g.fillStyle = '#0b090e'
    g.fillRect(x, 512 - h, w, h)
    for (let wy = 512 - h + 9; wy < 505; wy += 11)
      for (let wx = x + 6; wx < x + w - 7; wx += 9)
        if (r() > 0.74) {
          g.fillStyle = r() > 0.25 ? 'rgba(255,190,110,0.95)' : 'rgba(170,205,255,0.8)'
          g.fillRect(wx, wy, 4, 5)
        }
    x += w + 3
  }
  return toTexture(c)
}

export function posterTexture() {
  const [c, g] = makeCanvas(600, 820)
  g.fillStyle = '#dccfb9'
  g.fillRect(0, 0, 600, 820)
  // paper grain
  const r = rand(11)
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = `rgba(80,60,40,${r() * 0.06})`
    g.fillRect(r() * 600, r() * 820, 1.5, 1.5)
  }
  g.fillStyle = '#c4653e'
  g.beginPath()
  g.arc(470, 150, 70, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#231b16'
  g.font = 'italic 300 84px Fraunces'
  g.fillText('make it', 56, 380)
  g.fillText('work,', 56, 462)
  g.font = '400 84px Fraunces'
  g.fillText('right,', 56, 560)
  g.font = '600 84px Fraunces'
  g.fillText('fast.', 56, 658)
  g.font = '400 20px "JetBrains Mono"'
  g.fillStyle = '#5b4d40'
  g.fillText('— KENT BECK', 58, 750)
  g.fillText('No. 01', 470, 750)
  return toTexture(c)
}

export function certTexture(title, issuer) {
  const [c, g] = makeCanvas(512, 390)
  g.fillStyle = '#f2ebdb'
  g.fillRect(0, 0, 512, 390)
  g.strokeStyle = '#b38c4d'
  g.lineWidth = 6
  g.strokeRect(14, 14, 484, 362)
  g.lineWidth = 1.5
  g.strokeRect(26, 26, 460, 338)
  g.fillStyle = '#7d6a54'
  g.font = '500 16px "JetBrains Mono"'
  g.textAlign = 'center'
  g.fillText('C E R T I F I C A T E', 256, 78)
  g.fillStyle = '#2a211a'
  g.font = '400 38px Fraunces'
  const end = wrap(g, title, 256, 150, 400, 44)
  g.font = 'italic 400 24px Fraunces'
  g.fillStyle = '#5b4d40'
  g.fillText('awarded to Syed Ibrahim Khaliulla', 256, end + 52)
  g.font = '500 20px "JetBrains Mono"'
  g.fillStyle = '#2a211a'
  g.fillText(issuer.toUpperCase(), 256, 328)
  g.fillStyle = '#d29a4c'
  g.beginPath()
  g.arc(440, 320, 24, 0, Math.PI * 2)
  g.fill()
  return toTexture(c)
}

export function notebookTexture(entries) {
  const W = 1200
  const H = 800
  const [c, g] = makeCanvas(W, H)
  const r = rand(5)
  g.fillStyle = '#efe5cf'
  g.fillRect(0, 0, W, H)
  // ruled lines
  g.strokeStyle = 'rgba(70,110,170,0.22)'
  g.lineWidth = 2
  for (let y = 120; y < H - 30; y += 44) {
    g.beginPath()
    g.moveTo(30, y)
    g.lineTo(W - 30, y)
    g.stroke()
  }
  g.strokeStyle = 'rgba(200,70,70,0.25)'
  g.beginPath()
  g.moveTo(92, 20)
  g.lineTo(92, H - 20)
  g.stroke()
  // spine shadow
  const sp = g.createLinearGradient(W / 2 - 60, 0, W / 2 + 60, 0)
  sp.addColorStop(0, 'rgba(60,40,20,0)')
  sp.addColorStop(0.5, 'rgba(60,40,20,0.28)')
  sp.addColorStop(1, 'rgba(60,40,20,0)')
  g.fillStyle = sp
  g.fillRect(W / 2 - 60, 0, 120, H)

  const ink = '#1d2846'
  const hand = (text, x, y, size = 46, color = ink) => {
    g.save()
    g.translate(x, y)
    g.rotate((r() - 0.5) * 0.03)
    g.font = `600 ${size}px Caveat`
    g.fillStyle = color
    g.fillText(text, 0, 0)
    g.restore()
  }

  hand("where I've been", 110, 100, 60)
  g.strokeStyle = ink
  g.lineWidth = 3
  g.beginPath()
  for (let x = 110; x < 440; x += 6) g.lineTo(x, 116 + Math.sin(x * 0.09) * 3)
  g.stroke()

  const slots = [
    [110, 205],
    [110, 469],
    [W / 2 + 60, 205],
  ]
  entries.slice(0, 3).forEach((e, i) => {
    const [x, y] = slots[i]
    hand(e.company, x, y, 54)
    hand(e.period, x, y + 44, 38, '#8a3a2a')
    e.note.forEach((n, k) => hand('— ' + n, x + 10, y + 88 + k * 44, 40))
  })

  // margin doodles
  hand('next: ship more', W / 2 + 70, 560, 44, '#8a3a2a')
  g.strokeStyle = '#8a3a2a'
  g.lineWidth = 3
  g.beginPath()
  g.ellipse(W / 2 + 200, 545, 150, 40, -0.04, 0, Math.PI * 2)
  g.stroke()
  hand('8.68', W - 200, 700, 54)
  hand('cgpa ^', W - 196, 740, 32, '#8a3a2a')
  return toTexture(c)
}

export function phoneTexture() {
  const [c, g] = makeCanvas(360, 770)
  const bg = g.createLinearGradient(0, 0, 0, 770)
  bg.addColorStop(0, '#1a1520')
  bg.addColorStop(1, '#3a2418')
  g.fillStyle = bg
  g.fillRect(0, 0, 360, 770)
  const now = new Date()
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })
  g.textAlign = 'center'
  g.fillStyle = '#efe6d8'
  g.font = '300 104px Fraunces'
  g.fillText(time, 180, 190)
  g.font = '400 20px "Instrument Sans"'
  g.fillStyle = '#c9bdad'
  g.fillText(date, 180, 228)
  // notification card
  g.textAlign = 'left'
  g.fillStyle = 'rgba(255,255,255,0.12)'
  g.beginPath()
  g.roundRect(22, 300, 316, 128, 22)
  g.fill()
  g.fillStyle = '#e39a54'
  g.beginPath()
  g.roundRect(40, 320, 34, 34, 9)
  g.fill()
  g.font = '500 15px "JetBrains Mono"'
  g.fillStyle = '#b6aa9a'
  g.fillText('MESSAGES · now', 86, 343)
  g.font = '600 21px "Instrument Sans"'
  g.fillStyle = '#efe6d8'
  g.fillText('You?', 40, 385)
  g.font = '400 19px "Instrument Sans"'
  g.fillStyle = '#d7cdbf'
  g.fillText('Hey Ibrahim, got a minute to talk?', 40, 412)
  g.textAlign = 'center'
  g.font = '500 18px "JetBrains Mono"'
  g.fillStyle = '#efe6d8'
  g.fillText('+91 84649 55637', 180, 690)
  g.fillStyle = 'rgba(239,230,216,0.6)'
  g.beginPath()
  g.roundRect(120, 740, 120, 6, 3)
  g.fill()
  return toTexture(c)
}

export function stickyTexture(text, color) {
  const [c, g] = makeCanvas(256, 256)
  g.fillStyle = color
  g.fillRect(0, 0, 256, 256)
  const sh = g.createLinearGradient(0, 160, 0, 256)
  sh.addColorStop(0, 'rgba(0,0,0,0)')
  sh.addColorStop(1, 'rgba(0,0,0,0.12)')
  g.fillStyle = sh
  g.fillRect(0, 0, 256, 256)
  g.fillStyle = '#2b2a28'
  g.font = '600 54px Caveat'
  g.textAlign = 'center'
  text.split('\n').forEach((l, i) => g.fillText(l, 128, 110 + i * 56))
  return toTexture(c)
}

export function steamTexture() {
  const [c, g] = makeCanvas(128, 256)
  const r = rand(2)
  for (let i = 0; i < 26; i++) {
    const x = 64 + (r() - 0.5) * 40
    const y = 40 + r() * 180
    const rad = 14 + r() * 26
    const grd = g.createRadialGradient(x, y, 0, x, y, rad)
    grd.addColorStop(0, 'rgba(255,255,255,0.22)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 256)
  }
  return toTexture(c)
}
