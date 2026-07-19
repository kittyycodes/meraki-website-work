import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSiteSettings } from '@/lib/sanity/queries'
import { Contact } from './Contact'

vi.mock('@/lib/sanity/queries', () => ({
  getSiteSettings: vi.fn(),
}))

const getSiteSettingsMock = vi.mocked(getSiteSettings)

beforeEach(() => {
  getSiteSettingsMock.mockReset()
})

describe('Contact', () => {
  it('renders contact details, map, and a correct WhatsApp link', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '123 Main St',
      phone: '555-1234',
      email: 'hi@meraki.studio',
      whatsappNumber: '+1 555 123 4567',
      mapsEmbedUrl: 'https://maps.example/embed',
      termsText: '',
    })
    render(<Contact />)

    await waitFor(() => expect(screen.getByTestId('contact-address')).toHaveTextContent('123 Main St'))
    expect(screen.getByTestId('contact-phone')).toHaveTextContent('555-1234')
    expect(screen.getByTestId('contact-email')).toHaveTextContent('hi@meraki.studio')
    expect(screen.getByTestId('contact-map')).toHaveAttribute('src', 'https://maps.example/embed')
    expect(screen.getByText('Book Now on WhatsApp')).toHaveAttribute(
      'href',
      "https://wa.me/15551234567?text=Hi%20Meraki%20Studio%2C%20I'd%20like%20to%20book%20a%20session."
    )
  })

  it('omits the map when no embed URL is set', async () => {
    getSiteSettingsMock.mockResolvedValueOnce({
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    })
    render(<Contact />)
    await waitFor(() => expect(getSiteSettingsMock).toHaveBeenCalled())
    expect(screen.queryByTestId('contact-map')).not.toBeInTheDocument()
  })
})
