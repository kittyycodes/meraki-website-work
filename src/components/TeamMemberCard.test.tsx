import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TeamMemberCard } from './TeamMemberCard'

describe('TeamMemberCard', () => {
  it('renders name, role, bio, and social links', () => {
    render(
      <TeamMemberCard
        member={{
          _id: '1',
          name: 'Alex Rivera',
          role: 'Lead Engineer',
          bio: 'Ten years behind the desk.',
          photoUrl: 'alex.jpg',
          socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com/alex' }],
        }}
      />
    )
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('Lead Engineer')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toHaveAttribute('href', 'https://instagram.com/alex')
  })
})
