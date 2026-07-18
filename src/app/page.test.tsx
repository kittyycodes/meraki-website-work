import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('HomePage smoke test', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    expect(screen.getByText('Meraki Studio')).toBeInTheDocument()
  })
})
