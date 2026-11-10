'use client'

import type { RefObject } from 'react'
import { Icon } from '@/components/common/Icon'

interface MediaPickerUploadTabProps {
  uploading: boolean
  uploadError: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function MediaPickerUploadTab({
  uploading,
  uploadError,
  fileInputRef,
  onFileUpload,
}: MediaPickerUploadTabProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        borderRadius: '10px',
        border: '2px dashed #cbd5e1',
        backgroundColor: '#f8fafc',
        cursor: 'pointer',
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileUpload}
      />
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#e0e7ff',
          color: '#3730a3',
          display: 'grid',
          placeItems: 'center',
          marginBottom: '12px',
        }}
      >
        <Icon name="plus" size={22} />
      </div>
      <strong style={{ fontSize: '14px', color: '#0f172a' }}>
        {uploading
          ? 'Uploading to storage...'
          : 'Click to choose image or drag & drop'}
      </strong>
      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
        PNG, JPG, WEBP or SVG up to 25 MB
      </span>
      {uploadError && (
        <div
          style={{
            marginTop: '12px',
            color: '#dc2626',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {uploadError}
        </div>
      )}
    </div>
  )
}
