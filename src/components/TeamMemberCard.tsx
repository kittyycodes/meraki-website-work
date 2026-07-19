import type { TeamMember } from '@/lib/sanity/types'
import { LINK_CLASS } from '@/lib/styles'

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-6 text-center" data-testid={`team-${member._id}`}>
      <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-4" />
      <h3 className="font-heading text-espresso dark:text-ivory font-semibold">{member.name}</h3>
      <p className="text-espresso dark:text-sofa-blue-dark text-sm mb-2">{member.role}</p>
      <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-3">{member.bio}</p>
      <div className="flex justify-center gap-3">
        {member.socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            className={`${LINK_CLASS} text-espresso dark:text-ivory`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  )
}
