'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface StorageStripProps {
  percentUsed: number
  formatted: string
  onRefresh: () => void
}

export function StorageStrip({
  percentUsed,
  formatted,
  onRefresh,
}: StorageStripProps) {
  return (
    <div className="storage-strip">
      <Icon name="image" />
      <div>
        <strong>Media storage (MinIO)</strong>
        <span>
          <i style={{ width: `${percentUsed}%` }} />
        </span>
      </div>
      <b>{formatted}</b>
      <Button onClick={onRefresh}>Refresh status</Button>
    </div>
  )
}
