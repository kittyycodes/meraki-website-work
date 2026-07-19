'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'meraki-theme'

function getInitialTheme(): Theme {
  // A blocking inline script in the root layout (src/app/layout.tsx) runs
  // before hydration and applies the `dark` class to <html> based on the
  // stored preference (falling back to system preference). Reading that
  // class here — rather than re-reading localStorage/matchMedia — keeps
  // this component's state in sync with what has already been painted, so
  // there is no post-mount flash of the wrong theme.
  //
  // During SSR/static export `document` is unavailable, so this falls back
  // to 'light' to match the server-rendered markup. That produces a
  // one-render mismatch on theme-dependent UI (e.g. the theme toggle icon)
  // for dark-preference visitors, which is expected and suppressed via
  // `suppressHydrationWarning` on that element.
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Applies the class/localStorage side effects when `theme` changes,
  // including in response to the user manually toggling. Running on mount
  // too is harmless (the class already matches, from the blocking script).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
