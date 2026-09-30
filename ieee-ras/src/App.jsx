import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FocusDomains from './components/FocusDomains'
import Leadership from './components/Leadership'
import TeamEvents from './components/TeamEvents'
import Contact from './components/Contact'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <FocusDomains />
      <Leadership />
      <TeamEvents />
      <Contact />
    </main>
  )
}
