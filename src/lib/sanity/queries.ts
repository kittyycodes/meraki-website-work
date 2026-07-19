import { sanityClient } from './client'
import type {
  TeamMember,
  ClientLogo,
  WorkSample,
  StudioPhoto,
  EquipmentItem,
  AdCampaign,
  SiteSettings,
} from './types'

export async function getTeamMembers(): Promise<TeamMember[]> {
  return sanityClient.fetch(`*[_type == "teamMember"]{
    _id, name, role, bio, "photoUrl": photo.asset->url, socialLinks
  }`)
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  return sanityClient.fetch(`*[_type == "clientLogo"]{
    _id, name, "logoUrl": logo.asset->url
  }`)
}

export async function getWorkSamples(): Promise<WorkSample[]> {
  return sanityClient.fetch(`*[_type == "workSample"]{
    _id, title, category, "imageUrl": image.asset->url, description, featured
  }`)
}

export async function getFeaturedWorkSamples(): Promise<WorkSample[]> {
  return sanityClient.fetch(`*[_type == "workSample" && featured == true]{
    _id, title, category, "imageUrl": image.asset->url, description, featured
  }`)
}

export async function getStudioPhotos(): Promise<StudioPhoto[]> {
  return sanityClient.fetch(`*[_type == "studioPhoto"]{
    _id, "imageUrl": image.asset->url, caption
  }`)
}

export async function getEquipment(): Promise<EquipmentItem[]> {
  return sanityClient.fetch(`*[_type == "equipmentItem"]{
    _id, name, specLine, "imageUrl": image.asset->url
  }`)
}

export async function getActiveAdCampaign(): Promise<AdCampaign | null> {
  const result = await sanityClient.fetch<AdCampaign[]>(`*[_type == "adCampaign" && active == true]{
    _id, "imageUrl": image.asset->url, "linkUrl": link, active
  }`)
  return result[0] ?? null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityClient.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]{
    address, phone, email, whatsappNumber, mapsEmbedUrl, termsText
  }`)
  return (
    result ?? {
      address: '',
      phone: '',
      email: '',
      whatsappNumber: '',
      mapsEmbedUrl: '',
      termsText: '',
    }
  )
}
