import type { WorkSample, ServiceCategory } from './sanity/types'

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Recording',
  'Music Production',
  'Mixing & Mastering',
  'Audiobook Productions',
  'Music Distribution & Publishing',
]

export function groupWorksByCategory(works: WorkSample[]): Record<ServiceCategory, WorkSample[]> {
  const grouped = SERVICE_CATEGORIES.reduce((acc, category) => {
    acc[category] = []
    return acc
  }, {} as Record<ServiceCategory, WorkSample[]>)

  for (const work of works) {
    grouped[work.category].push(work)
  }

  return grouped
}
