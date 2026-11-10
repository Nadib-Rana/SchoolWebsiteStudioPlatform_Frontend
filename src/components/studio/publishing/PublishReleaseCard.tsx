'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { StagedChange } from './publishing.types'

interface PublishReleaseCardProps {
  stagedChanges: StagedChange[]
  publishing: boolean
  loading: boolean
  nextVersionTag: string
  onPublish: () => void
  formatTimeAgo: (dateStr?: string) => string
}

export function PublishReleaseCard({
  stagedChanges,
  publishing,
  loading,
  nextVersionTag,
  onPublish,
  formatTimeAgo,
}: PublishReleaseCardProps) {
  const hasChanges = stagedChanges.length > 0

  return (
    <div className="card release-card">
      <div className="release-top">
        <span className="release-icon">
          <Icon name="sparkle" />
        </span>
        <div>
          <span className={`state-badge ${hasChanges ? 'draft' : 'published'}`}>
            <i />
            {hasChanges ? 'Draft ready' : 'All changes live'}
          </span>
          <h2>
            {hasChanges
              ? `${stagedChanges.length} ${stagedChanges.length === 1 ? 'change is' : 'changes are'} ready to publish`
              : 'Your live website is currently up to date'}
          </h2>
          <p>
            {hasChanges
              ? 'Your published public website remains unchanged until you create a new version release.'
              : 'All pages, notices, events, and customizations are currently synchronized with the public profile.'}
          </p>
        </div>
        <Button kind="primary" onClick={onPublish} disabled={publishing || loading}>
          {publishing ? 'Publishing...' : `Publish version ${nextVersionTag}`}
        </Button>
      </div>

      {hasChanges ? (
        <div className="change-list">
          {stagedChanges.map((x, i) => (
            <div key={x.title + i}>
              <span>
                <Icon name="check" size={13} />
              </span>
              <div>
                <strong>{x.title}</strong>
                <p>{x.detail}</p>
              </div>
              <small>{formatTimeAgo(x.updatedAt)}</small>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          <Icon name="check" size={20} className="text-emerald-600 mb-1 inline-block mr-1" />
          No pending drafts awaiting release.
        </div>
      )}
    </div>
  )
}
