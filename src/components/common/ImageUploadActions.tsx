'use client'

import { Icon } from '@/components/common/Icon'

interface ImageUploadActionsProps {
  value?: string | null
  onOpenPicker: () => void
  onDirectUploadClick: () => void
  onRemove: () => void
}

export function ImageUploadActions({
  value,
  onOpenPicker,
  onDirectUploadClick,
  onRemove,
}: ImageUploadActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        onClick={onOpenPicker}
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
        onClick={onDirectUploadClick}
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
          onClick={onRemove}
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
  )
}
