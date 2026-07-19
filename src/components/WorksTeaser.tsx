'use client'
import { useEffect, useState } from 'react'
import { getFeaturedWorkSamples } from '@/lib/sanity/queries'
import type { WorkSample } from '@/lib/sanity/types'
import { WorkSampleCard } from './WorkSampleCard'
import { LINK_CLASS } from '@/lib/styles'

export function WorksTeaser() {
  const [works, setWorks] = useState<WorkSample[]>([])

  useEffect(() => {
    let cancelled = false
    getFeaturedWorkSamples()
      .then((result) => {
        if (!cancelled) setWorks(result)
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to fetch featured work samples', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="works" className="bg-cream dark:bg-charcoal py-16 px-6 scroll-mt-20">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Our Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {works.map((work) => (
          <WorkSampleCard key={work._id} work={work} />
        ))}
      </div>
      <a href="/our-works" className={`${LINK_CLASS} text-espresso dark:text-ivory block mt-6`}>
        View All Works
      </a>
    </section>
  )
}
