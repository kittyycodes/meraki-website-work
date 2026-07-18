import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { About } from './About'

describe('About', () => {
  it('renders the About heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About Meraki Studio' })).toBeInTheDocument()
  })
})
