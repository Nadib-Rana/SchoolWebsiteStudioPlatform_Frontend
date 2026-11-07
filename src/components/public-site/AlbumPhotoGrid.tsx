'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import type { GalleryPhotoData } from '@/lib/public-site'

interface AlbumPhotoGridProps {
  photos: GalleryPhotoData[]
  albumTitle: string
}

export function AlbumPhotoGrid({ photos, albumTitle }: AlbumPhotoGridProps) {
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoData | null>(null)

  return (
    <div>
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => setActivePhoto(photo)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.caption || `${albumTitle} photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                {photo.caption ? (
                  <p className="text-white text-xs line-clamp-2 leading-snug">
                    {photo.caption}
                  </p>
                ) : (
                  <span className="text-white text-[11px] font-medium flex items-center gap-1">
                    <Icon name="search" size={13} /> View full photo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">
            No photos have been added to this album yet.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <Icon name="close" size={24} />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.url}
              alt={activePhoto.caption || albumTitle}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {activePhoto.caption && (
              <p className="mt-4 text-white text-sm text-center max-w-2xl bg-black/60 px-4 py-2 rounded-lg">
                {activePhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
