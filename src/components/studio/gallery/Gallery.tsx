'use client'

import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'
import { MediaPickerModal } from '@/components/studio/media/MediaPickerModal'
import type { AlbumItem } from './gallery.types'
import { StorageStrip } from './StorageStrip'
import { AlbumCard } from './AlbumCard'
import { AlbumInspectorModal } from './AlbumInspectorModal'
import { useAlbumInspector } from './useAlbumInspector'

export function Gallery() {
  const { notify } = useStudio()
  const [albums, setAlbums] = useState<AlbumItem[]>([])
  const [storageInfo, setStorageInfo] = useState({
    percentUsed: 48,
    formatted: '4.8 GB of 10 GB used',
  })
  const [loading, setLoading] = useState(true)

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
              description: a.description,
            })),
          )
        } else {
          setAlbums([])
        }
        const storage = data.storage || data.stats
        if (storage) {
          const usedFormatted = storage.usedMb
            ? `${storage.usedMb} MB`
            : storage.formattedUsed || '0 MB'
          const limitFormatted = storage.limitGb
            ? `${storage.limitGb} GB`
            : storage.formattedLimit || '10 GB'
          setStorageInfo({
            percentUsed:
              storage.usagePercent !== undefined
                ? storage.usagePercent
                : storage.percentUsed || 0,
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

  const handleCoverChange = (albumId: string, photoUrl: string) => {
    setAlbums((prev) =>
      prev.map((a) => (a.id === albumId ? { ...a, coverUrl: photoUrl } : a)),
    )
  }

  const {
    inspectAlbum,
    setInspectAlbum,
    inspectLoading,
    inspectUploading,
    showMediaPicker,
    setShowMediaPicker,
    deletingPhotoId,
    inspectFileInputRef,
    uploadingAlbumId,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    openInspectAlbum,
    handleInspectFilesUpload,
    handleSetCover,
    handleDeletePhoto,
    handleSelectFromLibrary,
  } = useAlbumInspector(loadGallery, handleCoverChange)

  const handleDeleteAlbum = async (albumId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete album "${title}"?`)) return
    try {
      await api.gallery.deleteAlbum(albumId)
      setAlbums((prev) => prev.filter((a) => a.id !== albumId))
      if (inspectAlbum?.id === albumId) {
        setInspectAlbum(null)
      }
      notify(`Album "${title}" deleted successfully.`)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete album.'
      notify(`Error: ${msg}`)
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
      <input
        type="file"
        ref={inspectFileInputRef}
        onChange={handleInspectFilesUpload}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <StorageStrip
        percentUsed={storageInfo.percentUsed}
        formatted={storageInfo.formatted}
        onRefresh={async () => {
          await loadGallery()
          notify('Storage usage and albums refreshed from database')
        }}
      />

      <div className="album-grid">
        {albums.map((x, i) => (
          <AlbumCard
            key={x.id || x.title}
            album={x}
            index={i}
            uploading={uploadingAlbumId === x.id}
            onInspect={openInspectAlbum}
            onUploadClick={handleUploadClick}
            onDeleteAlbum={handleDeleteAlbum}
          />
        ))}

        {albums.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            No photo albums created yet. Click "+ Create album" above to start.
          </div>
        )}
      </div>

      <AlbumInspectorModal
        album={inspectAlbum}
        loading={inspectLoading}
        uploading={inspectUploading}
        deletingPhotoId={deletingPhotoId}
        fileInputRef={inspectFileInputRef}
        onClose={() => {
          setInspectAlbum(null)
          void loadGallery()
        }}
        onOpenMediaPicker={() => setShowMediaPicker(true)}
        onSetCover={handleSetCover}
        onDeletePhoto={handleDeletePhoto}
      />

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleSelectFromLibrary}
        title="Add Image to Album"
      />
    </>
  )
}
