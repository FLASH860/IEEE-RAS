import { useEffect, useRef } from 'react'

// Background video that only plays while it is (nearly) on screen.
export default function BgVideo({ src, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" />
}
