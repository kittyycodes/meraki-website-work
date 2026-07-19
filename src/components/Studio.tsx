'use client'
import { useEffect, useState } from 'react'
import { getStudioPhotos, getEquipment } from '@/lib/sanity/queries'
import type { StudioPhoto, EquipmentItem } from '@/lib/sanity/types'
import { StudioGallery } from './StudioGallery'
import { EquipmentCard } from './EquipmentCard'

export function Studio() {
  const [photos, setPhotos] = useState<StudioPhoto[]>([])
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])

  useEffect(() => {
    let cancelled = false
    getStudioPhotos().then((result) => {
      if (!cancelled) setPhotos(result)
    })
    getEquipment().then((result) => {
      if (!cancelled) setEquipment(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="studio" className="bg-cream dark:bg-charcoal py-16 px-6 scroll-mt-20">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">The Studio</h2>
      <StudioGallery photos={photos} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {equipment.map((item) => (
          <EquipmentCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
}
