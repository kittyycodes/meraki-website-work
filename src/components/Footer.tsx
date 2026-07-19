import { LINK_CLASS } from '@/lib/styles'

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="font-heading font-bold">MERAKI STUDIO</span>
      <nav className="flex gap-4 text-sm">
        <a href="#about" className={LINK_CLASS}>
          About
        </a>
        <a href="#services" className={LINK_CLASS}>
          Services
        </a>
        <a href="#contact" className={LINK_CLASS}>
          Contact
        </a>
        <a href="/terms" className={LINK_CLASS}>
          Terms & Conditions
        </a>
      </nav>
    </footer>
  )
}
