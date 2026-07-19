import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSiteSettings } from '@/lib/sanity/queries'
import { ThemeProvider } from '@/context/ThemeContext'
import TermsPage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getSiteSettings: vi.fn(),
}))

const getSiteSettingsMock = vi.mocked(getSiteSettings)

beforeEach(() => {
  getSiteSettingsMock.mockReset()
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('TermsPage', () => {
  it('renders the terms text from Sanity when present', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: 'All bookings are final once confirmed.',
    })
    render(
      <ThemeProvider>
        <TermsPage />
      </ThemeProvider>
    )
    await waitFor(() =>
      expect(screen.getByTestId('terms-text')).toHaveTextContent('All bookings are final once confirmed.')
    )
  })

  it('shows fallback text when no terms have been set yet', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
    render(
      <ThemeProvider>
        <TermsPage />
      </ThemeProvider>
    )
    await waitFor(() =>
      expect(screen.getByTestId('terms-text')).toHaveTextContent('Terms & Conditions content coming soon.')
    )
  })
})
