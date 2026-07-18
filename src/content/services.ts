export interface Service {
  name: string
  description: string
}

export const SERVICES: Service[] = [
  { name: 'Recording', description: 'Professional recording sessions in a fully treated studio space.' },
  { name: 'Music Production', description: 'End-to-end production, from arrangement to final track.' },
  { name: 'Mixing & Mastering', description: 'Polished, release-ready mixes and masters.' },
  { name: 'Audiobook Productions', description: 'Narration recording and post-production for audiobooks.' },
  {
    name: 'Music Distribution & Publishing',
    description: 'Getting your music onto every major platform.',
  },
]
