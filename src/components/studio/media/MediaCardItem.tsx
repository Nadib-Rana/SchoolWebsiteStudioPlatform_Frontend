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

  return (
    <div className="card media-item" key={item.id || item.name}>
      <div
        className={isImg ? 'media-photo' : 'document'}
        style={isImg ? { backgroundImage: `url(${item.url})` } : {}}
      >
        {!isImg && (
          <>
            <Icon name="file" size={28} />
            <span>PDF</span>
          </>
        )}
      </div>
      <section>
        <strong title={item.name} className="truncate block">
          {item.name}
        </strong>
        <small>{item.size} · Stored in S3</small>
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
          {item.url && (
            <button
              type="button"
              onClick={() => onCopyUrl(item.url)}
              title="Copy public URL"
              className="p-1 rounded text-slate-500 hover:text-blue-900 hover:bg-slate-100 text-xs flex items-center gap-1"
            >
              <Icon name="external" size={13} /> Copy link
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={deletingId === item.id}
            title="Delete asset"
            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs ml-auto flex items-center gap-1"
          >
            <Icon name="close" size={13} /> Delete
          </button>
        </div>
      </section>
    </div>
  )
}
