import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWorkSamples } from '@/lib/sanity/queries'
import { ThemeProvider } from '@/context/ThemeContext'
import OurWorksPage from './page'

vi.mock('@/lib/sanity/queries', () => ({
  getWorkSamples: vi.fn(),
}))

const getWorkSamplesMock = vi.mocked(getWorkSamples)

beforeEach(() => {
  getWorkSamplesMock.mockReset()
  window.localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('OurWorksPage', () => {
  it('groups work samples under their category heading', async () => {
    getWorkSamplesMock.mockResolvedValueOnce([
      { _id: '1', title: 'Podcast Series', category: 'Audiobook Productions', imageUrl: 'p.jpg', description: '', featured: false },
      { _id: '2', title: 'Live Session', category: 'Recording', imageUrl: 'l.jpg', description: '', featured: false },
    ])

    render(
      <ThemeProvider>
        <OurWorksPage />
      </ThemeProvider>
    )

    await waitFor(() => expect(screen.getByText('Podcast Series')).toBeInTheDocument())

    const audiobookSection = screen.getByText('Audiobook Productions').closest('section')
    expect(audiobookSection).not.toBeNull()
    expect(within(audiobookSection as HTMLElement).getByText('Podcast Series')).toBeInTheDocument()

    const recordingSection = screen.getByText('Recording').closest('section')
    expect(recordingSection).not.toBeNull()
    expect(within(recordingSection as HTMLElement).getByText('Live Session')).toBeInTheDocument()
  })
})
