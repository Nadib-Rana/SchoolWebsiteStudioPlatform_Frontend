'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState, useRef } from 'react'
import { MediaPickerModal } from '@/components/studio/media/MediaPickerModal'

interface AlbumItem {
  id: string
  title: string
  coverUrl: string
  photosCount: number
  description?: string
}

interface PhotoItem {
  id: string
  url: string
  caption?: string
  thumbnailUrl?: string
  order?: number
}

interface InspectAlbumData {
  id: string
  title: string
  description?: string
  coverUrl?: string
  photos: PhotoItem[]
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

  // Album Inspector state
  const [inspectAlbum, setInspectAlbum] = useState<InspectAlbumData | null>(null)
  const [inspectLoading, setInspectLoading] = useState(false)
  const [inspectUploading, setInspectUploading] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const inspectFileInputRef = useRef<HTMLInputElement>(null)

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

  // Open album inspector
  const openInspectAlbum = async (albumId: string) => {
    setInspectLoading(true)
    try {
      const res = await api.gallery.getAlbum(albumId)
      const data = (res as any)?.data || res
      if (data) {
        setInspectAlbum({
          id: data.id,
          title: data.title,
          description: data.description,
          coverUrl: data.coverUrl,
          photos: data.photos || [],
        })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load album details.'
      notify(`Error: ${msg}`)
    } finally {
      setInspectLoading(false)
    }
  }

  const refreshInspectAlbum = async () => {
    if (!inspectAlbum) return
    try {
      const res = await api.gallery.getAlbum(inspectAlbum.id)
      const data = (res as any)?.data || res
      if (data) {
        setInspectAlbum({
          id: data.id,
          title: data.title,
          description: data.description,
          coverUrl: data.coverUrl,
          photos: data.photos || [],
        })
      }
    } catch (err) {
      console.warn('Failed to refresh album details:', err)
    }
  }

  // Inspector multi-file upload
  const handleInspectFilesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || [])
    if (!files.length || !inspectAlbum) return

    setInspectUploading(true)
    try {
      let count = 0
      for (const file of files) {
        const uploadRes = await api.storage.upload(file)
        await api.gallery.addPhotoToAlbum(inspectAlbum.id, {
          url: uploadRes.publicUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        })
        count++
      }
      notify(`Successfully added ${count} photo${count > 1 ? 's' : ''} to album!`)
      await refreshInspectAlbum()
      await loadGallery()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to upload photos.'
      notify(`Error: ${msg}`)
    } finally {
      setInspectUploading(false)
      if (inspectFileInputRef.current) inspectFileInputRef.current.value = ''
    }
  }

  // Set photo as album cover
  const handleSetCover = async (photoUrl: string) => {
    if (!inspectAlbum) return
    try {
      await api.gallery.updateAlbum(inspectAlbum.id, { coverUrl: photoUrl })
      setInspectAlbum((prev) => (prev ? { ...prev, coverUrl: photoUrl } : null))
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === inspectAlbum.id ? { ...a, coverUrl: photoUrl } : a,
        ),
      )
      notify('Album cover photo updated!')
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update album cover.'
      notify(`Error: ${msg}`)
    }
  }

  // Delete photo from album
  const handleDeletePhoto = async (photoId: string) => {
    if (!inspectAlbum) return
    if (!confirm('Are you sure you want to delete this photo from the album?')) {
      return
    }

    setDeletingPhotoId(photoId)
    try {
      await api.gallery.deletePhoto(inspectAlbum.id, photoId)
      setInspectAlbum((prev) => {
        if (!prev) return null
        const filtered = prev.photos.filter((p) => p.id !== photoId)
        return {
          ...prev,
          photos: filtered,
          coverUrl:
            prev.photos.find((p) => p.id === photoId)?.url === prev.coverUrl
              ? filtered[0]?.url || undefined
              : prev.coverUrl,
        }
      })
      notify('Photo removed from album and storage.')
      await loadGallery()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete photo.'
      notify(`Error: ${msg}`)
    } finally {
      setDeletingPhotoId(null)
    }
  }

  // Handle image selected from media library modal
  const handleSelectFromLibrary = async (url: string) => {
    if (!inspectAlbum) return
    setShowMediaPicker(false)
    try {
      await api.gallery.addPhotoToAlbum(inspectAlbum.id, {
        url,
        caption: 'Gallery photo',
      })
      notify('Image from Media Library added to album!')
      await refreshInspectAlbum()
      await loadGallery()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to add image to album.'
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

      <div className="storage-strip">
        <Icon name="image" />
        <div>
          <strong>Media storage (MinIO)</strong>
          <span>
            <i style={{ width: `${storageInfo.percentUsed}%` }} />
          </span>
        </div>
        <b>{storageInfo.formatted}</b>
        <Button
          onClick={async () => {
            await loadGallery()
            notify('Storage usage and albums refreshed from database')
          }}
        >
          Refresh status
        </Button>
      </div>

      <div className="album-grid">
        {albums.map((x, i) => (
          <div className="card album group" key={x.id || x.title}>
            <div
              onClick={() => openInspectAlbum(x.id)}
              style={{
                backgroundImage: `url(${x.coverUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
              }}
              title="Click to manage photos"
            >
              <span>{i === 0 ? 'Featured' : 'Published'}</span>
            </div>
            <section>
              <div>
                <h3
                  onClick={() => openInspectAlbum(x.id)}
                  className="cursor-pointer hover:text-blue-900 transition-colors"
                >
                  {x.title}
                </h3>
                <p>
                  {x.photosCount} photos · Synchronized with database
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openInspectAlbum(x.id)}
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <Icon name="image" size={13} />
                  Manage ({x.photosCount})
                </button>

                <button
                  type="button"
                  onClick={() => handleUploadClick(x.id)}
                  disabled={uploadingAlbumId === x.id}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 ml-2"
                >
                  <Icon name="plus" size={13} />
                  {uploadingAlbumId === x.id ? 'Uploading...' : 'Quick add'}
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

      {/* Album Photos Inspector Modal */}
      {inspectAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 flex items-center justify-center text-blue-900">
                  <Icon name="image" size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {inspectAlbum.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {inspectAlbum.photos.length} photos in album · Click any photo to make it cover
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inspectFileInputRef.current?.click()}
                  disabled={inspectUploading}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Icon name="plus" size={13} />
                  {inspectUploading ? 'Uploading...' : 'Upload Photos'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Icon name="image" size={13} />
                  Choose from Library
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInspectAlbum(null)
                    void loadGallery()
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors ml-2"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body: Photos Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {inspectLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">
                  Loading album photos...
                </div>
              ) : inspectAlbum.photos.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Icon name="image" size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No photos in this album yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                    Upload images from school sports, academic fairs, ceremonies, or campus activities to display on the public website.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => inspectFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Upload from Computer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(true)}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
                    >
                      Select from Media Library
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {inspectAlbum.photos.map((photo) => {
                    const isCover = inspectAlbum.coverUrl === photo.url
                    const isDeleting = deletingPhotoId === photo.id

                    return (
                      <div
                        key={photo.id}
                        className={`group relative rounded-xl overflow-hidden border bg-slate-50 flex flex-col transition-all shadow-sm ${
                          isCover
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Photo Thumbnail */}
                        <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.caption || 'Album photo'}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />

                          {/* Cover Badge */}
                          {isCover && (
                            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                              <span>★</span> Cover
                            </div>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(photo.url)}
                                className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[11px] font-bold shadow-md transition-transform hover:scale-105"
                                title="Set as album cover"
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              disabled={isDeleting}
                              className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center text-xs shadow-md transition-transform hover:scale-105 disabled:opacity-50"
                              title="Delete photo from album and storage"
                            >
                              <Icon name="close" size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Caption / Info Footer */}
                        {photo.caption && (
                          <div className="p-2 text-[11px] text-slate-600 font-medium truncate">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span>
                {inspectAlbum.photos.length} photo
                {inspectAlbum.photos.length === 1 ? '' : 's'} total
              </span>
              <button
                type="button"
                onClick={() => {
                  setInspectAlbum(null)
                  void loadGallery()
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Album */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleSelectFromLibrary}
        title="Add Image to Album"
      />
    </>
  )
}
