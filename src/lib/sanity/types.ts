export interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photoUrl: string
  socialLinks: { platform: string; url: string }[]
}

export interface ClientLogo {
  _id: string
  name: string
  logoUrl: string
}

export type ServiceCategory =
  | 'Recording'
  | 'Music Production'
  | 'Mixing & Mastering'
  | 'Audiobook Productions'
  | 'Music Distribution & Publishing'

export interface WorkSample {
  _id: string
  title: string
  category: ServiceCategory
  imageUrl: string
  description: string
  featured: boolean
}

export interface StudioPhoto {
  _id: string
  imageUrl: string
  caption: string
}

export interface EquipmentItem {
  _id: string
  name: string
  specLine: string
  imageUrl: string
}

export interface AdCampaign {
  _id: string
  imageUrl: string
  linkUrl: string
  active: boolean
}

export interface SiteSettings {
  address: string
  phone: string
  email: string
  whatsappNumber: string
  mapsEmbedUrl: string
  termsText: string
}
