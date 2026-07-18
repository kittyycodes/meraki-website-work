import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Services } from './Services'

describe('Services', () => {
  it('renders all 5 fixed service categories', () => {
    render(<Services />)
    expect(screen.getByText('Recording')).toBeInTheDocument()
    expect(screen.getByText('Music Production')).toBeInTheDocument()
    expect(screen.getByText('Mixing & Mastering')).toBeInTheDocument()
    expect(screen.getByText('Audiobook Productions')).toBeInTheDocument()
    expect(screen.getByText('Music Distribution & Publishing')).toBeInTheDocument()
  })
})
