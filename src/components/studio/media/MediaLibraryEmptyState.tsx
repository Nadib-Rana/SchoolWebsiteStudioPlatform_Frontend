'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface MediaLibraryEmptyStateProps {
  query: string
  uploading: boolean
  onUploadClick: () => void
}

export function MediaLibraryEmptyState({
  query,
  uploading,
  onUploadClick,
}: MediaLibraryEmptyStateProps) {
  return (
    <div className="empty-state">
      <span>
        <Icon name="image" size={32} />
      </span>
      <strong>No media files found</strong>
      <p>
        {query
          ? 'No files matching your search filter.'
          : 'Upload images, banners, circulars, or documents to your school media library.'}
      </p>
      <Button
        kind="primary"
        onClick={onUploadClick}
        disabled={uploading}
      >
        Upload first file
      </Button>
    </div>
  )
}
