'use client'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/sanity/queries'
import type { SiteSettings } from '@/lib/sanity/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'

const EMPTY_SETTINGS: SiteSettings = {
  address: '',
  phone: '',
  email: '',
  whatsappNumber: '',
  mapsEmbedUrl: '',
  termsText: '',
}

export function Contact() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS)

  useEffect(() => {
    let cancelled = false
    getSiteSettings()
      .then((result) => {
        if (!cancelled) setSettings(result)
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to fetch site settings', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="contact" className="bg-cream-alt dark:bg-charcoal-alt py-16 px-6 scroll-mt-20">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Contact Us</h2>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-address">
        {settings.address}
      </p>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-phone">
        {settings.phone}
      </p>
      <p className="text-text-muted-light dark:text-text-muted-dark" data-testid="contact-email">
        {settings.email}
      </p>
      {settings.mapsEmbedUrl && (
        <iframe
          src={settings.mapsEmbedUrl}
          title="Studio location"
          className="w-full h-64 mt-4"
          data-testid="contact-map"
        />
      )}
      <a
        href={buildWhatsAppLink(settings.whatsappNumber, "Hi Meraki Studio, I'd like to book a session.")}
        className="inline-block bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-6 py-3 rounded-lg font-semibold mt-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book Now on WhatsApp
      </a>
    </section>
  )
}
