'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { PRESET_PAGES } from './navigation.types'

interface AddMenuItemModalProps {
  editingIndex: number | null
  activeTab: 'HEADER' | 'FOOTER'
  setActiveTab: (tab: 'HEADER' | 'FOOTER') => void
  itemForm: { label: string; url: string; target: string; preset: string }
  setItemForm: React.Dispatch<React.SetStateAction<{ label: string; url: string; target: string; preset: string }>>
  formError: string
  onClose: () => void
  onSave: (e?: React.FormEvent) => void
  onPresetChange: (presetUrl: string) => void
}

export function AddMenuItemModal({
  editingIndex,
  activeTab,
  setActiveTab,
  itemForm,
  setItemForm,
  formError,
  onClose,
  onSave,
  onPresetChange,
}: AddMenuItemModalProps) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
        display: 'grid', placeItems: 'center', zIndex: 1000, padding: '16px', backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="editor-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '12px', width: '100%',
          maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
        }}
      >
        <div
          className="modal-head"
          style={{
            padding: '16px 20px', borderBottom: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              {editingIndex !== null ? 'EDIT NAVIGATION ITEM' : 'ADD NAVIGATION ITEM'}
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '2px 0 0' }}>
              {editingIndex !== null ? 'Edit Menu Item' : 'New Menu Item'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: '4px' }}
            aria-label="Close modal"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <form onSubmit={onSave} style={{ padding: '20px' }}>
          {formError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {formError}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Navigation Location
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('HEADER')}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '6px',
                  border: activeTab === 'HEADER' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeTab === 'HEADER' ? '#eff6ff' : '#ffffff',
                  color: activeTab === 'HEADER' ? '#1d4ed8' : '#64748b',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}
              >
                Header Menu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('FOOTER')}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '6px',
                  border: activeTab === 'FOOTER' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeTab === 'FOOTER' ? '#eff6ff' : '#ffffff',
                  color: activeTab === 'FOOTER' ? '#1d4ed8' : '#64748b',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}
              >
                Footer Menu
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Quick Fill from Known Pages (Optional)
            </label>
            <select
              value={itemForm.preset}
              onChange={(e) => onPresetChange(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#1e293b', background: '#ffffff' }}
            >
              <option value="">-- Choose a predefined page or type custom --</option>
              {PRESET_PAGES.map((p) => (
                <option key={p.url || p.label} value={p.url}>
                  {p.label} {p.url ? `(${p.url})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Menu Label <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Campus Tour, Library, Athletics"
              value={itemForm.label}
              onChange={(e) => setItemForm((prev) => ({ ...prev, label: e.target.value }))}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#1e293b' }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Destination URL <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. /about, /gallery, or https://example.com"
              value={itemForm.url}
              onChange={(e) => setItemForm((prev) => ({ ...prev, url: e.target.value }))}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#1e293b', fontFamily: 'monospace' }}
              required
            />
            <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Use relative paths (e.g. <code>/contact</code>) for internal pages, or full URLs (e.g. <code>https://...</code>) for external links.
            </small>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="targetBlankCheck"
              checked={itemForm.target === '_blank'}
              onChange={(e) => setItemForm((prev) => ({ ...prev, target: e.target.checked ? '_blank' : '_self' }))}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="targetBlankCheck" style={{ fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              Open this link in a new browser tab (<code>target=&quot;_blank&quot;</code>)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button kind="primary" type="submit">
              {editingIndex !== null ? 'Update Menu Item' : 'Add to Menu'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
