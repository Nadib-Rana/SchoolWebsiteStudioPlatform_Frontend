'use client'

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

export function InviteUserModal({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  isInviting,
  onClose,
  onSendInvite,
}: InviteUserModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            Invite Team Member
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'grid',
              placeItems: 'center',
              padding: '4px',
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <form onSubmit={onSendInvite} style={{ padding: '20px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
            Invite a colleague to collaborate on this school workspace. They will receive access based on their assigned role.
          </p>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="colleague@school.edu"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Workspace role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                background: '#fff',
                boxSizing: 'border-box',
              }}
            >
              <option value="ADMIN">Administrator (Full site & team control)</option>
              <option value="EDITOR">Editor (Can edit and publish content)</option>
              <option value="VIEWER">Analyst / Viewer (Read-only access)</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button kind="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button kind="primary" type="submit" disabled={isInviting}>
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
