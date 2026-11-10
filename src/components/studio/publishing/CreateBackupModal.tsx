'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { CreateBackupParams } from './publishing.types'

interface CreateBackupModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (params: CreateBackupParams) => Promise<void>
}

export function CreateBackupModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBackupModalProps) {
  const [label, setLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [versionTag, setVersionTag] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        label: label.trim() || 'Manual site snapshot',
        notes: notes.trim() || undefined,
        versionTag: versionTag.trim() || undefined,
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
    >
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
              <Icon name="sparkle" size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Site Backup Snapshot</h3>
              <p className="text-xs text-slate-500">Capture full atomic state of your school website</p>
            </div>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Backup Label / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pre-Admissions Launch Snapshot"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Version Tag <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave blank for automatic timestamp tag (e.g. bk-2026-11-10)"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Why are you taking this backup? (e.g. Capturing stable state before major hero redesign)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2">
            <Icon name="check" size={14} className="text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <strong>Included in snapshot:</strong> All page layouts and blocks, active theme colors and fonts, school profile, and navigation menu hierarchy.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button kind="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button kind="primary" disabled={submitting || !label.trim()}>
              {submitting ? 'Creating snapshot...' : 'Take Snapshot'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
