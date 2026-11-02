import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Why from './components/Why.jsx'
import Architecture from './components/Architecture.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CvModal from './components/CvModal.jsx'

export default function App() {
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <>
      <Navbar onOpenCv={() => setCvOpen(true)} />
      <main>
        <Hero onOpenCv={() => setCvOpen(true)} />
        <Marquee />
        <Why />
        <Architecture />
        <Experience />
        <Skills />
        <Projects />
        <Contact onOpenCv={() => setCvOpen(true)} />
      </main>
      <Footer />
      {cvOpen && <CvModal onClose={() => setCvOpen(false)} />}
    </>
  )
}
