'use client'

import type { RefObject } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface MediaToolbarProps {
  query: string
  onQueryChange: (q: string) => void
  type: 'All files' | 'Images' | 'Documents'
  onCycleType: () => void
  uploading: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function MediaToolbar({
  query,
  onQueryChange,
  type,
  onCycleType,
  uploading,
  fileInputRef,
  onFileUpload,
}: MediaToolbarProps) {
  return (
    <div className="media-toolbar">
      <div className="search-field wide">
        <Icon name="search" size={16} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search files and documents..."
        />
      </div>
      <button type="button" className="select-button" onClick={onCycleType}>
        {type} <Icon name="chevron" size={13} />
      </button>
      {query && (
        <button
          type="button"
          className="select-button"
          onClick={() => onQueryChange('')}
        >
          Clear search <Icon name="close" size={13} />
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileUpload}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
      />
      <Button
        kind="primary"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading to storage...' : 'Upload file'}
      </Button>
    </div>
  )
}
