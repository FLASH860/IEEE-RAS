import { useEffect, useRef, useState } from 'react'
import './DomainHeads.css'

// ---- Tweak these ----
const ANGLE = 50 // side-card tilt, degrees
const CARD_W = 270 // px
const GAP = 32 // px
const LOOP = true
const CENTER_SCALE = 1.1 // how much bigger the active card is
const BACKGROUND = true // animated node background
// ---------------------

// [name, role, domain, photo]. Put photos in public/assets/team/ and use '/assets/team/name.jpg'
const HEADS = [
  ['Member Name', 'Domain Head', 'Microcontrollers', null],
  ['Member Name', 'Domain Head', 'Microcontrollers', null],
  ['Member Name', 'Domain Head', 'Image Processing', null],
  ['Member Name', 'Domain Head', 'Image Processing', null],
  ['Member Name', 'Domain Head', 'Robot Operating System', null],
  ['Member Name', 'Domain Head', 'Robot Operating System', null],
  ['Member Name', 'Domain Head', 'Kinematics & Control', null],
  ['Member Name', 'Domain Head', 'Kinematics & Control', null],
]

const P = 1100 // perspective, px
const CARD_H = Math.round(CARD_W * 1.42)

export default function DomainHeads() {
  const [active, setActive] = useState(0)
  const bgRef = useRef(null)
  const dragX = useRef(null)
  const inView = useRef(false)
  const n = HEADS.length

  const go = (d) =>
    setActive((a) => (LOOP ? (a + d + n) % n : Math.max(0, Math.min(n - 1, a + d))))

  // Arrow keys, only while this section is on screen
  useEffect(() => {
    const onKey = (e) => {
      if (!inView.current) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Background: drifting nodes + lines that react to the pointer
  useEffect(() => {
    const cv = bgRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let pts = []
    let raf = 0
    let visible = false
    const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false }

    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      m.x = e.clientX - r.left
      m.y = e.clientY - r.top
      if (!m.on) {
        m.sx = m.x
        m.sy = m.y
      }
      m.on = true
    }
    const onLeave = () => {
      m.on = false
    }
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)

    const resize = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(70, (w * h) / 22000))
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.4,
        p: Math.random() * 6.28,
      }))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const tick = (t) => {
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      let gx = w * (0.5 + 0.18 * Math.sin(t / 9000))
      let gy = h * (0.48 + 0.1 * Math.cos(t / 11000))
      if (m.on) {
        m.sx += (m.x - m.sx) * 0.06
        m.sy += (m.y - m.sy) * 0.06
        gx += (m.sx - gx) * 0.35
        gy += (m.sy - gy) * 0.35
      }
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.45)
      g.addColorStop(0, 'rgba(31,209,236,0.07)')
      g.addColorStop(1, 'rgba(31,209,236,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      for (const a of pts) {
        if (still) continue
        if (a.ox == null) {
          a.ox = 0
          a.oy = 0
        }
        if (m.on) {
          const dx = a.x + a.ox - m.sx
          const dy = a.y + a.oy - m.sy
          const d = Math.hypot(dx, dy)
          if (d < 160 && d > 0.1) {
            const k = (1 - d / 160) * 1.4
            a.ox += (dx / d) * k
            a.oy += (dy / d) * k
          }
        }
        a.ox *= 0.92
        a.oy *= 0.92
        a.x = (a.x + a.vx + w) % w
        a.y = (a.y + a.vy + h) % h
      }

      const Q = pts.map((a) => ({ x: a.x + (a.ox || 0), y: a.y + (a.oy || 0), r: a.r, p: a.p }))
      ctx.lineWidth = 0.6
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = Q[i]
          const b = Q[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 150) {
            const boost = m.on
              ? 2 * Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - m.sx, (a.y + b.y) / 2 - m.sy) / 220)
              : 0
            ctx.strokeStyle = 'rgba(79,224,244,' + (0.09 * (1 - d / 150) * (1 + boost)).toFixed(3) + ')'
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      if (m.on) {
        for (const a of Q) {
          const d = Math.hypot(a.x - m.sx, a.y - m.sy)
          if (d < 220) {
            ctx.strokeStyle = 'rgba(79,224,244,' + (0.22 * (1 - d / 220)).toFixed(3) + ')'
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(m.sx, m.sy)
            ctx.stroke()
          }
        }
      }
      for (const a of Q) {
        const near = m.on ? Math.max(0, 1 - Math.hypot(a.x - m.sx, a.y - m.sy) / 220) : 0
        const tw = 0.35 + 0.3 * Math.sin(t / 1400 + a.p)
        ctx.fillStyle = 'rgba(142,238,251,' + Math.min(1, tw + near * 0.5).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r + near * 1.2, 0, 6.283)
        ctx.fill()
      }
      if (!still) raf = requestAnimationFrame(tick)
    }

    // Only animate while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      inView.current = visible
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(tick)
    })
    io.observe(cv)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Side cards: inner edge sits at z=0, outer edge swings toward the viewer
  const th = (ANGLE * Math.PI) / 180
  const cos = Math.cos(th)
  const sin = Math.sin(th)
  const lefts = [0, CARD_W / 2 + GAP]
  for (let k = 2; k <= 4; k++) {
    lefts[k] = ((lefts[k - 1] + CARD_W * cos) * P) / (P - CARD_W * sin) + GAP
  }
  const place = (off) => {
    const k = Math.abs(off)
    const s = Math.sign(off)
    if (k === 0) return `translate3d(0px,0px,0px) rotateY(0deg) scale(${CENTER_SCALE})`
    const x = s * (lefts[Math.min(k, 4)] + (CARD_W / 2) * cos)
    const z = (CARD_W / 2) * sin
    return `translate3d(${x.toFixed(1)}px,0px,${z.toFixed(1)}px) rotateY(${(-s * ANGLE).toFixed(2)}deg)`
  }

  return (
    <section id="team" className="cc">
      <canvas
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: BACKGROUND ? 1 : 0,
          transition: 'opacity 600ms',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-3)',
          padding: 'var(--space-6) var(--space-6) 0',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            fontSize: 24,
            letterSpacing: '-0.01em',
          }}
        >
          Domain Heads
        </h1>
        <span style={{ fontSize: 13, color: 'var(--color-neutral-300)' }}>
          {active + 1} / {n}
        </span>
      </div>

      <div
        onPointerDown={(e) => {
          dragX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (dragX.current == null) return
          const d = e.clientX - dragX.current
          dragX.current = null
          if (Math.abs(d) > 40) go(d < 0 ? 1 : -1)
        }}
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          minHeight: 497,
          perspective: P,
          perspectiveOrigin: '50% 50%',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
      >
        {HEADS.map(([name, role, domain, photo], i) => {
          let off = i - active
          if (LOOP) {
            off = ((off % n) + n) % n
            if (off > n / 2) off -= n
          }
          const k = Math.abs(off)
          const vis = k <= 2
          const shade = k === 0 ? 0 : k === 1 ? 0.28 : 0.52

          return (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                position: 'absolute',
                left: `calc(50% - ${CARD_W / 2}px)`,
                top: `calc(50% - ${CARD_H / 2}px)`,
                width: CARD_W,
                height: CARD_H,
                transform: place(Math.max(-3, Math.min(3, off))),
                opacity: vis ? 1 : 0,
                zIndex: 10 - k,
                pointerEvents: vis ? 'auto' : 'none',
                transition: 'transform 520ms cubic-bezier(.2,.8,.2,1), opacity 400ms ease',
                cursor: 'pointer',
              }}
            >
              <div
                className="card"
                style={{
                  position: 'relative',
                  boxSizing: 'border-box',
                  height: '100%',
                  padding: 'var(--space-4)',
                  gap: 'var(--space-2)',
                  background:
                    'linear-gradient(165deg, var(--color-neutral-700) 0%, var(--color-surface) 55%, var(--color-neutral-900) 100%)',
                  border: `1px solid ${k === 0 ? 'var(--color-accent)' : 'var(--color-neutral-700)'}`,
                  boxShadow:
                    k === 0 ? '0 0 48px -12px var(--color-accent), var(--shadow-lg)' : 'var(--shadow-md)',
                  overflow: 'hidden',
                  transition: 'border-color 400ms, box-shadow 400ms',
                }}
              >
                {photo && (
                  <>
                    <img
                      src={photo}
                      alt=""
                      draggable="false"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(5,8,12,0.92) 0%, rgba(5,8,12,0.25) 55%, transparent 100%)',
                      }}
                    />
                  </>
                )}
                <div className="card-kicker">{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1 }} />
                <div className="card-title" style={{ fontSize: 24 }}>
                  {name}
                </div>
                <p className="card-body" style={{ flex: 0 }}>
                  {role}
                </p>
                <div className="card-meta">
                  <span>{domain}</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--color-bg)',
                    opacity: shade,
                    transition: 'opacity 520ms',
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          padding: '0 var(--space-6) var(--space-6)',
        }}
      >
        <button className="btn btn-secondary btn-icon" onClick={() => go(-1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z" />
          </svg>
        </button>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {HEADS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label="Go to card"
              style={{
                width: i === active ? 20 : 6,
                height: 4,
                padding: 0,
                border: 0,
                borderRadius: 2,
                background: i === active ? 'var(--color-accent)' : 'var(--color-neutral-600)',
                cursor: 'pointer',
                transition: 'width 300ms, background 300ms',
              }}
            />
          ))}
        </div>
        <button className="btn btn-secondary btn-icon" onClick={() => go(1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="m181.66 133.66-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32Z" />
          </svg>
        </button>
      </div>
    </section>
  )
}