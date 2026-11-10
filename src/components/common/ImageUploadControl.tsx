'use client'

import { useState, useRef } from 'react'
import { Icon } from '@/components/common/Icon'
import { MediaPickerModal } from '@/components/studio/media/MediaPickerModal'
import { api } from '@/lib/api-client'

export interface ImageUploadControlProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  helperText?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto'
  fallbackInitial?: string
  placeholderText?: string
  pickerTitle?: string
}

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
      // Register media asset in PostgreSQL
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

  const getAspectStyle = () => {
    switch (aspectRatio) {
      case 'square':
        return { aspectRatio: '1', width: '90px' }
      case 'portrait':
        return { aspectRatio: '3 / 4', width: '100px' }
      case 'video':
        return { aspectRatio: '16 / 9', width: '100%' }
      default:
        return { height: '110px', width: '100%' }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
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
        {/* Preview Container */}
        <div
          onClick={() => setModalOpen(true)}
          style={{
            ...getAspectStyle(),
            borderRadius: '8px',
            border: value ? '1px solid #cbd5e1' : '1px dashed #cbd5e1',
            backgroundColor: '#f8fafc',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            boxShadow: value ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
          }}
          title="Click to change image"
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                ;(e.currentTarget as HTMLElement).style.display = 'none'
              }}
            />
          ) : fallbackInitial ? (
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#163d72' }}>
              {fallbackInitial}
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', gap: '4px' }}>
              <Icon name="image" size={20} />
              <span style={{ fontSize: '10px' }}>{placeholderText}</span>
            </div>
          )}

          {isUploading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              Uploading...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s, border-color 0.15s',
            }}
          >
            <Icon name="image" size={13} />
            {value ? 'Change photo' : 'Choose image'}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icon name="plus" size={13} />
            Upload direct
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#ef4444',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Remove image"
            >
              <Icon name="close" size={13} />
              Remove
            </button>
          )}
        </div>
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
