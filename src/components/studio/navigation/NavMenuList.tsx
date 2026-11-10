'use client'

import { Icon } from '@/components/common/Icon'
import type { NavItem } from './navigation.types'

interface NavMenuListProps {
  activeTab: 'HEADER' | 'FOOTER'
  setActiveTab: (tab: 'HEADER' | 'FOOTER') => void
  menuItems: NavItem[]
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onOpenEdit: (index: number) => void
  onRemove: (index: number) => void
  onOpenAdd: () => void
}

export function NavMenuList({
  activeTab,
  setActiveTab,
  menuItems,
  onMoveUp,
  onMoveDown,
  onOpenEdit,
  onRemove,
  onOpenAdd,
}: NavMenuListProps) {
  return (
    <div className="card menu-editor">
      <div className="sub-tabs">
        <button
          type="button"
          className={activeTab === 'HEADER' ? 'active' : ''}
          onClick={() => setActiveTab('HEADER')}
        >
          Header navigation
        </button>
        <button
          type="button"
          className={activeTab === 'FOOTER' ? 'active' : ''}
          onClick={() => setActiveTab('FOOTER')}
        >
          Footer navigation
        </button>
      </div>

      <div className="menu-list" style={{ minHeight: '120px' }}>
        {menuItems.length === 0 ? (
          <div
            style={{
              padding: '24px', textAlign: 'center', color: '#94a3b8',
              border: '1px dashed #cbd5e1', borderRadius: '8px', margin: '12px 0',
            }}
          >
            No menu items defined yet. Click &quot;Add menu item&quot; below to add your first link.
          </div>
        ) : (
          menuItems.map((item, i) => (
            <div
              key={(item.id || item.label) + i}
              style={{
                height: 'auto', minHeight: '48px', padding: '8px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '8px', border: '1px solid #e2e8f0', borderRadius: '8px',
                marginBottom: '8px', background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px', width: '18px', textAlign: 'center' }}>
                  {i + 1}
                </span>
                <span className="section-icon" style={{ flexShrink: 0 }}>
                  <Icon name={item.url === '/' ? 'home' : item.isExternal ? 'globe' : 'file'} size={14} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {item.url}
                    </span>
                    {item.target === '_blank' && (
                      <span style={{ fontSize: '9px', background: '#eff6ff', color: '#2563eb', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                        New tab
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => onMoveUp(i)}
                  disabled={i === 0}
                  title="Move up"
                  aria-label={`Move ${item.label} up`}
                  style={{ border: 'none', background: 'transparent', color: i === 0 ? '#cbd5e1' : '#64748b', cursor: i === 0 ? 'not-allowed' : 'pointer', padding: '4px', fontSize: '12px' }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDown(i)}
                  disabled={i === menuItems.length - 1}
                  title="Move down"
                  aria-label={`Move ${item.label} down`}
                  style={{ border: 'none', background: 'transparent', color: i === menuItems.length - 1 ? '#cbd5e1' : '#64748b', cursor: i === menuItems.length - 1 ? 'not-allowed' : 'pointer', padding: '4px', fontSize: '12px' }}
                >
                  ▼
                </button>

                <button
                  type="button"
                  onClick={() => onOpenEdit(i)}
                  title="Edit menu item"
                  aria-label={`Edit ${item.label}`}
                  style={{ border: 'none', background: '#f1f5f9', color: '#2563eb', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '4px' }}
                >
                  <Icon name="layout" size={12} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  title="Remove item"
                  aria-label={`Remove ${item.label}`}
                  style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'grid', placeItems: 'center' }}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        className="add-section"
        onClick={onOpenAdd}
        style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', width: '100%', padding: '10px', border: '1px dashed #2563eb',
          background: '#f8fbff', color: '#2563eb', fontWeight: 600, borderRadius: '8px', marginTop: '12px',
        }}
      >
        <Icon name="plus" size={14} /> Add menu item
      </button>
    </div>
  )
}
