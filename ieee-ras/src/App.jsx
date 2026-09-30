import Hero from './components/Hero'
import About from './components/About'
import Leadership from './components/Leadership'
import TeamEvents from './components/TeamEvents'
import Section from './components/Section'

export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Leadership />
      <TeamEvents />
      
      <Section id="projects" index="04" title="Section 04" />
      <Section id="contact" index="05" title="Section 05" />
    </main>
  )
}
