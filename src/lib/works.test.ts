import { describe, it, expect } from 'vitest'
import { groupWorksByCategory, SERVICE_CATEGORIES } from './works'
import type { WorkSample } from './sanity/types'

const WORKS: WorkSample[] = [
  { _id: '1', title: 'Track A', category: 'Recording', imageUrl: 'a.jpg', description: '', featured: false },
  { _id: '2', title: 'Track B', category: 'Mixing & Mastering', imageUrl: 'b.jpg', description: '', featured: false },
  { _id: '3', title: 'Track C', category: 'Recording', imageUrl: 'c.jpg', description: '', featured: false },
]

describe('groupWorksByCategory', () => {
  it('groups works under their category and keeps every category present', () => {
    const grouped = groupWorksByCategory(WORKS)
    expect(grouped['Recording'].map((w) => w._id)).toEqual(['1', '3'])
    expect(grouped['Mixing & Mastering'].map((w) => w._id)).toEqual(['2'])
    expect(grouped['Music Production']).toEqual([])
  })

  it('returns every category with an empty array for an empty input', () => {
    const grouped = groupWorksByCategory([])
    for (const category of SERVICE_CATEGORIES) {
      expect(grouped[category]).toEqual([])
    }
  })
})
