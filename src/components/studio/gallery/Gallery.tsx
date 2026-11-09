'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState, useRef } from 'react'

interface AlbumItem {
  id: string
  title: string
  coverUrl: string
  photosCount: number
}

export function Gallery() {
  const { notify } = useStudio()
  const [albums, setAlbums] = useState<AlbumItem[]>([])
  const [storageInfo, setStorageInfo] = useState({
    percentUsed: 48,
    formatted: '4.8 GB of 10 GB used',
  })
  const [loading, setLoading] = useState(true)
  const [uploadingAlbumId, setUploadingAlbumId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeAlbumRef = useRef<string | null>(null)

  const loadGallery = async () => {
    try {
      const res = await api.gallery.getOverview()
      const data = (res as any)?.data || res
      if (data) {
        if (data.albums?.length) {
          setAlbums(
            data.albums.map((a: any) => ({
              id: a.id,
              title: a.title,
              coverUrl: a.coverUrl || heroImage,
              photosCount: a.photosCount || a.photos?.length || 0,
            })),
          )
        } else {
          setAlbums([])
        }
        const storage = data.storage || data.stats
        if (storage) {
          const usedFormatted = storage.usedMb ? `${storage.usedMb} MB` : (storage.formattedUsed || '0 MB')
          const limitFormatted = storage.limitGb ? `${storage.limitGb} GB` : (storage.formattedLimit || '10 GB')
          setStorageInfo({
            percentUsed: storage.usagePercent !== undefined ? storage.usagePercent : (storage.percentUsed || 0),
            formatted: `${usedFormatted} of ${limitFormatted} used`,
          })
        }
      }
    } catch (err) {
      console.warn('Failed to load gallery overview:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadGallery()
  }, [])

  const handleDeleteAlbum = async (albumId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete album "${title}"?`)) return
    try {
      await api.gallery.deleteAlbum(albumId)
      setAlbums((prev) => prev.filter((a) => a.id !== albumId))
      notify(`Album "${title}" deleted successfully.`)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete album.'
      notify(`Error: ${msg}`)
    }
  }

  const handleUploadClick = (albumId: string) => {
    activeAlbumRef.current = albumId
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const albumId = activeAlbumRef.current
    if (!file || !albumId) return

    setUploadingAlbumId(albumId)
    try {
      const uploadRes = await api.storage.upload(file)
      await api.gallery.addPhotoToAlbum(albumId, {
        url: uploadRes.publicUrl,
        caption: file.name.replace(/\.[^/.]+$/, ''),
      })
      notify(`Photo "${file.name}" added to album!`)
      await loadGallery()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to upload photo.'
      notify(`Error: ${msg}`)
    } finally {
      setUploadingAlbumId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="storage-strip">
        <Icon name="image" />
        <div>
          <strong>Media storage (MinIO)</strong>
          <span>
            <i style={{ width: `${storageInfo.percentUsed}%` }} />
          </span>
        </div>
        <b>{storageInfo.formatted}</b>
        <Button onClick={() => notify('Storage usage refreshed')}>
          Refresh status
        </Button>
      </div>

      <div className="album-grid">
        {albums.map((x, i) => (
          <div className="card album" key={x.id || x.title}>
            <div
              style={{
                backgroundImage: `url(${x.coverUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span>{i === 0 ? 'Featured' : 'Published'}</span>
            </div>
            <section>
              <div>
                <h3>{x.title}</h3>
                <p>
                  {x.photosCount} photos · Synchronized with database
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleUploadClick(x.id)}
                  disabled={uploadingAlbumId === x.id}
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <Icon name="plus" size={13} />
                  {uploadingAlbumId === x.id ? 'Uploading...' : 'Add photo'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteAlbum(x.id, x.title)}
                  className="ml-auto text-slate-400 hover:text-rose-600 transition-colors p-1"
                  aria-label={`Delete ${x.title}`}
                  title="Delete album"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            </section>
          </div>
        ))}

        {albums.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            No photo albums created yet. Click "+ Create album" above to start.
          </div>
        )}
      </div>
    </>
  )
}
