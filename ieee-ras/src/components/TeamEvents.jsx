import { useEffect, useRef } from 'react'
import DomainHeads from './DomainHeads'

const HOLD = 0.2

const clamp = (v) => Math.max(0, Math.min(1, v))
const ease = (q) => (q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2)

const cardBase =
  'relative flex h-full flex-col overflow-hidden border border-rule text-ink no-underline backdrop-blur-md transition-all duration-300 hover:-translate-y-[3px] hover:border-[#0c6f80] hover:shadow-[0_0_48px_-14px_#22d3ee]'

export default function TeamEvents() {
  const trackRef = useRef(null)
  const carRef = useRef(null)
  const imgRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    let cur = 0
    let raf
    // Skip per-frame work while the section is far off screen (and the easing has settled)
    let near = true
    let running = true
    const loop = () => {
      let settled = false
      const t = trackRef.current
      const c = carRef.current
      const img = imgRef.current
      const tx = textRef.current
      if (t && c) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const r = t.getBoundingClientRect()
        const p = clamp(-r.top / (r.height - vh))
        cur += (p - cur) * 0.12
        settled = Math.abs(p - cur) < 0.0005
        const k = clamp((cur - HOLD) / (1 - HOLD))

        // 1. cards fade + drift up
        const h = clamp(k / 0.3)
        const e = 1 - Math.pow(1 - h, 2)
        c.style.opacity = (1 - e).toFixed(3)
        c.style.transform = `translateY(${(-e * 70).toFixed(1)}px) scale(${(1 - e * 0.05).toFixed(4)})`
        c.style.pointerEvents = e > 0.5 ? 'none' : 'auto'
        if (e > 0.5) c.setAttribute('inert', '')
        else c.removeAttribute('inert')
        c.style.visibility = e > 0.995 ? 'hidden' : 'visible'

        // 2. robot slides in left -> right
        const m = ease(clamp((k - 0.12) / 0.7))
        if (img && img.naturalWidth) {
          const iw = img.getBoundingClientRect().width
          const start = -0.97 * iw
          const end = vw - iw - 0.05 * vw
          img.style.transform = `translateX(${(start + (end - start) * m).toFixed(1)}px)`
        }

        // 3. events reveal one by one
        if (tx) {
          tx.querySelectorAll('[data-rv]').forEach((el, i) => {
            const a = clamp((k - 0.45 - i * 0.05) / 0.2)
            const ea = 1 - Math.pow(1 - a, 3)
            el.style.opacity = ea.toFixed(3)
            el.style.transform = `translateY(${((1 - ea) * 24).toFixed(1)}px)`
          })
          tx.style.pointerEvents = k > 0.7 ? 'auto' : 'none'
        }
      }
      if (!near && settled) running = false
      else raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        if (near && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        }
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(trackRef.current)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div id="events" ref={trackRef} className="relative bg-black" style={{ height: '340vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* robot */}
        <img
          ref={imgRef}
          src="/assets/robot.png"
          alt="Robot"
          draggable="false"
          className="pointer-events-none absolute bottom-0 left-0 max-w-none select-none will-change-transform"
          style={{ height: 'min(92vh, 52vw)', width: 'auto', transform: 'translateX(-200vw)' }}
        />

        {/* events text */}
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 flex items-center box-border"
          style={{ padding: '0 clamp(24px,8vw,180px)' }}
        >
          <div
            className="flex flex-col"
            style={{ gap: 'clamp(10px,3.2vh,36px)', width: 'min(900px,52vw)' }}
          >
            <div
              data-rv
              className="font-semibold uppercase tracking-[0.34em] text-pulse opacity-0"
              style={{ fontSize: 'clamp(14px,0.9vw,18px)' }}
            >
              Upcoming events
            </div>

            <h2
              data-rv
              className="m-0 font-bold uppercase tracking-[0.04em] text-ink opacity-0"
              style={{ fontSize: 'clamp(32px,min(5vw,9vh),104px)', lineHeight: 0.95 }}
            >
              What we&apos;re <span className="text-pulse">building</span> next
            </h2>

            {/* featured */}
            <div data-rv className="opacity-0">
              <a
                href="#"
                className={cardBase}
                style={{
                  padding: 'clamp(14px,3vh,32px) clamp(16px,2vw,34px)',
                  gap: 'clamp(10px,2vh,18px)',
                  background:
                    'radial-gradient(120% 140% at 0% 0%, rgba(34,211,238,0.14), transparent 55%), linear-gradient(160deg, rgba(12,20,28,0.9), rgba(6,11,16,0.9))',
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse to-transparent opacity-70" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-pulse px-[9px] py-[3px] text-[10px] font-bold tracking-[0.22em] text-void">
                    NEXT UP
                  </span>
                  <span className="border border-rule px-[9px] py-[3px] text-[10px] font-bold tracking-[0.22em] text-dim">
                    HACKATHON
                  </span>
                  <span className="ml-auto text-[11px] font-semibold tracking-[0.22em] text-haze">24 HRS</span>
                </div>
                <div className="flex items-center" style={{ gap: 'clamp(14px,2vw,24px)' }}>
                  <div
                    className="flex flex-none flex-col items-center border-r border-rule"
                    style={{ paddingRight: 'clamp(14px,2vw,24px)' }}
                  >
                    <span
                      className="font-bold leading-[0.9] text-ink"
                      style={{
                        fontSize: 'clamp(40px,min(8vh,4.4vw),84px)',
                        textShadow: '0 0 28px rgba(34,211,238,0.45)',
                      }}
                    >
                      10
                    </span>
                    <span className="text-[13px] font-bold tracking-[0.3em] text-pulse">OCT</span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span
                      className="font-bold uppercase leading-none tracking-[0.03em]"
                      style={{ fontSize: 'clamp(22px,min(4.4vh,2.4vw),44px)' }}
                    >
                      AutoBot 24
                    </span>
                    <span className="text-dim" style={{ fontSize: 'clamp(15px,1vw,19px)' }}>
                      Innovation Centre · 9:00 AM
                    </span>
                  </div>
                  <span className="flex flex-none items-center gap-2 whitespace-nowrap text-[13px] font-bold tracking-[0.16em] text-pulse">
                    REGISTER
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>

            {/* two smaller */}
            <div className="grid grid-cols-2" style={{ gap: 'clamp(12px,1vw,18px)' }}>
              {[
                ['WORKSHOP', 'NOV', '07', 'Drone Design', 'Main Quad · 10:00 AM'],
                ['TALK', 'NOV', '28', 'Careers Panel', 'MRD Auditorium · 4:00 PM'],
              ].map(([type, mon, day, title, meta]) => (
                <div data-rv className="opacity-0" key={title}>
                  <a
                    href="#"
                    className={cardBase}
                    style={{
                      padding: 'clamp(12px,2.4vh,26px) clamp(16px,1.4vw,26px)',
                      gap: 'clamp(6px,1.2vh,10px)',
                      background: 'linear-gradient(160deg, rgba(12,20,28,0.85), rgba(6,11,16,0.85))',
                    }}
                  >
                    <div className="pointer-events-none absolute bottom-[10px] right-[10px] h-[10px] w-[10px] border-b border-r border-rule" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="border border-rule px-[9px] py-[3px] text-[10px] font-bold tracking-[0.22em] text-dim">
                        {type}
                      </span>
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-dim">{mon}</span>
                    </div>
                    <div className="flex items-baseline gap-[10px]">
                      <span className="font-bold leading-none text-ink" style={{ fontSize: 'clamp(30px,min(5.5vh,3vw),56px)' }}>
                        {day}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-rule to-transparent" />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span
                        className="font-bold uppercase leading-[1.1] tracking-[0.03em]"
                        style={{ fontSize: 'clamp(16px,min(2.8vh,1.5vw),26px)' }}
                      >
                        {title}
                      </span>
                      <span className="text-dim" style={{ fontSize: 'clamp(14px,0.9vw,17px)' }}>
                        {meta}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            <div
              data-rv
              className="font-bold uppercase tracking-[0.14em] text-pulse opacity-0"
              style={{ fontSize: 'clamp(16px,1vw,20px)' }}
            >
              Register now
            </div>
          </div>
        </div>

        {/* domain heads carousel (fades away on scroll) */}
        <div
          ref={carRef}
          className="absolute inset-0 will-change-[transform,opacity]"
          style={{ transformOrigin: '50% 40%' }}
        >
          <DomainHeads />
        </div>
      </div>
    </div>
  )
}