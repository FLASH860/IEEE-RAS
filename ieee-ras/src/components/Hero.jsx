import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const WORDS = ['Build', 'Automate', 'Innovate']

function RotatingWord() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden leading-[1.25] text-pulse">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="inline-block"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen w-full snap-start overflow-hidden bg-void"
    >
      {/* Background video. Drop your clip at public/hero.mp4 and a still at public/hero-poster.jpg */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/robot.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Left-side fade so text stays readable over the video */}
      <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/20 to-transparent" />

      {/* Text: bottom-left */}
      <div className="absolute bottom-[0.4rem] left-0 max-w-3xl p-8 md:bottom-[0.125rem] md:p-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-3 text-xs uppercase tracking-[0.3em] text-pulse"
        >
          IEEE Robotics and Automation Society · PES University EC Campus
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="text-6xl font-bold uppercase leading-none tracking-wider md:text-8xl"
        >
          IEEE RAS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="mt-2 flex items-baseline gap-3 text-xl tracking-wide md:text-3xl"
        >
          <span>A club where we</span>
          <RotatingWord />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="mt-5 max-w-xl text-base leading-relaxed text-dim md:text-lg"
        >
          We foster a community of learning, hardware engineering excellence, and
          technological innovation right here at PES University, Electronic City Campus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
          className="mt-6 flex gap-4"
        >
          <a
            href="#events"
            className="bg-pulse px-6 py-3 text-sm font-bold uppercase tracking-wider text-void transition hover:bg-haze"
          >
            Explore Events
          </a>
          <a
            href="#about"
            className="border border-pulse/50 px-6 py-3 text-sm font-bold uppercase tracking-wider text-pulse transition hover:bg-pulse/10"
          >
            Know More
          </a>
        </motion.div>
      </div>
    </section>
  )
}
