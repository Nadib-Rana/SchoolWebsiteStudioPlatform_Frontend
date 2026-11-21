'use client'

import { useState, useRef } from 'react'
import { api } from '@/lib/api-client'
import type { MediaAssetItem } from './media-picker.types'

export function useMediaPickerAssets(onAssetUploaded: (url: string) => void) {
  const [assets, setAssets] = useState<MediaAssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadAssets = async () => {
    setLoading(true)
    try {
      const res = await api.gallery.getMedia()
      const data = (res as any)?.data || res
      if (Array.isArray(data)) {
        const mapped = data
          .filter((item: any) => {
            const mime = item.mimeType || ''
            return !mime || mime.startsWith('image/')
          })
          .map((m: any) => ({
            id: m.id,
            url: m.url,
            name: m.originalName || m.filename || 'Media file',
            size:
              m.sizeFormatted ||
              `${((m.sizeBytes || 1048576) / (1024 * 1024)).toFixed(1)} MB`,
            mimeType: m.mimeType,
            key: m.filename,
          }))
        setAssets(mapped)
      }
    } catch (err) {
      console.warn('Failed to load media assets for picker:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    try {
      const uploadRes = await api.storage.upload(file)
      const created = await api.gallery.createMedia({
        filename: uploadRes.key,
        originalName: file.name,
        mimeType: file.type || 'image/jpeg',
        sizeBytes: file.size,
        url: uploadRes.publicUrl,
        category: 'IMAGE',
      })
      const newId = (created as any)?.data?.id || (created as any)?.id

      const newAsset: MediaAssetItem = {
        id: newId,
        url: uploadRes.publicUrl,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mimeType: file.type,
        key: uploadRes.key,
      }
      setAssets((prev) => [newAsset, ...prev])
      onAssetUploaded(uploadRes.publicUrl)
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAsset = async (
    asset: MediaAssetItem,
    onDeletedUrl?: (url: string) => void,
  ) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Delete "${asset.name}" permanently from Media Library?`)
    ) {
      return
    }
    if (!asset.id) {
      setAssets((prev) => prev.filter((a) => a.url !== asset.url))
      onDeletedUrl?.(asset.url)
      return
    }
    setDeletingId(asset.id)
    setUploadError(null)
    try {
      await api.gallery.deleteMedia(asset.id)
      if (asset.key) {
        try {
          await api.storage.delete(asset.key)
        } catch {
          // Best-effort S3/MinIO object cleanup
        }
      }
      setAssets((prev) => prev.filter((a) => a.id !== asset.id))
      onDeletedUrl?.(asset.url)
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to delete image.')
    } finally {
      setDeletingId(null)
    }
  }

  return {
    assets,
    loading,
    uploading,
    deletingId,
    uploadError,
    fileInputRef,
    loadAssets,
    handleFileUpload,
    handleDeleteAsset,
  }
}
