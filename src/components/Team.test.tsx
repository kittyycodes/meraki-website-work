import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTeamMembers } from '@/lib/sanity/queries'
import { Team } from './Team'

vi.mock('@/lib/sanity/queries', () => ({
  getTeamMembers: vi.fn(),
}))

const getTeamMembersMock = vi.mocked(getTeamMembers)

beforeEach(() => {
  getTeamMembersMock.mockReset()
})

describe('Team', () => {
  it('renders each fetched team member', async () => {
    getTeamMembersMock.mockResolvedValueOnce([
      { _id: '1', name: 'Alex Rivera', role: 'Lead Engineer', bio: '', photoUrl: 'alex.jpg', socialLinks: [] },
      { _id: '2', name: 'Sam Lee', role: 'Producer', bio: '', photoUrl: 'sam.jpg', socialLinks: [] },
    ])
    render(<Team />)
    await waitFor(() => expect(screen.getByTestId('team-1')).toBeInTheDocument())
    expect(screen.getByTestId('team-2')).toBeInTheDocument()
  })
})
