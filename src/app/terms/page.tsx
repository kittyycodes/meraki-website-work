'use client'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/sanity/queries'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const FALLBACK_TERMS_TEXT = 'Terms & Conditions content coming soon.'

export default function TermsPage() {
  const [termsText, setTermsText] = useState('')

  useEffect(() => {
    let cancelled = false
    getSiteSettings()
      .then((result) => {
        if (!cancelled) setTermsText(result.termsText)
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to fetch site settings', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <Nav />
      <div className="py-16 px-6 max-w-3xl mx-auto">
        <h1 className="font-heading text-espresso dark:text-ivory text-3xl font-bold mb-8">Terms &amp; Conditions</h1>
        <p
          className="text-text-muted-light dark:text-text-muted-dark whitespace-pre-line"
          data-testid="terms-text"
        >
          {termsText || FALLBACK_TERMS_TEXT}
        </p>
      </div>
      <Footer />
    </main>
  )
}
