'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

export interface MediaItem {
  id?: string
  url: string
  name: string
  size: string
  mimeType?: string
  key?: string
}

export function MediaLibrary() {
  const { notify } = useStudio()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'All files' | 'Images' | 'Documents'>('All files')
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const res = await api.gallery.getMedia()
      const data = (res as any)?.data || res
      if (Array.isArray(data)) {
        const mapped: MediaItem[] = data.map((m: any) => ({
          id: m.id,
          url: m.url || '',
          name: m.originalName || m.filename,
          size:
            m.sizeFormatted ||
            `${((m.sizeBytes || 1048576) / (1024 * 1024)).toFixed(1)} MB`,
          mimeType: m.mimeType,
          key: m.filename,
        }))
        setItems(mapped)
      } else {
        setItems([])
      }
    } catch (err) {
      console.warn('Failed to load media items from backend:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchMedia()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadRes = await api.storage.upload(file)
      const isImg = file.type.startsWith('image/')

      // Register media asset in PostgreSQL
      const created = await api.gallery.createMedia({
        filename: uploadRes.key,
        originalName: file.name,
        mimeType: file.type || (isImg ? 'image/jpeg' : 'application/octet-stream'),
        sizeBytes: file.size,
        url: uploadRes.publicUrl,
        category: isImg ? 'IMAGE' : 'DOCUMENT',
      })

      const newId = (created as any)?.data?.id || (created as any)?.id
      const newEntry: MediaItem = {
        id: newId,
        url: uploadRes.publicUrl,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mimeType: file.type,
        key: uploadRes.key,
      }

      setItems((prev) => [newEntry, ...prev])
      notify(`Uploaded "${file.name}" to storage successfully`)
    } catch (err: unknown) {
      console.error('Upload to storage failed:', err)
      const msg = err instanceof Error ? err.message : 'File upload failed'
      notify(`Error: ${msg}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (item: MediaItem) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Are you sure you want to delete "${item.name}" from media library?`)
    ) {
      return
    }

    if (item.id) {
      setDeletingId(item.id)
      try {
        await api.gallery.deleteMedia(item.id)
        if (item.key) {
          try {
            await api.storage.delete(item.key)
          } catch {
            // Storage key removal best-effort
          }
        }
        setItems((prev) => prev.filter((x) => x.id !== item.id))
        notify(`Deleted "${item.name}" successfully`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete asset'
        notify(`Error: ${msg}`)
      } finally {
        setDeletingId(null)
      }
    } else {
      setItems((prev) => prev.filter((x) => x.name !== item.name))
      notify(`Removed "${item.name}"`)
    }
  }

  const handleCopyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(url)
      notify('Public URL copied to clipboard')
    } else {
      notify(`URL: ${url}`)
    }
  }

  const filtered = items.filter((x) => {
    const matchesQuery = x.name.toLowerCase().includes(query.toLowerCase())
    const isImage = Boolean(x.url) && (!x.mimeType || x.mimeType.startsWith('image/'))
    const matchesType =
      type === 'All files' || (type === 'Images' ? isImage : !isImage)
    return matchesQuery && matchesType
  })

  const cycleType = () => {
    setType(
      type === 'All files' ? 'Images' : type === 'Images' ? 'Documents' : 'All files',
    )
  }

  return (
    <>
      <div className="media-toolbar">
        <div className="search-field wide">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files and documents..."
          />
        </div>
        <button type="button" className="select-button" onClick={cycleType}>
          {type} <Icon name="chevron" size={13} />
        </button>
        {query && (
          <button
            type="button"
            className="select-button"
            onClick={() => setQuery('')}
          >
            Clear search <Icon name="close" size={13} />
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
        />
        <Button
          kind="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading to storage...' : 'Upload file'}
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading media library...
        </div>
      ) : filtered.length ? (
        <div className="media-grid">
          {filtered.map((x) => {
            const isImg = Boolean(x.url) && (!x.mimeType || x.mimeType.startsWith('image/'))
            return (
              <div className="card media-item" key={x.id || x.name}>
                <div
                  className={isImg ? 'media-photo' : 'document'}
                  style={isImg ? { backgroundImage: `url(${x.url})` } : {}}
                >
                  {!isImg && (
                    <>
                      <Icon name="file" size={28} />
                      <span>PDF</span>
                    </>
                  )}
                </div>
                <section>
                  <strong title={x.name} className="truncate block">
                    {x.name}
                  </strong>
                  <small>{x.size} · Stored in S3</small>
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                    {x.url && (
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(x.url)}
                        title="Copy public URL"
                        className="p-1 rounded text-slate-500 hover:text-blue-900 hover:bg-slate-100 text-xs flex items-center gap-1"
                      >
                        <Icon name="external" size={13} /> Copy link
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(x)}
                      disabled={deletingId === x.id}
                      title="Delete asset"
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs ml-auto flex items-center gap-1"
                    >
                      <Icon name="close" size={13} /> Delete
                    </button>
                  </div>
                </section>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <span>
            <Icon name="image" size={32} />
          </span>
          <strong>No media files found</strong>
          <p>
            {query
              ? 'No files matching your search filter.'
              : 'Upload images, banners, circulars, or documents to your school media library.'}
          </p>
          <Button
            kind="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Upload first file
          </Button>
        </div>
      )}
    </>
  )
}
