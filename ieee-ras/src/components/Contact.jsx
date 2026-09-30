import { useEffect, useRef, useState } from 'react'

// ── Edit these ─────────────────────────────────────────────
const FORM_URL = ''
const PHONES = 'Chairperson|+91 00000 00000;Vice Chairperson|+91 00000 00000'
const EMAIL = 'ieeeras@pes.edu'
const INSTAGRAM_URL = 'https://instagram.com/'
const LINKEDIN_URL = 'https://linkedin.com/'
// ───────────────────────────────────────────────────────────

const phoneList = PHONES.split(';')
  .map((s) => s.split('|'))
  .filter((a) => a[1])
  .map(([label, number]) => ({ label: label.trim(), number: number.trim() }))
const phoneHref = 'tel:' + ((PHONES.split(';')[0].split('|')[1] || '').replace(/[^\d+]/g, ''))
const formUrl = FORM_URL || '#'
const links = {
  email: 'mailto:' + EMAIL,
  instagram: INSTAGRAM_URL,
  linkedin: LINKEDIN_URL,
}

const CSS = `
.ras-contact{
  --color-bg:#05080c;--color-surface:#0a131a;--color-text:#e6f2f6;--color-accent:#1fd1ec;
  --color-accent-100:#c9f6fd;--color-accent-200:#8eeefb;--color-accent-300:#4fe0f4;--color-accent-400:#2fd8ef;
  --color-accent-500:#1fd1ec;--color-accent-600:#12a9c0;--color-accent-700:#0c6f80;--color-accent-800:#0a3f4a;--color-accent-900:#08242b;
  --color-neutral-100:#e6f2f6;--color-neutral-200:#c3d2d9;--color-neutral-300:#9aabb4;--color-neutral-400:#73858f;
  --color-neutral-500:#4f616b;--color-neutral-600:#2c3c45;--color-neutral-700:#16242d;--color-neutral-800:#0d1820;--color-neutral-900:#070d12;
  --font-heading:var(--font-quantico);--font-body:var(--font-quantico);
  background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);
}
.ras-contact a{color:var(--color-accent-300)}
.ras-contact a:hover{color:var(--color-accent-200)}
@keyframes packet{from{stroke-dashoffset:92}to{stroke-dashoffset:0}}
@keyframes ping{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.9);opacity:0}}
.ras-contact .btn-primary{transition:background 200ms, box-shadow 200ms}
.ras-contact .btn-primary:hover{background:var(--color-accent-300)!important;color:var(--color-bg)!important;box-shadow:0 0 32px -6px var(--color-accent)}
.ras-contact .btn-ghost{transition:border-color 200ms, background 200ms}
.ras-contact .btn-ghost:hover{border-color:var(--color-accent)!important;background:var(--color-accent-900)!important;color:var(--color-accent)!important}
.ras-contact .hub-core{transition:box-shadow 300ms}
.ras-contact .hub-core:hover{box-shadow:0 0 80px -4px var(--color-accent)!important}
.ras-contact .close-btn:hover{border-color:var(--color-accent)!important;color:var(--color-text)!important}
`

export default function Contact() {
  const bgRef = useRef(null)
  const [hover, setHover] = useState(null)
  const [phoneOpen, setPhoneOpen] = useState(false)

  // ── background canvas (ported 1:1 from the design) ──
  useEffect(() => {
    const cv = bgRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const C = (a, rgb = '31,209,236') => 'rgba(' + rgb + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'
    let w = 0
    let h = 0
    let raf
    const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false, k: 0 }
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
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    // Only animate while the section is on screen (first frame always draws)
    let visible = false
    let running = true
    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      m.k += ((m.on ? 1 : 0) - m.k) * 0.05
      m.sx += (m.x - m.sx) * 0.08
      m.sy += (m.y - m.sy) * 0.08
      const rows = Math.max(14, Math.round(h / 38))
      const gap = h / (rows + 1)
      const T = still ? 0 : t
      ctx.lineWidth = 1
      for (let i = 1; i <= rows; i++) {
        const y0 = i * gap
        const ph = i * 0.7
        const dy = Math.abs(y0 - m.sy)
        const rowK = m.k * Math.max(0, 1 - dy / 260)
        ctx.strokeStyle = 'rgba(79,224,244,' + (0.05 + 0.03 * Math.sin(T / 2200 + ph) + rowK * 0.22).toFixed(3) + ')'
        ctx.beginPath()
        for (let x = 0; x <= w; x += 6) {
          const dx = x - m.sx
          const bump = rowK * Math.exp(-(dx * dx) / 18000)
          const y =
            y0 +
            Math.sin(x / 140 + T / 1800 + ph) * 3 +
            Math.sin(x / 57 - T / 900 + ph * 1.7) * 1.2 +
            Math.sin(x / 18 - T / 120) * 9 * bump
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
        }
        ctx.stroke()
      }
      if (m.k > 0.01) {
        const g = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, 240)
        g.addColorStop(0, 'rgba(31,209,236,' + (0.08 * m.k).toFixed(3) + ')')
        g.addColorStop(1, 'rgba(31,209,236,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
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
    io.observe(cv)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setPhoneOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const phoneClick = (e) => {
    if (!window.matchMedia('(pointer: coarse)').matches) {
      e.preventDefault()
      setPhoneOpen(true)
      setHover(null)
    }
  }

  const on = (k) => hover === k
  const ln = (k) => (on(k) ? 'var(--color-accent)' : 'var(--color-neutral-600)')
  const nb = ln
  const ns = (k) => (on(k) ? '0 0 32px -6px var(--color-accent)' : 'none')
  const nc = (k) => (on(k) ? 'var(--color-accent)' : 'var(--color-neutral-300)')
  const nl = (k) => (on(k) ? 'var(--color-text)' : 'var(--color-neutral-400)')

  const nodeCircle = (k) => ({
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-neutral-900)',
    border: '1px solid ' + nb(k),
    boxShadow: ns(k),
    color: nc(k),
    transition: 'all 300ms',
  })
  const nodeLabel = (k) => ({
    fontSize: '13px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: nl(k),
    transition: 'color 300ms',
  })
  const nodeLink = (left, top) => ({
    position: 'absolute',
    left,
    top,
    transform: 'translate(-50%,-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'inherit',
  })
  const svgProps = {
    width: 32,
    height: 32,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <section id="contact" className="ras-contact">
      <style>{CSS}</style>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'radial-gradient(110% 80% at 70% 40%, var(--color-neutral-800) 0%, var(--color-bg) 65%)',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={bgRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1480px',
            margin: '0 auto',
            padding: '64px 48px',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))',
            gap: '48px',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          {/* left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '540px' }}>
            <div
              style={{
                fontSize: '13px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Get in touch
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 'clamp(44px,6vw,76px)',
                lineHeight: 1,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                textWrap: 'balance',
              }}
            >
              Let&apos;s build something <span style={{ color: 'var(--color-accent)' }}>real</span>
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '18px',
                lineHeight: 1.65,
                color: 'var(--color-neutral-300)',
                textWrap: 'pretty',
              }}
            >
              Recruitment is open to first and second year students. Fill in the membership form, or reach out on any
              channel with your questions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '8px' }}>
              <a
                className="btn-primary"
                href={formUrl}
                target="_blank"
                rel="noopener"
                style={{
                  padding: '16px 28px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                  border: '1px solid var(--color-accent)',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Become a member
              </a>
              <a
                className="btn-ghost"
                href={phoneHref}
                onClick={phoneClick}
                style={{
                  padding: '16px 28px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: 'transparent',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-neutral-600)',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Call us
              </a>
            </div>
          </div>

          {/* right */}
          <div style={{ width: '100%', maxWidth: '760px', justifySelf: 'center' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
              >
                <line x1="50" y1="50" x2="18" y2="20" stroke={ln('email')} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 300ms' }} />
                <line x1="50" y1="50" x2="82" y2="22" stroke={ln('instagram')} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 300ms' }} />
                <line x1="50" y1="50" x2="84" y2="78" stroke={ln('linkedin')} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 300ms' }} />
                <line x1="50" y1="50" x2="18" y2="80" stroke={ln('phone')} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 300ms' }} />
                <line x1="18" y1="20" x2="50" y2="50" stroke="var(--color-accent-300)" strokeWidth="2" strokeDasharray="6 86" vectorEffect="non-scaling-stroke" style={{ animation: 'packet 2.6s linear infinite' }} />
                <line x1="82" y1="22" x2="50" y2="50" stroke="var(--color-accent-300)" strokeWidth="2" strokeDasharray="6 86" vectorEffect="non-scaling-stroke" style={{ animation: 'packet 3.1s linear infinite 0.8s' }} />
                <line x1="84" y1="78" x2="50" y2="50" stroke="var(--color-accent-300)" strokeWidth="2" strokeDasharray="6 86" vectorEffect="non-scaling-stroke" style={{ animation: 'packet 2.8s linear infinite 1.5s' }} />
                <line x1="18" y1="80" x2="50" y2="50" stroke="var(--color-accent-300)" strokeWidth="2" strokeDasharray="6 86" vectorEffect="non-scaling-stroke" style={{ animation: 'packet 3.4s linear infinite 0.3s' }} />
              </svg>

              {/* hub */}
              <a
                href={formUrl}
                target="_blank"
                rel="noopener"
                aria-label="Become a member"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '172px',
                  height: '172px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--color-accent)', animation: 'ping 2.4s ease-out infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--color-accent)', animation: 'ping 2.4s ease-out infinite 1.2s' }} />
                <div
                  className="hub-core"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 50% 40%, var(--color-accent-800), var(--color-neutral-900) 75%)',
                    border: '1px solid var(--color-accent)',
                    boxShadow: '0 0 60px -10px var(--color-accent)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: 1.25,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text)',
                    }}
                  >
                    Become a<br />member
                  </div>
                </div>
              </a>

              {/* email */}
              <a
                href={links.email}
                onMouseEnter={() => setHover('email')}
                onMouseLeave={() => setHover(null)}
                aria-label="Email"
                style={nodeLink('18%', '20%')}
              >
                <div style={nodeCircle('email')}>
                  <svg {...svgProps}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <span style={nodeLabel('email')}>Email</span>
              </a>

              {/* instagram */}
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener"
                onMouseEnter={() => setHover('instagram')}
                onMouseLeave={() => setHover(null)}
                aria-label="Instagram"
                style={nodeLink('82%', '22%')}
              >
                <div style={nodeCircle('instagram')}>
                  <svg {...svgProps}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                  </svg>
                </div>
                <span style={nodeLabel('instagram')}>Instagram</span>
              </a>

              {/* linkedin */}
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener"
                onMouseEnter={() => setHover('linkedin')}
                onMouseLeave={() => setHover(null)}
                aria-label="LinkedIn"
                style={nodeLink('84%', '78%')}
              >
                <div style={nodeCircle('linkedin')}>
                  <svg {...svgProps}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 10.5v6.5M8 7.5v.01M12 17v-6.5M12 13.5a2.5 2.5 0 0 1 5 0V17" />
                  </svg>
                </div>
                <span style={nodeLabel('linkedin')}>LinkedIn</span>
              </a>

              {/* phone */}
              <a
                href={phoneHref}
                onClick={phoneClick}
                onMouseEnter={() => setHover('phone')}
                onMouseLeave={() => setHover(null)}
                aria-label="Phone"
                style={nodeLink('18%', '80%')}
              >
                <div style={nodeCircle('phone')}>
                  <svg {...svgProps}>
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <span style={nodeLabel('phone')}>Phone</span>
              </a>
            </div>
          </div>
        </div>

        {/* phone popup */}
        {phoneOpen && (
          <div
            onClick={() => setPhoneOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(3,6,9,0.6)',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Phone numbers"
              style={{
                width: 'min(400px,100%)',
                boxSizing: 'border-box',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '28px',
                background: 'var(--color-neutral-900)',
                border: '1px solid var(--color-accent-700)',
                boxShadow: '0 0 60px -20px var(--color-accent)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                  }}
                >
                  Phone numbers
                </div>
                <button
                  className="close-btn"
                  onClick={() => setPhoneOpen(false)}
                  aria-label="Close"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: '1px solid var(--color-neutral-700)',
                    color: 'var(--color-neutral-300)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {phoneList.map((ph) => (
                  <div key={ph.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: 'var(--color-neutral-400)',
                      }}
                    >
                      {ph.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: '22px',
                        letterSpacing: '0.04em',
                        color: 'var(--color-text)',
                      }}
                    >
                      {ph.number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}