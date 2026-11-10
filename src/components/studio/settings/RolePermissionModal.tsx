'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface RolePermissionModalProps {
  onClose: () => void
}

export function RolePermissionModal({ onClose }: RolePermissionModalProps) {
  const permissions = [
    ['Edit website pages & builder', '✓', '✓', '✓', '—'],
    ['Publish & release snapshots', '✓', '✓', '✓', '—'],
    ['Manage domain & DNS', '✓', '✓', '—', '—'],
    ['Invite & manage users', '✓', '✓', '—', '—'],
    ['Security & billing settings', '✓', '—', '—', '—'],
    ['Export data & view analytics', '✓', '✓', '✓', '✓'],
  ]

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
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
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
            Role Permission Matrix
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
        <div style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 8px' }}>Capability</th>
                <th style={{ padding: '10px 8px' }}>Owner</th>
                <th style={{ padding: '10px 8px' }}>Admin</th>
                <th style={{ padding: '10px 8px' }}>Editor</th>
                <th style={{ padding: '10px 8px' }}>Analyst</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(([cap, o, a, e, v], idx) => (
                <tr
                  key={cap}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc',
                  }}
                >
                  <td style={{ padding: '10px 8px', fontWeight: 600, color: '#1e293b' }}>{cap}</td>
                  <td style={{ padding: '10px 8px', color: '#16a34a', fontWeight: 700 }}>{o}</td>
                  <td style={{ padding: '10px 8px', color: '#16a34a', fontWeight: 700 }}>{a}</td>
                  <td style={{ padding: '10px 8px', color: e === '✓' ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>{e}</td>
                  <td style={{ padding: '10px 8px', color: v === '✓' ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button kind="primary" onClick={onClose}>
              Close Matrix
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
