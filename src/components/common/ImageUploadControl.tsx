'use client'

import { useState, useRef } from 'react'
import { MediaPickerModal } from '@/components/studio/media/MediaPickerModal'
import { api } from '@/lib/api-client'
import { ImageUploadPreview } from './ImageUploadPreview'
import { ImageUploadActions } from './ImageUploadActions'
import type { ImageUploadControlProps } from './image-upload.types'

export type { ImageUploadControlProps }

export function ImageUploadControl({
  value,
  onChange,
  label,
  helperText,
  aspectRatio = 'video',
  fallbackInitial,
  placeholderText = 'No image selected',
  pickerTitle = 'Select Image',
}: ImageUploadControlProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadRes = await api.storage.upload(file)
      await api.gallery.createMedia({
        filename: uploadRes.key,
        originalName: file.name,
        mimeType: file.type || 'image/jpeg',
        sizeBytes: file.size,
        url: uploadRes.publicUrl,
        category: 'IMAGE',
      })
      onChange(uploadRes.publicUrl)
    } catch (err: any) {
      console.error('Direct upload failed:', err)
      alert(`Upload error: ${err?.message || 'Failed to upload image'}`)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
      }}
    >
      {label && (
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
          {label}
        </span>
      )}

      {/* Hidden file input for direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleDirectUpload}
      />

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: aspectRatio === 'video' ? 'stretch' : 'center',
          flexDirection: aspectRatio === 'video' ? 'column' : 'row',
        }}
      >
        <ImageUploadPreview
          value={value}
          aspectRatio={aspectRatio}
          fallbackInitial={fallbackInitial}
          placeholderText={placeholderText}
          isUploading={isUploading}
          onClick={() => setModalOpen(true)}
        />

        <ImageUploadActions
          value={value}
          onOpenPicker={() => setModalOpen(true)}
          onDirectUploadClick={() => fileInputRef.current?.click()}
          onRemove={() => onChange(null)}
        />
      </div>

      {helperText && (
        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
          {helperText}
        </span>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => {
          onChange(url)
          setModalOpen(false)
        }}
        title={pickerTitle}
        currentUrl={value || undefined}
      />
    </div>
  )
}
