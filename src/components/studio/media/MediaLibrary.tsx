'use client'

import { useState, useEffect, useRef } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { MediaItem } from './media-library.types'
import { MediaCardItem } from './MediaCardItem'
import { MediaLibraryEmptyState } from './MediaLibraryEmptyState'
import { MediaToolbar } from './MediaToolbar'

export type { MediaItem }

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
      <MediaToolbar
        query={query}
        onQueryChange={setQuery}
        type={type}
        onCycleType={cycleType}
        uploading={uploading}
        fileInputRef={fileInputRef}
        onFileUpload={handleFileUpload}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading media library...
        </div>
      ) : filtered.length ? (
        <div className="media-grid">
          {filtered.map((x) => (
            <MediaCardItem
              key={x.id || x.name}
              item={x}
              deletingId={deletingId}
              onCopyUrl={handleCopyUrl}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <MediaLibraryEmptyState
          query={query}
          uploading={uploading}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      )}
    </>
  )
}
