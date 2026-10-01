import { lazy, Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Leadership from './components/Leadership'

const loadFocus = () => import('./components/FocusDomains')
const loadEvents = () => import('./components/TeamEvents')
const loadContact = () => import('./components/Contact')

const FocusDomains = lazy(loadFocus)
const TeamEvents = lazy(loadEvents)
const Contact = lazy(loadContact)

// Reserve roughly the final height so nothing jumps while a chunk arrives
const placeholder = (minHeight) => <div style={{ minHeight, background: '#05080c' }} />

export default function App() {
  // Fetch the below-the-fold chunks right after first paint
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200))
    idle(() => {
      loadFocus()
      loadEvents()
      loadContact()
    })
  }, [])

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Suspense fallback={placeholder('100vh')}>
        <FocusDomains />
      </Suspense>
      <Leadership />
      <Suspense fallback={placeholder('340vh')}>
        <TeamEvents />
      </Suspense>
      <Suspense fallback={placeholder('100vh')}>
        <Contact />
      </Suspense>
      <footer className="border-t border-rule bg-void px-5 py-6 text-center text-xs tracking-wide text-dim">
        © 2026 IEEE RAS PESU - EC Campus. All Rights Reserved.
      </footer>
    </main>
  )
}
