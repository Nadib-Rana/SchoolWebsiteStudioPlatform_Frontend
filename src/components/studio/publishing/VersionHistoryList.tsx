'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { VersionRecord } from './publishing.types'

interface VersionHistoryListProps {
  versions: VersionRecord[]
  onInspect: (v: VersionRecord) => void
  onRestore: (v: VersionRecord) => void
  onCreateBackup: () => void
  onDelete?: (v: VersionRecord) => void
  formatTimeAgo: (d?: string) => string
}

export function VersionHistoryList({
  versions,
  onInspect,
  onRestore,
  onCreateBackup,
  onDelete,
  formatTimeAgo,
}: VersionHistoryListProps) {
  const handleDownload = (v: VersionRecord) => {
    const payload = JSON.stringify(v.snapshotData || v, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `site-backup-${v.versionTag}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card version-card">
      <div className="card-title flex items-center justify-between">
        <div>
          <h3>Site Backups & Version History</h3>
          <p>Atomic snapshots of releases and on-demand backups</p>
        </div>
        <Button kind="secondary" onClick={onCreateBackup} className="text-xs">
          <Icon name="sparkle" size={13} className="mr-1 inline-block" />
          Create Backup
        </Button>
      </div>

      {versions.length > 0 ? (
        versions.map((x, i) => {
          const author = x.publishedBy
            ? typeof x.publishedBy === 'object'
              ? `${x.publishedBy.firstName || ''} ${x.publishedBy.lastName || ''}`.trim() ||
                x.publishedBy.username ||
                'Admin'
              : x.publishedBy
            : 'System'

          const isLive = x.isCurrent || i === 0

          return (
            <div className="version-row flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0" key={x.id || x.versionTag}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {x.versionTag}
                </span>
                <div>
                  <strong className="block text-xs font-semibold text-slate-800">
                    {x.summary || 'Production release'}
                  </strong>
                  <small className="text-[11px] text-slate-600 block">
                    {formatTimeAgo(x.createdAt)} · {author}
                  </small>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLive ? (
                  <span className="state-badge published text-xs font-semibold">
                    <i />
                    Live
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onRestore(x)}
                      className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded transition-colors shadow-sm"
                      title="Rollback website to this revision"
                    >
                      Rollback
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(x)}
                      className="text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded transition-colors"
                      title="Download JSON snapshot"
                    >
                      JSON
                    </button>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(x)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1"
                        title="Delete backup snapshot"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    )}
                  </>
                )}
                <Button kind="secondary" onClick={() => onInspect(x)} className="text-xs">
                  Inspect
                </Button>
              </div>
            </div>
          )
        })
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs">
          No previous snapshots found. Create your first backup snapshot anytime.
        </div>
      )}
    </div>
  )
}
