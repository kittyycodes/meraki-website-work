import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStudioPhotos, getEquipment } from '@/lib/sanity/queries'
import { Studio } from './Studio'

vi.mock('@/lib/sanity/queries', () => ({
  getStudioPhotos: vi.fn(),
  getEquipment: vi.fn(),
}))

const getStudioPhotosMock = vi.mocked(getStudioPhotos)
const getEquipmentMock = vi.mocked(getEquipment)

beforeEach(() => {
  getStudioPhotosMock.mockReset()
  getEquipmentMock.mockReset()
})

describe('Studio', () => {
  it('renders fetched photos and equipment', async () => {
    getStudioPhotosMock.mockResolvedValueOnce([{ _id: 'p1', imageUrl: 'photo.jpg', caption: 'Live room' }])
    getEquipmentMock.mockResolvedValueOnce([{ _id: 'e1', name: 'SSL Console', specLine: '48-channel', imageUrl: 'ssl.jpg' }])

    render(<Studio />)

    await waitFor(() => expect(screen.getByTestId('gallery-thumb-p1')).toBeInTheDocument())
    expect(screen.getByTestId('equipment-e1')).toBeInTheDocument()
  })
})
