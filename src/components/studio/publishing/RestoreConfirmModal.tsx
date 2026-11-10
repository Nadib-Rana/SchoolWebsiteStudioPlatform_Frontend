'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { VersionRecord } from './publishing.types'

interface RestoreConfirmModalProps {
  version: VersionRecord | null
  onClose: () => void
  onConfirm: (versionId: string, reason?: string) => Promise<void>
}

export function RestoreConfirmModal({
  version,
  onClose,
  onConfirm,
}: RestoreConfirmModalProps) {
  const [reason, setReason] = useState('')
  const [restoring, setRestoring] = useState(false)

  if (!version) return null

  const handleConfirm = async () => {
    setRestoring(true)
    try {
      await onConfirm(version.id, reason.trim() || undefined)
      onClose()
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !restoring) onClose()
      }}
    >
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 grid place-items-center">
              <Icon name="clock" size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Rollback to Revision</h3>
              <p className="text-xs text-amber-800 font-medium">{version.versionTag}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={restoring}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
            <strong>Warning:</strong> Restoring revision <strong>{version.versionTag}</strong> will replace your active website theme, page contents, and settings with the exact state preserved in this snapshot.
          </div>

          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div><strong>Summary:</strong> {version.summary || 'Production release'}</div>
            <div><strong>Captured:</strong> {new Date(version.createdAt).toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rollback Reason <span className="text-slate-400 font-normal">(Audit log note)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Reverting unapproved changes"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button kind="secondary" onClick={onClose} disabled={restoring}>
              Cancel
            </Button>
            <Button
              kind="primary"
              onClick={handleConfirm}
              disabled={restoring}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {restoring ? 'Restoring snapshot...' : 'Confirm Rollback'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
