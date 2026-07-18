import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the tagline and both CTAs', () => {
    render(<Hero />)
    expect(screen.getByText('Where your sound comes to life.')).toBeInTheDocument()
    expect(screen.getByText('Book Now')).toHaveAttribute('href', '#contact')
    expect(screen.getByText('Our Works')).toHaveAttribute('href', '/our-works')
  })
})
