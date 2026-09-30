import { motion } from 'motion/react'
import BgVideo from './BgVideo'

// Put photos in public/assets/team/ and set photo: '/assets/team/name.jpg'
const LEADERS = [
  { name: 'Nithilashree MR', role: 'Co Head', photo: '/assets/Nithilashree.png' },
  { name: 'Modhak Kushalappa', role: 'Head', photo: '/assets/modhak.png' },
  { name: 'J Akhil', role: 'Secretary', photo: '/assets/Akhil.png' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

function Silhouette() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="h-full w-full text-rule"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="50" cy="42" r="20" />
      <path d="M10 120c0-26 18-42 40-42s40 16 40 42z" />
    </svg>
  )
}

export default function Leadership() {
  return (
    <section
      id="leadership"
      className="relative flex min-h-screen w-full items-center overflow-hidden border-t border-rule bg-void px-8 py-20 md:px-14"
    >
      <BgVideo className="absolute inset-0 h-full w-full object-cover" src="/assets/back.mp4" />
      <div className="absolute inset-0 bg-void/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-pulse">Leadership</p>
          <h2 className="text-4xl font-bold uppercase leading-tight tracking-wider md:text-6xl">
            The People Behind <span className="text-pulse">RAS</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid items-center gap-6 md:grid-cols-3 md:gap-16"
        >
          {LEADERS.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border border-rule bg-panel transition-colors hover:border-pulse/60 ${i === 1 ? '' : 'md:scale-90'}`}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <Silhouette />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-pulse">{p.role}</p>
                <h3 className="mt-1 text-2xl font-bold uppercase tracking-wide">{p.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}