import { useEffect, useRef, useState } from 'react'

// ---- Tweak these ----
const AUTO_CYCLE = true // auto-advance the open panel
const MOTION = 1 // animation speed multiplier (0.4 – 1.6)
// ---------------------

const Icon = ({ d }) => (
  <svg width="30" height="30" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
)

const DOMAINS = [
  {
    title: 'Microcontrollers',
    desc: 'Hardware systems programming, sensory device telemetry, and low-latency component interactions.',
    icon: [
      'M64 48h128a16 16 0 0 1 16 16v128a16 16 0 0 1-16 16H64a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16z',
      'M96 96h64v64H96z',
      'M104 24v24M152 24v24M104 208v24M152 208v24M24 104h24M24 152h24M208 104h24M208 152h24',
    ],
  },
  {
    title: 'Image Processing',
    desc: 'Computer vision tracking logic arrays, visual computational filters, and detection algorithms.',
    icon: [
      'M128 56C48 56 16 128 16 128s32 72 112 72 112-72 112-72-32-72-112-72z',
      'M128 88a40 40 0 1 1 0 80 40 40 0 0 1 0-80z',
    ],
  },
  {
    title: 'Robot Operating System',
    desc: 'Simulating automated architectures, designing distributed node networks, and robot software infrastructure.',
    icon: [
      'M104 32h48v40h-48zM40 176h48v40H40zM168 176h48v40h-48z',
      'M128 72v48M64 176v-24a16 16 0 0 1 16-16h96a16 16 0 0 1 16 16v24M128 120v16',
    ],
  },
  {
    title: 'Kinematics & Control',
    desc: 'Mathematical modeling equations, trajectory logic, and structural state calculations.',
    icon: [
      'M32 184c0-72 40-112 96-112s96 40 96 112',
      'M20 172h24v24H20zM212 172h24v24h-24zM116 60h24v24h-24z',
      'M40 72h76M140 72h76',
    ],
  },
]

// ---- canvas scenes (ported 1:1 from the design) ----
const C = (a) => 'rgba(79,224,244,' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'
const L = (a) => 'rgba(142,238,251,' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'
const MONO = '10px ui-monospace, Menlo, monospace'
const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647
const region = (h) => {
  const top = 64
  const bot = Math.max(top + 120, h - 230)
  return { top, bot, cy: (top + bot) / 2 }
}
const brackets = (ctx, x, y, w, h, k) => {
  ctx.beginPath()
  ;[
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ].forEach(([px, py, sx, sy]) => {
    ctx.moveTo(px + sx * k, py)
    ctx.lineTo(px, py)
    ctx.lineTo(px, py + sy * k)
  })
  ctx.stroke()
}
const along = (pts, d) => {
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const l = Math.hypot(bx - ax, by - ay)
    if (d <= l) return [ax + ((bx - ax) * d) / l, ay + ((by - ay) * d) / l]
    d -= l
  }
  return pts[pts.length - 1]
}

const SCENES = [
  function mcu(ctx, w, h, t) {
    const { top, bot, cy } = region(h)
    const cx = w / 2
    const s = Math.max(26, Math.min(w * 0.12, (bot - top) * 0.2))
    const R = seeded(11)
    const dirs = [
      [0, -1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, -1, 0],
      [-1, 0, 0, -1],
    ]
    ctx.lineWidth = 1
    dirs.forEach(([ox, oy, qx, qy]) => {
      for (let k = 0; k < 4; k++) {
        const off = (k - 1.5) * s * 0.42
        const sg = R() < 0.5 ? -1 : 1
        const d1 = 14 + R() * 50
        const d2 = 12 + R() * 46
        const p0 = [cx + ox * s + qx * off, cy + oy * s + qy * off]
        const p1 = [p0[0] + ox * d1, p0[1] + oy * d1]
        const p2 = [p1[0] + (ox + qx * sg) * d2, p1[1] + (oy + qy * sg) * d2]
        const p3 = [p2[0] + ox * 700, p2[1] + oy * 700]
        const pts = [p0, p1, p2, p3]
        ctx.strokeStyle = C(0.13)
        ctx.beginPath()
        pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
        ctx.stroke()
        ctx.fillStyle = C(0.35)
        ctx.beginPath()
        ctx.arc(p2[0], p2[1], 2, 0, 6.283)
        ctx.fill()
        const total = d1 + d2 * 1.414 + 700
        const ph = R()
        const u = (t / 7000 + ph) % 1
        const head = total * (1 - u)
        const tail = Math.min(total, head + 40)
        if (head < 360) {
          const a = along(pts, head)
          const b = along(pts, tail)
          const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1])
          g.addColorStop(0, L(0.9))
          g.addColorStop(1, L(0))
          ctx.strokeStyle = g
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(a[0], a[1])
          ctx.lineTo(b[0], b[1])
          ctx.stroke()
          ctx.lineWidth = 1
        }
      }
    })
    const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 2.6)
    gl.addColorStop(0, C(0.12 + 0.05 * Math.sin(t / 1400)))
    gl.addColorStop(1, C(0))
    ctx.fillStyle = gl
    ctx.fillRect(cx - s * 3, cy - s * 3, s * 6, s * 6)
    ctx.fillStyle = 'rgba(7,13,18,0.95)'
    ctx.strokeStyle = C(0.6)
    ctx.beginPath()
    ctx.roundRect(cx - s, cy - s, s * 2, s * 2, 6)
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = C(0.25)
    ctx.strokeRect(cx - s * 0.55, cy - s * 0.55, s * 1.1, s * 1.1)
    ctx.fillStyle = L(0.8)
    ctx.font = MONO
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('MCU', cx, cy)
  },
  function vision(ctx, w, h, t, m) {
    const { top, bot } = region(h)
    const sp = 22
    const sy = top + ((t / 6500) % 1) * (bot - top)
    for (let y = top; y <= bot; y += sp) {
      const k = Math.max(0, 1 - Math.abs(y - sy) / 46)
      ctx.fillStyle = C(0.1 + k * 0.6)
      for (let x = sp / 2; x < w; x += sp) ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4)
    }
    const g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, C(0))
    g.addColorStop(0.5, C(0.45))
    g.addColorStop(1, C(0))
    ctx.fillStyle = g
    ctx.fillRect(0, sy, w, 1)
    ctx.font = MONO
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.lineWidth = 1.2
    ;[
      [0.18, 0.12, 0.3, 0.38, 'person', 0.94],
      [0.6, 0.5, 0.24, 0.32, 'bottle', 0.87],
      [0.56, 0.08, 0.2, 0.22, 'cup', 0.78],
    ].forEach(([bx, by, bw, bh, lb, cf], i) => {
      const x = (bx + 0.03 * Math.sin(t / 3400 + i * 2)) * w
      const y = top + (by + 0.03 * Math.cos(t / 3900 + i)) * (bot - top)
      const W = bw * w
      const H = bh * (bot - top)
      ctx.strokeStyle = C(0.7)
      brackets(ctx, x, y, W, H, 10)
      ctx.fillStyle = L(0.75)
      ctx.fillText(lb + ' ' + (cf - 0.02 + 0.02 * Math.sin(t / 900 + i)).toFixed(2), x, y - 5)
    })
    if (m) {
      ctx.strokeStyle = L(0.9)
      brackets(ctx, m.x - 34, m.y - 34, 68, 68, 12)
      ctx.fillStyle = L(0.9)
      ctx.fillText('track', m.x - 34, m.y - 39)
    }
  },
  function ros(ctx, w, h, t) {
    const { top, bot } = region(h)
    const H = bot - top
    const N = [
      [0.22, 0.06, '/camera'],
      [0.78, 0.06, '/lidar'],
      [0.5, 0.34, '/perception'],
      [0.24, 0.64, '/planner'],
      [0.76, 0.64, '/controller'],
      [0.5, 0.96, '/base'],
    ].map(([x, y, n]) => ({ x: x * w, y: top + y * H, n }))
    const E = [
      [0, 2],
      [1, 2],
      [2, 3],
      [1, 3],
      [3, 4],
      [4, 5],
      [2, 4],
    ]
    ctx.lineWidth = 1
    E.forEach(([a, b], i) => {
      const A = N[a]
      const B = N[b]
      ctx.strokeStyle = C(0.18)
      ctx.beginPath()
      ctx.moveTo(A.x, A.y)
      ctx.lineTo(B.x, B.y)
      ctx.stroke()
      const u = (t / 3600 + i * 0.37) % 1
      const x = A.x + (B.x - A.x) * u
      const y = A.y + (B.y - A.y) * u
      const gl = ctx.createRadialGradient(x, y, 0, x, y, 7)
      gl.addColorStop(0, L(0.95))
      gl.addColorStop(1, L(0))
      ctx.fillStyle = gl
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, 6.283)
      ctx.fill()
    })
    ctx.font = MONO
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    N.forEach((p, i) => {
      const tw = ctx.measureText(p.n).width + 18
      ctx.fillStyle = 'rgba(7,13,18,0.95)'
      ctx.strokeStyle = C(0.4 + 0.2 * Math.sin(t / 1600 + i))
      ctx.beginPath()
      ctx.roundRect(p.x - tw / 2, p.y - 11, tw, 22, 11)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = L(0.85)
      ctx.fillText(p.n, p.x, p.y + 1)
    })
  },
  function kin(ctx, w, h, t, m) {
    const { top, bot, cy } = region(h)
    const bx = w / 2
    const by = cy + 10
    const l1 = Math.max(42, Math.min(w * 0.25, (bot - top) * 0.35))
    const l2 = l1 * 0.9
    const st = this.kin || (this.kin = { x: bx, y: by - l1, trail: [] })
    let tx = bx + Math.sin(t / 2600) * l1 * 1.2
    let ty = by + Math.sin(t / 1700) * l1 * 1.1
    if (m) {
      tx = m.x
      ty = m.y
    }
    st.x += (tx - st.x) * 0.06
    st.y += (ty - st.y) * 0.06
    const dx = st.x - bx
    const dy = st.y - by
    let d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1)
    d = Math.max(d, Math.abs(l1 - l2) + 1)
    const a = Math.atan2(dy, dx)
    const q2 = Math.acos((d * d - l1 * l1 - l2 * l2) / (2 * l1 * l2))
    const q1 = a - Math.atan2(l2 * Math.sin(q2), l1 + l2 * Math.cos(q2))
    const ex = bx + Math.cos(q1) * l1
    const ey = by + Math.sin(q1) * l1
    const fx = ex + Math.cos(q1 + q2) * l2
    const fy = ey + Math.sin(q1 + q2) * l2
    st.trail.push([fx, fy])
    if (st.trail.length > 90) st.trail.shift()
    ctx.setLineDash([2, 6])
    ctx.strokeStyle = C(0.14)
    ctx.beginPath()
    ctx.arc(bx, by, l1 + l2, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])
    for (let i = 1; i < st.trail.length; i++) {
      ctx.strokeStyle = C((i / st.trail.length) * 0.5)
      ctx.beginPath()
      ctx.moveTo(st.trail[i - 1][0], st.trail[i - 1][1])
      ctx.lineTo(st.trail[i][0], st.trail[i][1])
      ctx.stroke()
    }
    ctx.strokeStyle = L(0.85)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.lineTo(ex, ey)
    ctx.lineTo(fx, fy)
    ctx.stroke()
    ctx.lineWidth = 1
    ;[
      [bx, by, 6],
      [ex, ey, 5],
      [fx, fy, 4],
    ].forEach(([x, y, r]) => {
      ctx.fillStyle = 'rgba(7,13,18,1)'
      ctx.strokeStyle = C(0.9)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, 6.283)
      ctx.fill()
      ctx.stroke()
    })
    ctx.strokeStyle = C(0.5)
    ctx.beginPath()
    ctx.moveTo(tx - 8, ty)
    ctx.lineTo(tx + 8, ty)
    ctx.moveTo(tx, ty - 8)
    ctx.lineTo(tx, ty + 8)
    ctx.stroke()
    ctx.font = MONO
    ctx.fillStyle = L(0.7)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('θ1 ' + (-q1 * 57.3).toFixed(1) + '°   θ2 ' + (q2 * 57.3).toFixed(1) + '°', 20, top - 8 + 0 * h)
  },
]

const CSS = `
.ras-focus{
  --color-bg:#05080c;--color-surface:#0a131a;--color-text:#e6f2f6;--color-accent:#1fd1ec;
  --color-accent-100:#c9f6fd;--color-accent-200:#8eeefb;--color-accent-300:#4fe0f4;
  --color-accent-500:#1fd1ec;--color-accent-700:#0c6f80;--color-accent-800:#0a3f4a;--color-accent-900:#08242b;
  --color-neutral-100:#e6f2f6;--color-neutral-200:#c3d2d9;--color-neutral-300:#9aabb4;--color-neutral-400:#73858f;
  --color-neutral-500:#4f616b;--color-neutral-600:#2c3c45;--color-neutral-700:#16242d;--color-neutral-800:#0d1820;--color-neutral-900:#070d12;
  --font-heading:var(--font-quantico);--font-body:var(--font-quantico);
  background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);
}
`

export default function FocusDomains() {
  const rootRef = useRef(null)
  const cvs = useRef([null, null, null, null])
  const mouse = useRef({ x: -9999, y: -9999 })
  const hovering = useRef(false)
  const sceneState = useRef({})
  const [active, setActive] = useState(0)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 600))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('pointermove', onMove)
    const timer = setInterval(() => {
      if (AUTO_CYCLE && !hovering.current) setActive((a) => (a + 1) % 4)
    }, 4000)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Only animate while the section is on screen (first frame always draws)
    let visible = false
    let running = true
    const tick = (now) => {
      const t = now * MOTION
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cvs.current.forEach((cv, i) => {
        if (!cv) return
        const w = cv.clientWidth
        const h = cv.clientHeight
        if (!w || !h) return
        if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
          cv.width = Math.round(w * dpr)
          cv.height = Math.round(h * dpr)
        }
        const ctx = cv.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)
        const rc = cv.getBoundingClientRect()
        const mx = mouse.current.x - rc.left
        const my = mouse.current.y - rc.top
        SCENES[i].call(sceneState.current, ctx, w, h, still ? 0 : t, mx >= 0 && my >= 0 && mx <= w && my <= h ? { x: mx, y: my } : null)
      })
      if (!still && visible) raf = requestAnimationFrame(tick)
      else running = false
    }
    raf = requestAnimationFrame(tick)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !running && !still) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    })
    io.observe(rootRef.current)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      clearInterval(timer)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <section
      id="domains"
      ref={rootRef}
      className="ras-focus"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(90% 70% at 20% 0%, var(--color-neutral-800) 0%, var(--color-bg) 60%)',
      }}
    >
      <style>{CSS}</style>
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '96px 48px 80px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '56px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'clamp(40px,5.5vw,68px)',
              lineHeight: 1,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Our Focus <span style={{ color: 'var(--color-accent)' }}>Domains</span>
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: '640px',
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--color-neutral-300)',
              textWrap: 'pretty',
            }}
          >
            Exploring core technical areas and computational tracks driven by our members.
          </p>
        </div>

        <div
          onMouseEnter={() => {
            hovering.current = true
          }}
          onMouseLeave={() => {
            hovering.current = false
          }}
          style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', gap: '18px' }}
        >
          {DOMAINS.map((d, i) => {
            const on = i === active
            const select = () => {
              if (active !== i) setActive(i)
            }
            const delay = on ? '300ms' : '0ms'
            return (
              <div
                key={d.title}
                onMouseEnter={select}
                onClick={select}
                style={{
                  position: 'relative',
                  flex: narrow ? '0 0 auto' : on ? '4 1 0' : '1 1 0',
                  minWidth: 0,
                  height: narrow ? (on ? '460px' : '84px') : '560px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid ' + (on ? 'var(--color-accent-700)' : 'var(--color-neutral-700)'),
                  boxShadow: on ? '0 0 80px -40px var(--color-accent)' : 'none',
                  background: 'linear-gradient(180deg, var(--color-neutral-900) 0%, var(--color-bg) 100%)',
                  cursor: 'pointer',
                  transition:
                    'flex 800ms cubic-bezier(.2,.8,.2,1), height 700ms cubic-bezier(.2,.8,.2,1), border-color 500ms, box-shadow 500ms',
                }}
              >
                <canvas
                  ref={(el) => {
                    cvs.current[i] = el
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: on ? 1 : 0.28,
                    transition: 'opacity 700ms',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 'auto 0 0 0',
                    height: '60%',
                    background: 'linear-gradient(180deg, rgba(5,8,12,0) 0%, rgba(5,8,12,0.92) 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '28px',
                    fontFamily: 'ui-monospace,Menlo,monospace',
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    color: on ? 'var(--color-accent)' : 'var(--color-neutral-500)',
                    transition: 'color 500ms',
                  }}
                >
                  {'0' + (i + 1)}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: narrow ? '84px' : '26px',
                    bottom: '32px',
                    writingMode: narrow ? 'horizontal-tb' : 'vertical-rl',
                    transform: narrow ? 'none' : 'rotate(180deg)',
                    opacity: on ? 0 : 1,
                    transition: 'opacity 400ms',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '15px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: 'var(--color-neutral-200)',
                    pointerEvents: 'none',
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: '32px',
                    bottom: '32px',
                    width: '380px',
                    maxWidth: 'calc(100% - 64px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    opacity: on ? 1 : 0,
                    transform: on ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 500ms ${delay}, transform 600ms ${delay}`,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ color: 'var(--color-accent)', display: 'flex' }}>
                    <Icon d={d.icon} />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: '28px',
                      lineHeight: 1.15,
                      letterSpacing: '0.01em',
                      color: 'var(--color-text)',
                    }}
                  >
                    {d.title}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: 'var(--color-neutral-300)',
                      textWrap: 'pretty',
                    }}
                  >
                    {d.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}