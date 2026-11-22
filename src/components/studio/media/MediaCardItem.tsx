'use client'

import { Icon } from '@/components/common/Icon'
import type { MediaItem } from './media-library.types'

interface MediaCardItemProps {
  item: MediaItem
  deletingId: string | null
  onCopyUrl: (url: string) => void
  onDelete: (item: MediaItem) => void
}

export function MediaCardItem({
  item,
  deletingId,
  onCopyUrl,
  onDelete,
}: MediaCardItemProps) {
  const isImg = Boolean(item.url) && (!item.mimeType || item.mimeType.startsWith('image/'))
  const isDeleting = Boolean(item.id && deletingId === item.id)

  return (
    <div className="card media-item group" key={item.id || item.name}>
      <div
        className={`${isImg ? 'media-photo' : 'document'} relative`}
        style={isImg ? { backgroundImage: `url(${item.url})` } : {}}
      >
        {!isImg && (
          <>
            <Icon name="file" size={28} />
            <span>PDF</span>
          </>
        )}

        {/* Floating Quick Action Icon Buttons on Top-Right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {item.url && (
            <button
              type="button"
              onClick={() => onCopyUrl(item.url)}
              title="Copy public URL"
              aria-label={`Copy URL for ${item.name}`}
              className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-700 hover:text-blue-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
            >
              <Icon name="copy" size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={isDeleting}
            title="Delete file"
            aria-label={`Delete ${item.name}`}
            className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md border border-rose-500 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <strong title={item.name} className="truncate block">
              {item.name}
            </strong>
            <small>{item.size} · Stored in S3</small>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {item.url && (
              <button
                type="button"
                onClick={() => onCopyUrl(item.url)}
                title="Copy public URL"
                aria-label={`Copy link for ${item.name}`}
                className="w-7 h-7 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon name="copy" size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={isDeleting}
              title="Delete asset"
              aria-label={`Delete ${item.name}`}
              className="w-7 h-7 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
