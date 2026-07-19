'use client'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      data-testid="theme-toggle"
      suppressHydrationWarning
      className="w-8 h-8 rounded-full bg-cream-alt dark:bg-charcoal-alt text-espresso dark:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-sofa-blue dark:focus-visible:outline-sofa-blue-dark"
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  )
}
