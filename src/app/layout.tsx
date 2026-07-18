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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-cream dark:bg-charcoal">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
