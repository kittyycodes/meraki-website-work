'use client'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const SECTION_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Works', href: '#works' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream dark:bg-charcoal px-6 py-4 flex items-center justify-between">
      <span className="font-heading font-bold text-espresso dark:text-ivory">MERAKI STUDIO</span>

      <nav className="hidden md:flex gap-6" data-testid="desktop-links" aria-label="Primary">
        {SECTION_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-text-muted-light dark:text-text-muted-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue dark:focus-visible:outline-sofa-blue-dark"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a
          href="#contact"
          className="bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-4 py-2 rounded-lg text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue dark:focus-visible:outline-sofa-blue-dark"
          data-testid="nav-book-now"
        >
          Book Now
        </a>
        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue dark:focus-visible:outline-sofa-blue-dark"
          data-testid="menu-toggle"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav
          data-testid="mobile-links"
          aria-label="Mobile"
          className="absolute top-full left-0 w-full bg-cream dark:bg-charcoal flex flex-col p-4 md:hidden"
        >
          {SECTION_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 text-text-muted-light dark:text-text-muted-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue dark:focus-visible:outline-sofa-blue-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
