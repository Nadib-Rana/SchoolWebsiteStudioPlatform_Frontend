'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface RestoreBackupModalProps {
  backupName: string | null
  isRestoring: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RestoreBackupModal({
  backupName,
  isRestoring,
  onClose,
  onConfirm,
}: RestoreBackupModalProps) {
  if (!backupName) return null

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
        if (e.target === e.currentTarget && !isRestoring) onClose()
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Icon name="clock" size={18} />
          </div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            Restore Snapshot
          </h3>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
          Are you sure you want to restore the backup from <strong>{backupName}</strong>?
          This will restore all pages, content, and configuration to this exact point in time.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button kind="secondary" disabled={isRestoring} onClick={onClose}>
            Cancel
          </Button>
          <Button kind="primary" disabled={isRestoring} onClick={onConfirm}>
            {isRestoring ? 'Restoring...' : 'Confirm Restore'}
          </Button>
        </div>
      </div>
    </div>
  )
}
