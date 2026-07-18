'use client'
import { useState } from 'react'
import type { StudioPhoto } from '@/lib/sanity/types'

export function StudioGallery({ photos }: { photos: StudioPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<StudioPhoto | null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4" data-testid="studio-gallery-grid">
        {photos.map((photo) => (
          <button key={photo._id} onClick={() => setActivePhoto(photo)} data-testid={`gallery-thumb-${photo._id}`}>
            <img src={photo.imageUrl} alt="" className="w-full h-40 object-cover rounded" />
          </button>
        ))}
      </div>
      {activePhoto && (
        <div
          data-testid="gallery-lightbox"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
        >
          <img src={activePhoto.imageUrl} alt={activePhoto.caption} className="max-h-[80vh] max-w-[90vw]" />
        </div>
      )}
    </div>
  )
}
