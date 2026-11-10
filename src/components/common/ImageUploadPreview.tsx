'use client'

import { Icon } from '@/components/common/Icon'
import { getAspectStyle, AspectRatioType } from './image-upload.types'

interface ImageUploadPreviewProps {
  value?: string | null
  aspectRatio: AspectRatioType
  fallbackInitial?: string
  placeholderText: string
  isUploading: boolean
  onClick: () => void
}

export function ImageUploadPreview({
  value,
  aspectRatio,
  fallbackInitial,
  placeholderText,
  isUploading,
  onClick,
}: ImageUploadPreviewProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...getAspectStyle(aspectRatio),
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#94a3b8',
            gap: '4px',
          }}
        >
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
  )
}
