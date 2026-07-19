import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeContext'

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  // The real app relies on a blocking inline script (src/app/layout.tsx)
  // to apply this class before ThemeProvider ever mounts. Reset it here so
  // tests don't leak the class from a previous render/toggle.
  document.documentElement.classList.remove('dark')
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('ThemeProvider / useTheme', () => {
  it('defaults to light when <html> has no dark class', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
  })

  it('toggles the theme and persists it to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(window.localStorage.getItem('meraki-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('reads its initial state from the dark class already applied to <html>, instead of defaulting to light', () => {
    // Simulates what the blocking init script in the root layout does
    // before React hydrates: applying the `dark` class ahead of first
    // paint/mount, based on a stored or system-preferred theme.
    // ThemeProvider must pick this up synchronously on its very first
    // render (no useEffect round-trip), or dark-preference visitors would
    // see a flash of light-mode styling.
    document.documentElement.classList.add('dark')
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })
})
