import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { AdSlot } from '@/components/AdSlot'
import { Studio } from '@/components/Studio'
import { WorksTeaser } from '@/components/WorksTeaser'
import { Team } from '@/components/Team'
import { Clientele } from '@/components/Clientele'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Services />
      <AdSlot />
      <Studio />
      <WorksTeaser />
      <Team />
      <Clientele />
      <Contact />
      <Footer />
    </main>
  )
}
