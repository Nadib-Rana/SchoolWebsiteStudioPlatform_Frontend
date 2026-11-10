'use client'

import { Button } from '@/components/common/Button'

interface PublishDangerZoneProps {
  isPublished: boolean
  toggling: boolean
  loading: boolean
  onTogglePublish: () => void
}

export function PublishDangerZone({
  isPublished,
  toggling,
  loading,
  onTogglePublish,
}: PublishDangerZoneProps) {
  return (
    <div className="card danger-zone">
      <div>
        <strong>
          {isPublished ? 'Unpublish website' : 'Publish website online'}
        </strong>
        <p>
          {isPublished
            ? 'Take the public website offline while keeping all content, media, and drafts safe in PostgreSQL.'
            : 'Make your school website publicly accessible to visitors, parents, and prospective applicants.'}
        </p>
      </div>
      <Button
        onClick={onTogglePublish}
        disabled={toggling || loading}
        className={
          isPublished
            ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }
      >
        {toggling
          ? 'Updating...'
          : isPublished
          ? 'Unpublish website'
          : 'Make website public'}
      </Button>
    </div>
  )
}
