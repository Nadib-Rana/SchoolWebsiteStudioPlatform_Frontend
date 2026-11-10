'use client'

import { useState, useRef } from 'react'
import { api } from '@/lib/api-client'
import { useStudio } from '@/context/StudioContext'
import type { InspectAlbumData } from './gallery.types'

export function useAlbumInspector(
  loadGallery: () => Promise<void>,
  onCoverChange: (albumId: string, coverUrl: string) => void,
) {
  const { notify } = useStudio()
  const [inspectAlbum, setInspectAlbum] = useState<InspectAlbumData | null>(null)
  const [inspectLoading, setInspectLoading] = useState(false)
  const [inspectUploading, setInspectUploading] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const inspectFileInputRef = useRef<HTMLInputElement>(null)

  const [uploadingAlbumId, setUploadingAlbumId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeAlbumRef = useRef<string | null>(null)

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
      const msg = err instanceof Error ? err.message : 'Failed to upload photo.'
      notify(`Error: ${msg}`)
    } finally {
      setUploadingAlbumId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
      const msg = err instanceof Error ? err.message : 'Failed to load album details.'
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
      const msg = err instanceof Error ? err.message : 'Failed to upload photos.'
      notify(`Error: ${msg}`)
    } finally {
      setInspectUploading(false)
      if (inspectFileInputRef.current) inspectFileInputRef.current.value = ''
    }
  }

  const handleSetCover = async (photoUrl: string) => {
    if (!inspectAlbum) return
    try {
      await api.gallery.updateAlbum(inspectAlbum.id, { coverUrl: photoUrl })
      setInspectAlbum((prev) => (prev ? { ...prev, coverUrl: photoUrl } : null))
      onCoverChange(inspectAlbum.id, photoUrl)
      notify('Album cover photo updated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update album cover.'
      notify(`Error: ${msg}`)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!inspectAlbum) return
    if (!confirm('Are you sure you want to delete this photo from the album?')) return

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
      const msg = err instanceof Error ? err.message : 'Failed to delete photo.'
      notify(`Error: ${msg}`)
    } finally {
      setDeletingPhotoId(null)
    }
  }

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
      const msg = err instanceof Error ? err.message : 'Failed to add image to album.'
      notify(`Error: ${msg}`)
    }
  }

  return {
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
  }
}
