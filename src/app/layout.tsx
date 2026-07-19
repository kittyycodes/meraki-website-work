import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'Meraki Studio',
  description:
    'Professional audio recording studio — recording, production, mixing & mastering, audiobooks, and distribution.',
}

// Runs synchronously before hydration (blocking, no async/defer) so the
// `dark` class is applied to <html> before first paint. This avoids both
// the SSR/client hydration mismatch (server always renders 'light' markup
// since window is unavailable) and the flash of light-mode styling that a
// post-mount useEffect would cause on every load for dark-preference
// visitors. Keep this in sync with the storage key / fallback logic in
// src/context/ThemeContext.tsx.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('meraki-theme');var isDark=s==='dark'||s==='light'?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(isDark){document.documentElement.classList.add('dark');}}catch(e){}})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans bg-cream dark:bg-charcoal">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
