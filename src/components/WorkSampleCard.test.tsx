import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkSampleCard } from './WorkSampleCard'

describe('WorkSampleCard', () => {
  it('renders the title and description', () => {
    render(
      <WorkSampleCard
        work={{ _id: '1', title: 'Album Mix', category: 'Mixing & Mastering', imageUrl: 'mix.jpg', description: 'A full album mix.', featured: true }}
      />
    )
    expect(screen.getByText('Album Mix')).toBeInTheDocument()
    expect(screen.getByText('A full album mix.')).toBeInTheDocument()
  })
})
