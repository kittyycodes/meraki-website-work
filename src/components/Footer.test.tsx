import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('links to the Terms & Conditions page with visible link styling', () => {
    render(<Footer />)
    const termsLink = screen.getByText('Terms & Conditions')
    expect(termsLink).toHaveAttribute('href', '/terms')
    expect(termsLink.className).toContain('underline')
  })
})
