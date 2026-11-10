'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SECTION_TEMPLATES } from './builder.types'

interface AddSectionModalProps {
  onClose: () => void
  onAddSection: (template: any) => void
}

export function AddSectionModal({ onClose, onAddSection }: AddSectionModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="editor-modal"
        style={{
          width: 'min(640px, 95vw)',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span>SECTION TEMPLATE LIBRARY</span>
            <h2>Add Section to Homepage</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', display: 'grid', gap: '12px' }}>
          <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#64748b' }}>
            Choose a pre-designed section template to add to your layout:
          </p>

          {SECTION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.type}
              onClick={() => onAddSection(tpl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb'
                e.currentTarget.style.background = '#eff6ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#f8fafc'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  flex: '0 0 auto',
                }}
              >
                <Icon name={tpl.icon as any} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                  {tpl.label}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {tpl.subtitle}
                </span>
              </div>
              <Button
                kind="primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => onAddSection(tpl)}
              >
                <Icon name="plus" size={13} /> Add
              </Button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
