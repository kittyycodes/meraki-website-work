'use client'
import { useEffect, useState } from 'react'
import { getTeamMembers } from '@/lib/sanity/queries'
import type { TeamMember } from '@/lib/sanity/types'
import { TeamMemberCard } from './TeamMemberCard'

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    let cancelled = false
    getTeamMembers()
      .then((result) => {
        if (!cancelled) setMembers(result)
      })
      .catch((error) => {
        if (!cancelled) console.error('Failed to fetch team members', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="team" className="bg-cream-alt dark:bg-charcoal-alt py-16 px-6 scroll-mt-20">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {members.map((member) => (
          <TeamMemberCard key={member._id} member={member} />
        ))}
      </div>
    </section>
  )
}
