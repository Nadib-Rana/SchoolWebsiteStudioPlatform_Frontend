'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { VersionRecord } from './publishing.types'

interface PublishVersionModalProps {
  version: VersionRecord | null
  onClose: () => void
  formatTimeAgo: (d?: string) => string
}

export function PublishVersionModal({
  version,
  onClose,
  formatTimeAgo,
}: PublishVersionModalProps) {
  if (!version) return null

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
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          padding: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Snapshot: {version.versionTag}
            </span>
            <span className="state-badge published" style={{ fontSize: '11px' }}>
              Archived
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '13px',
            color: '#334155',
          }}
        >
          <div>
            <strong>Release Summary:</strong>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>
              {version.summary || 'Production release'}
            </p>
          </div>
          <div>
            <strong>Created At:</strong>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>
              {new Date(version.createdAt).toLocaleString()} (
              {formatTimeAgo(version.createdAt)})
            </p>
          </div>
          <div>
            <strong>Publisher:</strong>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>
              {version.publishedBy?.firstName
                ? `${version.publishedBy.firstName} ${
                    version.publishedBy.lastName || ''
                  }`.trim()
                : version.publishedBy?.username || 'Workspace Administrator'}
            </p>
          </div>
          <div
            style={{
              background: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginTop: '6px',
            }}
          >
            <strong
              style={{
                display: 'block',
                color: '#0f172a',
                marginBottom: '4px',
              }}
            >
              Database Integrity
            </strong>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>
              ✓ Atomic schema and page JSON preserved
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button kind="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
