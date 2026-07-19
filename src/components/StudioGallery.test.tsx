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

    // Verify clicking a different thumbnail shows the correct photo (not hardcoded to first)
    fireEvent.click(screen.getByTestId('gallery-thumb-b'))
    const lightbox2 = screen.getByTestId('gallery-lightbox')
    expect(lightbox2).toBeInTheDocument()
    expect(screen.getByAltText('Booth')).toHaveAttribute('src', 'b.jpg')

    fireEvent.click(lightbox2)
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument()
  })

  it('thumbnail buttons have accessible names via aria-label', () => {
    render(<StudioGallery photos={PHOTOS} />)
    const controlRoomButton = screen.getByRole('button', { name: 'Control room' })
    const boothButton = screen.getByRole('button', { name: 'Booth' })
    expect(controlRoomButton).toBeInTheDocument()
    expect(boothButton).toBeInTheDocument()
  })
})
