'use client'
import { useEffect, useState } from 'react'
import { getWorkSamples } from '@/lib/sanity/queries'
import type { WorkSample } from '@/lib/sanity/types'
import { groupWorksByCategory, SERVICE_CATEGORIES } from '@/lib/works'
import { WorkSampleCard } from '@/components/WorkSampleCard'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export default function OurWorksPage() {
  const [works, setWorks] = useState<WorkSample[]>([])

  useEffect(() => {
    let cancelled = false
    getWorkSamples().then((result) => {
      if (!cancelled) setWorks(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const grouped = groupWorksByCategory(works)

  return (
    <main>
      <Nav />
      <div className="py-16 px-6">
        <h1 className="font-heading text-espresso dark:text-ivory text-3xl font-bold mb-8">Our Works</h1>
        {SERVICE_CATEGORIES.map((category) => (
          <section key={category} className="mb-12">
            <h2 className="font-heading text-espresso dark:text-ivory text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grouped[category].map((work) => (
                <WorkSampleCard key={work._id} work={work} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  )
}
