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
})
