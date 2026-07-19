import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getClientLogos } from '@/lib/sanity/queries'
import { Clientele } from './Clientele'

vi.mock('@/lib/sanity/queries', () => ({
  getClientLogos: vi.fn(),
}))

const getClientLogosMock = vi.mocked(getClientLogos)

beforeEach(() => {
  getClientLogosMock.mockReset()
})

describe('Clientele', () => {
  it('renders the fetched logos in the strip', async () => {
    getClientLogosMock.mockResolvedValueOnce([{ _id: '1', name: 'Client A', logoUrl: 'a.png' }])
    render(<Clientele />)
    await waitFor(() => expect(screen.getAllByAltText('Client A')).toHaveLength(2))
  })
})
