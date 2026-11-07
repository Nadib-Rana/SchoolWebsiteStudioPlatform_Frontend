'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage, interiorImage } from '@/config/templates'
import type { AlbumData } from '@/lib/public-site'

interface GalleryViewerProps {
  albums: AlbumData[]
  schoolSlug: string
  schoolName?: string
}

export function GalleryViewer({
  albums,
  schoolSlug,
}: GalleryViewerProps) {
  const fallbackImages = [
    campusImage,
    interiorImage,
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {albums.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, idx) => {
            const cover =
              album.coverUrl ||
              album.photos?.[0]?.url ||
              fallbackImages[idx % fallbackImages.length]
            const photosCount = album.photosCount || album.photos?.length || 0

            return (
              <article
                key={album.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <Link
                  href={`/${schoolSlug}/gallery/${album.slug || album.id}`}
                  className="block relative aspect-4/3 overflow-hidden bg-slate-100"
                >
                  <img
                    src={cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-xs font-bold inline-flex items-center gap-1.5">
                      Open Album <Icon name="arrow" size={12} />
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {photosCount} {photosCount === 1 ? 'Photo' : 'Photos'}
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {album.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {album.category}
                      </span>
                    )}
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
                      <Link
                        href={`/${schoolSlug}/gallery/${album.slug || album.id}`}
                        className="hover:text-blue-900 transition-colors"
                      >
                        {album.title}
                      </Link>
                    </h2>
                    {album.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/${schoolSlug}/gallery/${album.slug || album.id}`}
                      className="text-xs font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
                    >
                      View collection <Icon name="arrow" size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Icon name="image" size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-serif font-semibold text-slate-800">
            No photo albums published yet
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Check back soon as our students and staff capture moments from campus life.
          </p>
        </div>
      )}
    </div>
  )
}
