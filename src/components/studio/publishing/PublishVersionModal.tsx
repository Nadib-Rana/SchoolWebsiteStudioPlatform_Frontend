'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { VersionRecord } from './publishing.types'

interface PublishVersionModalProps {
  version: VersionRecord | null
  onClose: () => void
  onRestore?: (version: VersionRecord) => void
  formatTimeAgo: (d?: string) => string
}

export function PublishVersionModal({
  version,
  onClose,
  onRestore,
  formatTimeAgo,
}: PublishVersionModalProps) {
  if (!version) return null

  const handleDownloadJson = () => {
    const payload = JSON.stringify(version.snapshotData || version, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `site-backup-${version.versionTag}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const snapshot = version.snapshotData as any
  const pageCount = Array.isArray(snapshot?.pages) ? snapshot.pages.length : null
  const themeName = snapshot?.themeConfig?.activeTheme || null

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center text-sm">
              <Icon name="sparkle" size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Snapshot: {version.versionTag}
              </h3>
              <p className="text-xs text-slate-500">{version.summary || 'Production release'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <strong className="block text-slate-700">Created At:</strong>
              <span>{new Date(version.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <strong className="block text-slate-700">Captured By:</strong>
              <span>
                {typeof version.publishedBy === 'object'
                  ? `${version.publishedBy?.firstName || ''} ${version.publishedBy?.lastName || ''}`.trim() || 'Admin'
                  : version.publishedBy || 'Admin'}
              </span>
            </div>
            {pageCount !== null && (
              <div>
                <strong className="block text-slate-700">Pages Preserved:</strong>
                <span>{pageCount} pages</span>
              </div>
            )}
            {themeName && (
              <div>
                <strong className="block text-slate-700">Active Theme:</strong>
                <span className="font-mono">{themeName}</span>
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800">
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              <Icon name="check" size={14} className="text-emerald-600" />
              Atomic Database Snapshot
            </div>
            <p className="text-[11px] leading-relaxed">
              This revision preserves complete JSON structures for pages, widgets, typography, colors, and navigation trees.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDownloadJson}
              className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
            >
              Download JSON Snapshot
            </button>

            <div className="flex items-center gap-2">
              <Button kind="secondary" onClick={onClose}>
                Close
              </Button>
              {!version.isCurrent && onRestore && (
                <Button
                  kind="primary"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => {
                    onClose()
                    onRestore(version)
                  }}
                >
                  Rollback to this version
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
