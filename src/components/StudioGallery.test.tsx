import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StudioGallery } from './StudioGallery'

const PHOTOS = [
  { _id: 'a', imageUrl: 'a.jpg', caption: 'Control room' },
  { _id: 'b', imageUrl: 'b.jpg', caption: 'Booth' },
]

describe('StudioGallery', () => {
  it('opens the lightbox with the clicked photo and closes on backdrop click', () => {
    render(<StudioGallery photos={PHOTOS} />)
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('gallery-thumb-a'))
    const lightbox = screen.getByTestId('gallery-lightbox')
    expect(lightbox).toBeInTheDocument()
    expect(screen.getByAltText('Control room')).toHaveAttribute('src', 'a.jpg')

    fireEvent.click(lightbox)
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument()
  })
})
