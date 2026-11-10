'use client'

import { Button } from '@/components/common/Button'
import type { VersionRecord } from './publishing.types'

interface VersionHistoryListProps {
  versions: VersionRecord[]
  onInspect: (v: VersionRecord) => void
  formatTimeAgo: (d?: string) => string
}

export function VersionHistoryList({
  versions,
  onInspect,
  formatTimeAgo,
}: VersionHistoryListProps) {
  return (
    <div className="card version-card">
      <div className="card-title">
        <div>
          <h3>Version history</h3>
          <p>Immutable snapshots of previous releases</p>
        </div>
      </div>
      {versions.length > 0 ? (
        versions.map((x, i) => {
          const author = x.publishedBy
            ? `${x.publishedBy.firstName || ''} ${
                x.publishedBy.lastName || ''
              }`.trim() ||
              x.publishedBy.username ||
              'Administrator'
            : 'System'
          return (
            <div className="version-row" key={x.id || x.versionTag}>
              <b>{x.versionTag}</b>
              <div>
                <strong>{x.summary || 'Production release'}</strong>
                <small>
                  {formatTimeAgo(x.createdAt)} · {author}
                </small>
              </div>
              {x.isCurrent || i === 0 ? (
                <span className="state-badge published">
                  <i />
                  Live
                </span>
              ) : (
                <Button onClick={() => onInspect(x)}>Inspect</Button>
              )}
            </div>
          )
        })
      ) : (
        <div
          style={{
            padding: '20px 0',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '13px',
          }}
        >
          No previous version snapshots found. Publishing a release will create
          your first version snapshot.
        </div>
      )}
    </div>
  )
}
