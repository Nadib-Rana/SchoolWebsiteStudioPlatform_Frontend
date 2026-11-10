'use client'

import { Button } from '@/components/common/Button'
import type { NavItem } from './navigation.types'

interface NavPreviewCardProps {
  schoolInitial: string
  schoolName: string
  menuItems: NavItem[]
  saving: boolean
  hasUnsavedChanges: boolean
  onSaveAll: () => void
  onNotify: (msg: string) => void
}

export function NavPreviewCard({
  schoolInitial,
  schoolName,
  menuItems,
  saving,
  hasUnsavedChanges,
  onSaveAll,
  onNotify,
}: NavPreviewCardProps) {
  return (
    <div className="card menu-preview">
      <span>LIVE DATABASE PREVIEW</span>
      <div style={{ flexDirection: 'column', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div className="public-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <b style={{ width: '26px', height: '26px', background: '#163d72', color: '#fff', borderRadius: '4px', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 'bold' }}>
              {schoolInitial}
            </b>
            <strong className="capitalize" style={{ fontSize: '13px', color: '#1e293b' }}>
              {schoolName}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => onNotify('Preview: "Apply now" links to the admissions portal on the public site')}
            style={{
              border: 'none',
              background: '#163d72',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Apply now
          </button>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', width: '100%' }}>
          {menuItems.slice(0, 8).map((x, idx) => (
            <span
              key={x.label + idx}
              style={{
                fontSize: '12px',
                color: idx === 0 ? '#2563eb' : '#475569',
                fontWeight: idx === 0 ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {x.label}
            </span>
          ))}
          {menuItems.length > 8 && (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>+{menuItems.length - 8} more</span>
          )}
        </nav>
      </div>

      <p style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
        Organize your site navigation. Reordered and saved items will be served immediately to public visitors.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
        <Button kind="primary" onClick={onSaveAll} disabled={saving}>
          {saving ? 'Saving...' : 'Save navigation'}
        </Button>
        {hasUnsavedChanges && (
          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
            ● Unsaved changes
          </span>
        )}
      </div>
    </div>
  )
}
