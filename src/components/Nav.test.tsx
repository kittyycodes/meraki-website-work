import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ThemeProvider } from '@/context/ThemeContext'
import { Nav } from './Nav'

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

afterEach(() => {
  cleanup()
})

function renderNav() {
  return render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>
  )
}

describe('Nav', () => {
  it('has a Book Now button that jumps to the Contact section', () => {
    renderNav()
    expect(screen.getByTestId('nav-book-now')).toHaveAttribute('href', '#contact')
  })

  it('mobile menu is closed by default and opens on toggle click', () => {
    renderNav()
    expect(screen.queryByTestId('mobile-links')).not.toBeInTheDocument()
    const toggle = screen.getByTestId('menu-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(screen.getByTestId('mobile-links')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggle)
    expect(screen.queryByTestId('mobile-links')).not.toBeInTheDocument()
  })
})
