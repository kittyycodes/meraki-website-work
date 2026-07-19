'use client'
import { useState } from 'react'
import type { ClientLogo } from '@/lib/sanity/types'
import { duplicateForLoop } from '@/lib/logoStrip'

export function ClientLogoStrip({ logos }: { logos: ClientLogo[] }) {
  const [paused, setPaused] = useState(false)
  const loopedLogos = duplicateForLoop(logos)

  return (
    <div
      data-testid="logo-strip"
      className={`flex gap-8 overflow-hidden ${paused ? 'animate-none' : 'animate-scroll'}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {loopedLogos.map((logo, index) => (
        <img key={`${logo._id}-${index}`} src={logo.logoUrl} alt={logo.name} className="h-12 object-contain" />
      ))}
    </div>
  )
}
