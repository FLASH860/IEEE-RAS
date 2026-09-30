import { motion } from 'motion/react'

const GROUPS = [
  {
    label: 'Our Philosophy',
    cols: 'md:grid-cols-3',
    items: [
      {
        title: 'Hands-On Engineering',
        text: 'Turn theoretical math and code into moving physical robots.',
      },
      {
        title: 'Real Hardware Focus',
        text: 'We build physical machinery, write real-time control loops, and foster creative tinkering.',
      },
      {
        title: 'Built to Operate',
        text: 'We skip standard slide decks to focus entirely on building real, operating hardware stacks.',
      },
    ],
  },
  {
    label: 'Where We Work',
    cols: 'md:grid-cols-2',
    items: [
      {
        title: 'Prime Location',
        text: "Based at PESU EC Campus in the heart of Electronic City's major tech cluster.",
      },
      {
        title: 'Modern Prototyping Labs',
        text: 'Access state-of-the-art lab facilities, embedded circuitry sandboxes, and modern workshops.',
      },
    ],
  },
  {
    label: 'What We Build With',
    cols: 'md:grid-cols-2',
    items: [
      {
        title: 'Core Technical Stack',
        text: 'Specialize in autonomous navigation, computer vision, and ROS-based kinematics.',
      },
      {
        title: 'Embedded Systems',
        text: 'Get hands-on with microcontroller programming using ESP32, Arduino, and real-time hardware.',
      },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full items-center overflow-hidden border-t border-rule bg-void px-8 py-20 md:px-14"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/back.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-void/40" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Left: mission */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="self-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-pulse">
            Discover Our Mission
          </p>
          <h2 className="text-4xl font-bold uppercase leading-tight tracking-wider md:text-6xl">
            Tinkering Beyond <span className="text-pulse">Code</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-dim md:text-lg">
            We're the corner of PES University EC Campus where lines of code stop
            being theoretical and start driving motors, reading sensors, and moving
            through the real world.
          </p>
        </motion.div>

        {/* Right: grouped cards */}
        <div className="flex flex-col gap-8">
          {GROUPS.map((group) => (
            <motion.div
              key={group.label}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={fadeUp} className="mb-3 flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-pulse">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-rule" />
              </motion.div>

              <div className={`grid gap-4 ${group.cols}`}>
                {group.items.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="border border-rule bg-panel/60 p-5 backdrop-blur-sm transition-colors hover:border-pulse/60"
                  >
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-dim">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}