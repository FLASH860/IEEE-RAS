import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'domains', label: 'Domains' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'team', label: 'Team' },
  { id: 'events', label: 'Events' },
]

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // glass gets a little denser once you leave the top of the page
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the link for whichever section is in the middle of the screen
  useEffect(() => {
    const ids = ['home', 'about', 'domains', 'leadership', 'events', 'contact']
    const onScroll = () => {
      const mid = window.innerHeight * 0.5
      let cur = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom > mid) {
          cur = id
          break
        }
      }
      if (cur === 'events') {
        const ev = document.getElementById('events')
        const r = ev.getBoundingClientRect()
        const p = -r.top / (r.height - (ev.firstElementChild?.offsetHeight || window.innerHeight))
        cur = p < 0.3 ? 'team' : 'events'
      }
      if (cur) setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Team + Events live inside one tall scroll-driven section, so jump to exact spots in it:
  // Team = start (domain heads carousel), Events = end (robot on the far right, events showing)
  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(id === 'team' ? 'events' : id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    // the sticky stage is the real viewport height (svh/dvh on phones)
    const vh = el.firstElementChild?.offsetHeight || window.innerHeight
    const y = id === 'events' ? top + (el.offsetHeight - vh) * 0.97 : top
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const glass = {
    background: scrolled ? 'rgba(10, 19, 26, 0.55)' : 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(18px) saturate(170%)',
    WebkitBackdropFilter: 'blur(18px) saturate(170%)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
    transition: 'background 300ms',
  }

  const linkCls = (id) =>
    `relative px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] no-underline transition-colors ${
      active === id ? 'text-pulse' : 'text-ink/70 hover:text-ink'
    }`

  return (
    <>
    {/* tap-outside-to-close for the phone menu (outside <header>: its transform would trap a fixed child) */}
    {open && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
    <header className="fixed left-1/2 top-4 z-50 w-[min(1120px,calc(100%-2rem))] -translate-x-1/2">
      <nav className="flex items-center justify-between rounded-2xl px-4 py-2.5 md:px-6" style={glass}>
        <a href="#home" className="flex items-center gap-2.5 no-underline max-md:min-h-11" onClick={() => setOpen(false)}>
          <span className="text-sm font-bold uppercase tracking-[0.28em] text-ink">
            IEEE <span className="text-pulse">RAS</span>
          </span>
        </a>

        {/* desktop links */}
        <ul className="m-0 hidden list-none items-center gap-1 p-0 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className={linkCls(l.id)}>
                {l.label}
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-pulse transition-opacity duration-300"
                  style={{ opacity: active === l.id ? 1 : 0, boxShadow: '0 0 10px 1px rgba(34,211,238,0.8)' }}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden border border-pulse/60 bg-pulse/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-pulse no-underline transition hover:bg-pulse hover:text-void md:block"
            style={{ borderRadius: 10 }}
          >
            Join us
          </a>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-transparent text-ink md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div
          className="mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto rounded-2xl p-3 md:hidden"
          style={{ ...glass, background: 'rgba(10, 19, 26, 0.7)' }}
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {[...LINKS, { id: 'contact', label: 'Join us' }].map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  className={`block rounded-lg px-3 py-3.5 text-xs font-bold uppercase tracking-[0.2em] no-underline ${
                    active === l.id ? 'bg-pulse/10 text-pulse' : 'text-ink/80'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
    </>
  )
}