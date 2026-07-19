import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getStudioPhotos,
  getEquipment,
  getFeaturedWorkSamples,
  getTeamMembers,
  getClientLogos,
  getSiteSettings,
  getActiveAdCampaign,
} from '@/lib/sanity/queries'
import { ThemeProvider } from '@/context/ThemeContext'
import HomePage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getStudioPhotos: vi.fn(),
  getEquipment: vi.fn(),
  getFeaturedWorkSamples: vi.fn(),
  getTeamMembers: vi.fn(),
  getClientLogos: vi.fn(),
  getSiteSettings: vi.fn(),
  getActiveAdCampaign: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(getStudioPhotos).mockResolvedValue([])
  vi.mocked(getEquipment).mockResolvedValue([])
  vi.mocked(getFeaturedWorkSamples).mockResolvedValue([])
  vi.mocked(getTeamMembers).mockResolvedValue([])
  vi.mocked(getClientLogos).mockResolvedValue([])
  vi.mocked(getSiteSettings).mockResolvedValue({
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    mapsEmbedUrl: '',
    termsText: '',
  })
  vi.mocked(getActiveAdCampaign).mockResolvedValue(null)
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('HomePage', () => {
  it('renders every section in the locked order', async () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    )

    await waitFor(() => expect(screen.getByTestId('ad-slot-placeholder')).toBeInTheDocument())

    const headingTexts = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headingTexts).toEqual([
      'Where your sound comes to life.',
      'About Meraki Studio',
      'Services',
      'Recording',
      'Music Production',
      'Mixing & Mastering',
      'Audiobook Productions',
      'Music Distribution & Publishing',
      'The Studio',
      'Our Works',
      'Meet the Team',
      'Our Clientele',
      'Contact Us',
    ])
  })
})
