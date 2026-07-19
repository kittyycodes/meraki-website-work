import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFeaturedWorkSamples } from '@/lib/sanity/queries'
import { WorksTeaser } from './WorksTeaser'

vi.mock('@/lib/sanity/queries', () => ({
  getFeaturedWorkSamples: vi.fn(),
}))

const getFeaturedWorkSamplesMock = vi.mocked(getFeaturedWorkSamples)

beforeEach(() => {
  getFeaturedWorkSamplesMock.mockReset()
})

describe('WorksTeaser', () => {
  it('renders featured works and a link to the full works page', async () => {
    getFeaturedWorkSamplesMock.mockResolvedValueOnce([
      { _id: '1', title: 'Hit Single', category: 'Recording', imageUrl: 'hit.jpg', description: '', featured: true },
    ])
    render(<WorksTeaser />)
    await waitFor(() => expect(screen.getByText('Hit Single')).toBeInTheDocument())
    expect(screen.getByText('View All Works')).toHaveAttribute('href', '/our-works')
  })
})
