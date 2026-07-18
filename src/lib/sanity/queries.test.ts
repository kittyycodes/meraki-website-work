import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sanityClient } from './client'
import {
  getTeamMembers,
  getClientLogos,
  getWorkSamples,
  getFeaturedWorkSamples,
  getStudioPhotos,
  getEquipment,
  getActiveAdCampaign,
  getSiteSettings,
} from './queries'

vi.mock('./client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

const fetchMock = vi.mocked(sanityClient.fetch)

beforeEach(() => {
  fetchMock.mockReset()
})

describe('sanity queries', () => {
  it('getTeamMembers returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'A' }])
    const result = await getTeamMembers()
    expect(result).toEqual([{ _id: '1', name: 'A' }])
  })

  it('getClientLogos returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'Client A' }])
    const result = await getClientLogos()
    expect(result).toEqual([{ _id: '1', name: 'Client A' }])
  })

  it('getWorkSamples returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', title: 'Track' }])
    const result = await getWorkSamples()
    expect(result).toEqual([{ _id: '1', title: 'Track' }])
  })

  it('getFeaturedWorkSamples returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', title: 'Featured Track' }])
    const result = await getFeaturedWorkSamples()
    expect(result).toEqual([{ _id: '1', title: 'Featured Track' }])
  })

  it('getStudioPhotos returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', imageUrl: 'x.jpg' }])
    const result = await getStudioPhotos()
    expect(result).toEqual([{ _id: '1', imageUrl: 'x.jpg' }])
  })

  it('getEquipment returns the fetched array', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', name: 'Mic' }])
    const result = await getEquipment()
    expect(result).toEqual([{ _id: '1', name: 'Mic' }])
  })

  it('getActiveAdCampaign returns the first result when present', async () => {
    fetchMock.mockResolvedValueOnce([{ _id: '1', imageUrl: 'ad.jpg', linkUrl: 'https://x.com', active: true }])
    const result = await getActiveAdCampaign()
    expect(result).toEqual({ _id: '1', imageUrl: 'ad.jpg', linkUrl: 'https://x.com', active: true })
  })

  it('getActiveAdCampaign returns null when nothing is active', async () => {
    fetchMock.mockResolvedValueOnce([])
    const result = await getActiveAdCampaign()
    expect(result).toBeNull()
  })

  it('getSiteSettings returns the fetched document', async () => {
    fetchMock.mockResolvedValueOnce({
      address: '123 Main St',
      phone: '555-1234',
      email: 'hi@meraki.studio',
      whatsappNumber: '15551234',
      mapsEmbedUrl: 'https://maps.example',
      termsText: 'Terms text',
    })
    const result = await getSiteSettings()
    expect(result.address).toBe('123 Main St')
  })

  it('getSiteSettings falls back to empty strings when no document exists', async () => {
    fetchMock.mockResolvedValueOnce(null)
    const result = await getSiteSettings()
    expect(result).toEqual({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
  })
})
