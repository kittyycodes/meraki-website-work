'use client'
import { useEffect, useState } from 'react'
import { getClientLogos } from '@/lib/sanity/queries'
import type { ClientLogo } from '@/lib/sanity/types'
import { ClientLogoStrip } from './ClientLogoStrip'

export function Clientele() {
  const [logos, setLogos] = useState<ClientLogo[]>([])

  useEffect(() => {
    let cancelled = false
    getClientLogos().then((result) => {
      if (!cancelled) setLogos(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="clientele" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8 text-center">
        Our Clientele
      </h2>
      <ClientLogoStrip logos={logos} />
    </section>
  )
}
