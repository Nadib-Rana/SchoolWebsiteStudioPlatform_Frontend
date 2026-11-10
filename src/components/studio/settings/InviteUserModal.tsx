'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface InviteUserModalProps {
  inviteEmail: string
  setInviteEmail: (val: string) => void
  inviteRole: string
  setInviteRole: (val: string) => void
  isInviting: boolean
  onClose: () => void
  onSendInvite: (e: React.FormEvent) => void
}

const ROLES = [
  { value: 'ADMIN', label: 'Administrator', desc: 'Full site customization, publishing and team control' },
  { value: 'EDITOR', label: 'Editor', desc: 'Modify website pages, layouts, and active theme' },
  { value: 'CONTENT_MANAGER', label: 'Content Manager', desc: 'Manage announcements, events, gallery and admissions' },
  { value: 'ANALYST', label: 'Analyst', desc: 'Read-only access to traffic analytics and audit timeline' },
]

export function InviteUserModal({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  isInviting,
  onClose,
  onSendInvite,
}: InviteUserModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const link = `${origin}/login?invite=team&role=${inviteRole.toLowerCase()}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
            <p className="text-xs text-slate-500">Collaborate with staff based on granular permissions</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={onSendInvite} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="teacher@school.edu"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium mb-1.5"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {ROLES.find((r) => r.value === inviteRole)?.desc}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
            <div>
              <strong className="block text-slate-800 font-semibold text-[11px]">Instant Invite Link</strong>
              <span className="text-[10px] text-slate-500">Share with staff via Slack or WhatsApp</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1 text-[11px] font-semibold border rounded bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button kind="secondary" type="button" onClick={onClose} disabled={isInviting}>
              Cancel
            </Button>
            <Button kind="primary" type="submit" disabled={isInviting || !inviteEmail.trim()}>
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
