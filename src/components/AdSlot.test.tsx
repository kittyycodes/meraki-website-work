import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getActiveAdCampaign } from '@/lib/sanity/queries'
import { AdSlot } from './AdSlot'

vi.mock('@/lib/sanity/queries', () => ({
  getActiveAdCampaign: vi.fn(),
}))

const getActiveAdCampaignMock = vi.mocked(getActiveAdCampaign)

beforeEach(() => {
  getActiveAdCampaignMock.mockReset()
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('AdSlot', () => {
  it('renders the studio campaign when one is active', async () => {
    getActiveAdCampaignMock.mockResolvedValueOnce({
      _id: '1',
      imageUrl: 'campaign.jpg',
      linkUrl: 'https://meraki.studio/promo',
      active: true,
    })
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-campaign')).toBeInTheDocument())
    expect(screen.getByTestId('ad-slot-campaign')).toHaveAttribute('href', 'https://meraki.studio/promo')
  })

  it('renders a placeholder when no campaign is active and AdSense is not configured', async () => {
    getActiveAdCampaignMock.mockResolvedValueOnce(null)
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-placeholder')).toBeInTheDocument())
  })

  it('renders an AdSense unit when no campaign is active and AdSense is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT_ID', 'ca-pub-123')
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_SLOT_ID', 'slot-456')
    getActiveAdCampaignMock.mockResolvedValueOnce(null)
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-adsense')).toBeInTheDocument())
    expect(screen.getByTestId('ad-slot-adsense')).toHaveAttribute('data-ad-client', 'ca-pub-123')
    expect(screen.getByTestId('ad-slot-adsense')).toHaveAttribute('data-ad-slot', 'slot-456')
  })

  it('loads the AdSense script with the configured client id when AdSense is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_CLIENT_ID', 'ca-pub-123')
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_SLOT_ID', 'slot-456')
    getActiveAdCampaignMock.mockResolvedValueOnce(null)
    render(<AdSlot />)
    await waitFor(() => expect(screen.getByTestId('ad-slot-adsense')).toBeInTheDocument())

    const script = await waitFor(() => {
      const el = document.querySelector('script[src*="pagead2.googlesyndication.com"]')
      expect(el).not.toBeNull()
      return el as HTMLScriptElement
    })
    expect(script.src).toBe('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123')
    expect(script.crossOrigin).toBe('anonymous')
  })
})
