import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '@/context/ThemeContext'

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter-var' }),
  Poppins: () => ({ variable: 'mock-poppins-var' }),
}))

import RootLayout from './layout'

function ThemeReader() {
  const { theme } = useTheme()
  return <span data-testid="theme-reader">{theme}</span>
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('RootLayout', () => {
  it('provides theme context to descendants', () => {
    render(<RootLayout><ThemeReader /></RootLayout>)
    expect(screen.getByTestId('theme-reader')).toHaveTextContent('light')
  })

  it('renders a blocking theme-init script as the first element in <head>, before hydration can run', () => {
    const { container } = render(<RootLayout><ThemeReader /></RootLayout>)
    const head = container.querySelector('head')
    expect(head).not.toBeNull()

    const firstChild = head?.firstElementChild
    expect(firstChild?.tagName).toBe('SCRIPT')

    // No async/defer: a plain inline <script> parsed early in <head> blocks
    // rendering until it runs, which is what lets it set the `dark` class
    // before first paint (avoiding both the hydration mismatch and the
    // flash of light-mode styling).
    expect(firstChild?.hasAttribute('async')).toBe(false)
    expect(firstChild?.hasAttribute('defer')).toBe(false)

    const scriptContent = firstChild?.innerHTML ?? ''
    // Same storage key ThemeContext.tsx uses, and the same
    // stored-preference-then-system-preference fallback logic.
    expect(scriptContent).toContain('meraki-theme')
    expect(scriptContent).toContain('matchMedia')
    expect(scriptContent).toContain("classList.add('dark')")
  })
})
