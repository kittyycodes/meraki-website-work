import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ClientLogoStrip } from './ClientLogoStrip'

const LOGOS = [
  { _id: '1', name: 'Client A', logoUrl: 'a.png' },
  { _id: '2', name: 'Client B', logoUrl: 'b.png' },
]

describe('ClientLogoStrip', () => {
  it('duplicates the logos for a seamless loop and pauses on hover', () => {
    render(<ClientLogoStrip logos={LOGOS} />)
    const strip = screen.getByTestId('logo-strip')
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(strip.className).toContain('animate-scroll')

    fireEvent.mouseEnter(strip)
    expect(strip.className).toContain('animate-none')

    fireEvent.mouseLeave(strip)
    expect(strip.className).toContain('animate-scroll')
  })
})
