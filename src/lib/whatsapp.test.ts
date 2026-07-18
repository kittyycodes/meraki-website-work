import { describe, it, expect } from 'vitest'
import { buildWhatsAppLink } from './whatsapp'

describe('buildWhatsAppLink', () => {
  it('strips non-digit characters from the phone number', () => {
    const link = buildWhatsAppLink('+91 98765 43210', 'Hi')
    expect(link).toBe('https://wa.me/919876543210?text=Hi')
  })

  it('URL-encodes the message', () => {
    const link = buildWhatsAppLink('919876543210', "Hi, I'd like to book a session.")
    expect(link).toBe(
      'https://wa.me/919876543210?text=Hi%2C%20I\'d%20like%20to%20book%20a%20session.'
    )
  })
})
