import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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

describe('ThemeProvider / useTheme', () => {
  it('defaults to the system preference when nothing is stored', () => {
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

  it('reads a previously stored theme instead of the system preference', () => {
    window.localStorage.setItem('meraki-theme', 'dark')
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
  })
})
