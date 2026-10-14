import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { makeCanvas, toTexture, stickyTexture } from './textures.js'
import Hot from './Hot.jsx'
import { nav } from '../lib/bus.js'

// The monitor shows real-looking source for whichever project is hovered in the Work list.
const FILES = [
  {
    folder: 'cravings',
    file: 'OrderDAOImpl.java',
    lang: 'Java',
    code: `public class OrderDAOImpl implements OrderDAO {

    private static final String INSERT_ORDER =
        "INSERT INTO orders (user_id, restaurant_id, total) VALUES (?, ?, ?)";

    @Override
    public int placeOrder(Order order) {
        try (Connection con = DBConnection.get();
             PreparedStatement ps = con.prepareStatement(INSERT_ORDER)) {
            ps.setInt(1, order.getUserId());
            ps.setInt(2, order.getRestaurantId());
            ps.setDouble(3, order.getTotal());
            return ps.executeUpdate();
        } catch (SQLException e) {
            throw new DataAccessException("order failed", e);
        }
    }
}`,
  },
  {
    folder: 'spring-crud',
    file: 'ProductController.java',
    lang: 'Java',
    code: `@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    @GetMapping
    public List<Product> all() {
        return repo.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product p) {
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}`,
  },
  {
    folder: 'ai-chatbot',
    file: 'app.py',
    lang: 'Python',
    code: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    prompt = request.json["message"]

    if prompt.startswith("/image"):
        img = client.images.generate(prompt=prompt[7:])
        return jsonify(type="image", url=img.data[0].url)

    reply = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return jsonify(type="text", text=reply.choices[0].message.content)`,
  },
]

const KW = new Set(
  'public private static final class implements interface return try catch throw new int void long double def if else for in from import as true false None'.split(
    ' ',
  ),
)
const TOKEN = /(\s+|"[^"]*"?|@\w+|\d+|\w+|[^\w\s])/g

function colorFor(tok) {
  if (tok[0] === '"') return '#a9c48e'
  if (tok[0] === '@') return '#dc8f78'
  if (KW.has(tok)) return '#e6a35c'
  if (/^\d/.test(tok)) return '#d4a5c9'
  if (/^[A-Z]/.test(tok)) return '#8fbacb'
  if (/^\w/.test(tok)) return '#ddd5c8'
  return '#8c8478'
}

function drawEditor(g, active, typed, blink) {
  const W = 1280
  const H = 720
  g.fillStyle = '#16171a'
  g.fillRect(0, 0, W, H)
  // sidebar
  g.fillStyle = '#121315'
  g.fillRect(0, 0, 280, H)
  g.font = '500 15px "JetBrains Mono"'
  g.fillStyle = '#6d665d'
  g.fillText('EXPLORER', 22, 38)
  let y = 80
  FILES.forEach((f, i) => {
    g.fillStyle = '#a39a8d'
    g.font = '400 17px "JetBrains Mono"'
    g.fillText('v ' + f.folder, 22, y)
    y += 32
    if (i === active) {
      g.fillStyle = 'rgba(227,154,84,0.14)'
      g.fillRect(0, y - 22, 280, 31)
    }
    g.fillStyle = i === active ? '#efe6d8' : '#7d766c'
    g.fillText(f.file, 44, y)
    y += 46
  })
  // tabs
  g.fillStyle = '#121315'
  g.fillRect(280, 0, W - 280, 48)
  let tx = 280
  g.font = '400 16px "JetBrains Mono"'
  FILES.forEach((f, i) => {
    const w = g.measureText(f.file).width + 48
    if (i === active) {
      g.fillStyle = '#16171a'
      g.fillRect(tx, 0, w, 48)
      g.fillStyle = '#e39a54'
      g.fillRect(tx, 0, w, 3)
    }
    g.fillStyle = i === active ? '#efe6d8' : '#6d665d'
    g.fillText(f.file, tx + 24, 30)
    tx += w
  })
  // code
  const file = FILES[active]
  const lines = file.code.split('\n')
  g.font = '400 19px "JetBrains Mono"'
  let budget = typed
  let cx = 0
  let cy = 0
  const LH = 29
  for (let li = 0; li < lines.length; li++) {
    const ly = 92 + li * LH
    if (ly > H - 40) break
    g.fillStyle = '#4a453f'
    g.textAlign = 'right'
    g.fillText(String(li + 1), 330, ly)
    g.textAlign = 'left'
    let x = 354
    cy = ly
    cx = x
    if (budget <= 0) break
    for (const tok of lines[li].match(TOKEN) || []) {
      if (budget <= 0) break
      const part = tok.slice(0, budget)
      budget -= part.length
      g.fillStyle = colorFor(tok)
      g.fillText(part, x, ly)
      x += g.measureText(part).width
    }
    cx = x
    budget -= 1 // the newline
  }
  if (blink) {
    g.fillStyle = '#e39a54'
    g.fillRect(cx + 2, cy - 19, 10, 24)
  }
  // status bar
  g.fillStyle = '#1f1a14'
  g.fillRect(0, H - 30, W, 30)
  g.fillStyle = '#c9a77d'
  g.font = '400 14px "JetBrains Mono"'
  g.fillText('main   ' + file.folder, 16, H - 10)
  g.textAlign = 'right'
  g.fillText(file.lang + '   UTF-8   LF', W - 16, H - 10)
  g.textAlign = 'left'
}

export function Monitor({ project }) {
  const { g, texture } = useMemo(() => {
    const [c, g] = makeCanvas(1280, 720)
    return { g, texture: toTexture(c) }
  }, [])
  const notes = useMemo(
    () => [stickyTexture('push to\ngithub!', '#f0d26a'), stickyTexture('drink\nwater', '#eea19c')],
    [],
  )
  const st = useRef({ project, start: performance.now(), typed: -1, blink: null })

  useEffect(() => {
    st.current.project = project
    st.current.start = performance.now()
  }, [project])

  useFrame(() => {
    const s = st.current
    const now = performance.now()
    // canvas uploads are the costly part: cap redraws at ~20 per second
    if (now - (s.drawn || 0) < 50) return
    const total = FILES[s.project].code.length
    const typed = Math.min(total, Math.floor(((now - s.start) / 1000) * 340))
    const blink = Math.floor(now / 530) % 2 === 0
    if (typed !== s.typed || blink !== s.blink) {
      s.typed = typed
      s.blink = blink
      s.drawn = now
      drawEditor(g, s.project, typed, blink)
      texture.needsUpdate = true
    }
  })

  return (
    <group position={[0.15, 0, -0.42]}>
      <Hot label="projects" onClick={() => nav.to(2)}>
        <RoundedBox args={[0.26, 0.012, 0.18]} radius={0.005} position={[0, 0.006, -0.02]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2d" metalness={0.7} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.17, -0.055]} castShadow>
          <boxGeometry args={[0.045, 0.32, 0.022]} />
          <meshStandardMaterial color="#2a2a2d" metalness={0.7} roughness={0.35} />
        </mesh>
        <RoundedBox args={[0.94, 0.55, 0.028]} radius={0.01} position={[0, 0.44, -0.03]} castShadow>
          <meshStandardMaterial color="#111113" metalness={0.4} roughness={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.442, -0.0155]}>
          <planeGeometry args={[0.9, 0.506]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0.405, 0.24, -0.0145]} rotation-z={0.09}>
          <planeGeometry args={[0.075, 0.075]} />
          <meshStandardMaterial map={notes[0]} roughness={0.9} />
        </mesh>
        <mesh position={[-0.41, 0.26, -0.0145]} rotation-z={-0.07}>
          <planeGeometry args={[0.07, 0.07]} />
          <meshStandardMaterial map={notes[1]} roughness={0.9} />
        </mesh>
      </Hot>
      <pointLight position={[0, 0.44, 0.3]} color="#a9b6ff" intensity={0.35} distance={1.5} decay={2} />
    </group>
  )
}

// The laptop runs a short terminal session on a loop.
const SCRIPT = [
  { cmd: 'whoami' },
  { out: 'syed ibrahim khaliulla' },
  { cmd: 'cat stack.txt' },
  { out: 'java  spring-boot  react  mysql  docker' },
  { cmd: 'mvn spring-boot:run' },
  { out: '[INFO] Tomcat started on port 8080', ok: true },
  { out: '[INFO] Started CravingsApplication in 2.41 s', ok: true },
  { cmd: 'git push origin main' },
  { out: 'To github.com:Ibrahimsyed70737/cravings.git' },
  { cmd: '' },
]
const SCRIPT_COST = SCRIPT.reduce((n, l) => n + (l.cmd !== undefined ? l.cmd.length + 6 : 5), 0)

function drawTerminal(g, budget, blink) {
  const W = 1024
  const H = 640
  g.fillStyle = '#0d0e0c'
  g.fillRect(0, 0, W, H)
  g.fillStyle = '#1a1a18'
  g.fillRect(0, 0, W, 40)
  g.font = '400 16px "JetBrains Mono"'
  g.fillStyle = '#7a7368'
  g.textAlign = 'center'
  g.fillText('ibrahim — zsh — 96x28', W / 2, 26)
  g.textAlign = 'left'
  g.font = '400 21px "JetBrains Mono"'
  let y = 86
  let cx = 28
  let cy = y
  for (const l of SCRIPT) {
    if (budget <= 0) break
    if (l.cmd !== undefined) {
      g.fillStyle = '#e39a54'
      g.fillText('ibrahim@desk', 28, y)
      g.fillStyle = '#7a7368'
      const pw = g.measureText('ibrahim@desk').width
      g.fillText(' ~ %', 28 + pw, y)
      const startX = 28 + pw + g.measureText(' ~ % ').width
      const shown = l.cmd.slice(0, Math.max(0, budget))
      g.fillStyle = '#efe6d8'
      g.fillText(shown, startX, y)
      cx = startX + g.measureText(shown).width
      cy = y
      budget -= l.cmd.length + 6
    } else {
      budget -= 5
      if (budget < 0) break
      g.fillStyle = l.ok ? '#9cc48a' : '#a39b8e'
      g.fillText(l.out, 28, y)
    }
    y += 36
  }
  if (blink) {
    g.fillStyle = '#efe6d8'
    g.fillRect(cx + 3, cy - 18, 11, 23)
  }
}

export function Laptop() {
  const { g, texture } = useMemo(() => {
    const [c, g] = makeCanvas(1024, 640)
    return { g, texture: toTexture(c) }
  }, [])
  const st = useRef({ budget: -1, blink: null, start: performance.now() })

  useFrame(() => {
    const s = st.current
    const now = performance.now()
    if (now - (s.drawn || 0) < 60) return
    s.drawn = now
    const t = (now - s.start) / 1000
    let budget = Math.floor(t * 14)
    if (budget > SCRIPT_COST + 50) {
      s.start = now
      budget = 0
    }
    const blink = Math.floor(now / 530) % 2 === 0
    if (budget !== s.budget || blink !== s.blink) {
      s.budget = budget
      s.blink = blink
      drawTerminal(g, budget, blink)
      texture.needsUpdate = true
    }
  })

  return (
    <group position={[-0.86, 0, 0.0]} rotation-y={0.35}>
      <Hot label="projects" onClick={() => nav.to(2)}>
        <RoundedBox args={[0.48, 0.016, 0.33]} radius={0.005} position-y={0.008} castShadow receiveShadow>
          <meshStandardMaterial color="#a2a4a9" metalness={0.75} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0.0163, -0.035]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.42, 0.17]} />
          <meshStandardMaterial color="#26272a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.0163, 0.1]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.14, 0.08]} />
          <meshStandardMaterial color="#8e9095" metalness={0.5} roughness={0.3} />
        </mesh>
        <group position={[0, 0.016, -0.162]} rotation-x={-0.28}>
          <RoundedBox args={[0.48, 0.32, 0.01]} radius={0.004} position={[0, 0.16, -0.005]} castShadow>
            <meshStandardMaterial color="#a2a4a9" metalness={0.75} roughness={0.32} />
          </RoundedBox>
          <mesh position={[0, 0.162, 0.0006]}>
            <planeGeometry args={[0.44, 0.275]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
      </Hot>
    </group>
  )
}
