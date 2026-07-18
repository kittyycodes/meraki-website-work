'use client'
import { useEffect, useState } from 'react'
import { getActiveAdCampaign } from '@/lib/sanity/queries'
import type { AdCampaign } from '@/lib/sanity/types'

export function AdSlot() {
  const [campaign, setCampaign] = useState<AdCampaign | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    getActiveAdCampaign().then((result) => {
      if (!cancelled) {
        setCampaign(result)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!loaded) return null

  if (campaign) {
    return (
      <a
        href={campaign.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="ad-slot-campaign"
        className="block px-6 py-4"
      >
        <img src={campaign.imageUrl} alt="Meraki Studio campaign" className="w-full" />
      </a>
    )
  }

  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID

  if (!adsenseClient || !adsenseSlot) {
    return <div data-testid="ad-slot-placeholder" className="ad-slot-placeholder h-24 mx-6" />
  }

  return (
    <ins
      className="adsbygoogle block mx-6"
      style={{ display: 'block' }}
      data-ad-client={adsenseClient}
      data-ad-slot={adsenseSlot}
      data-testid="ad-slot-adsense"
    />
  )
}
