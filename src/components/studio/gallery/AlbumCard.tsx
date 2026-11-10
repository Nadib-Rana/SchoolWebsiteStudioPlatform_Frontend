'use client'

import { Icon } from '@/components/common/Icon'
import type { AlbumItem } from './gallery.types'

interface AlbumCardProps {
  album: AlbumItem
  index: number
  uploading: boolean
  onInspect: (id: string) => void
  onUploadClick: (id: string) => void
  onDeleteAlbum: (id: string, title: string) => void
}

export function AlbumCard({
  album,
  index,
  uploading,
  onInspect,
  onUploadClick,
  onDeleteAlbum,
}: AlbumCardProps) {
  return (
    <div className="card album group" key={album.id || album.title}>
      <div
        onClick={() => onInspect(album.id)}
        style={{
          backgroundImage: `url(${album.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
        }}
        title="Click to manage photos"
      >
        <span>{index === 0 ? 'Featured' : 'Published'}</span>
      </div>
      <section>
        <div>
          <h3
            onClick={() => onInspect(album.id)}
            className="cursor-pointer hover:text-blue-900 transition-colors"
          >
            {album.title}
          </h3>
          <p>{album.photosCount} photos · Synchronized with database</p>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onInspect(album.id)}
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
          >
            <Icon name="image" size={13} />
            Manage ({album.photosCount})
          </button>

          <button
            type="button"
            onClick={() => onUploadClick(album.id)}
            disabled={uploading}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 ml-2"
          >
            <Icon name="plus" size={13} />
            {uploading ? 'Uploading...' : 'Quick add'}
          </button>

          <button
            type="button"
            onClick={() => onDeleteAlbum(album.id, album.title)}
            className="ml-auto text-slate-400 hover:text-rose-600 transition-colors p-1"
            aria-label={`Delete ${album.title}`}
            title="Delete album"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </section>
    </div>
  )
}
