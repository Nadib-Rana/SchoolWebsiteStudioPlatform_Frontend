'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

export interface NavItem {
  id?: string
  label: string
  url: string
  pageSlug?: string
  target?: string // '_self' | '_blank'
  isExternal?: boolean
}

export interface NavigationManagerProps {
  openAddModal?: boolean
  onCloseAddModal?: () => void
}

const PRESET_PAGES = [
  { label: 'Home', url: '/' },
  { label: 'About School', url: '/about' },
  { label: 'Academic Programs', url: '/academics' },
  { label: 'Admissions Information', url: '/admissions' },
  { label: 'Faculty & Teachers', url: '/teachers' },
  { label: 'Notice Board', url: '/notices' },
  { label: 'School Events', url: '/events' },
  { label: 'Photo Gallery', url: '/gallery' },
  { label: 'Contact Us', url: '/contact' },
  { label: 'Custom Internal Link', url: '/custom-page' },
  { label: 'External Website', url: 'https://' },
]

const defaultHeaderItems: NavItem[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Academics', url: '/academics' },
  { label: 'Admissions', url: '/admissions' },
  { label: 'Teachers', url: '/teachers' },
  { label: 'Contact', url: '/contact' },
]

const defaultFooterItems: NavItem[] = [
  { label: 'About', url: '/about' },
  { label: 'Academics', url: '/academics' },
  { label: 'Admissions', url: '/admissions' },
  { label: 'Notices', url: '/notices' },
  { label: 'Contact', url: '/contact' },
]

export function NavigationManager({
  openAddModal,
  onCloseAddModal,
}: NavigationManagerProps) {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER'>('HEADER')
  const [menuItems, setMenuItems] = useState<NavItem[]>(defaultHeaderItems)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [itemForm, setItemForm] = useState({
    label: '',
    url: '/',
    target: '_self',
    preset: '',
  })
  const [formError, setFormError] = useState('')

  const activeSlug = currentSchool?.slug || api.getActiveSchoolSlug() || 'school'
  const schoolName = currentSchool?.name || activeSlug.replace(/-/g, ' ')
  const schoolInitial = (schoolName.charAt(0) || 'S').toUpperCase()

  // Sync external openAddModal trigger from ManagementScreen
  useEffect(() => {
    if (openAddModal) {
      handleOpenAdd()
    }
  }, [openAddModal])

  // Load menu items from backend
  useEffect(() => {
    let mounted = true
    const loadNavigation = async () => {
      try {
        const activeId = currentSchool?.id || api.getActiveSchoolId()
        const res = await api.navigation.get(activeId)
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const menu = data.find((m: any) => m.location === activeTab) || data[0]
          if (menu && menu.items?.length) {
            setMenuItems(
              menu.items.map((it: any) => ({
                id: it.id,
                label: it.label,
                url: it.url,
                pageSlug: it.pageSlug,
                target: it.target || '_self',
                isExternal: it.isExternal || false,
              }))
            )
            setHasUnsavedChanges(false)
            return
          }
        }
        if (mounted) {
          setMenuItems(activeTab === 'HEADER' ? defaultHeaderItems : defaultFooterItems)
          setHasUnsavedChanges(false)
        }
      } catch (err) {
        console.warn('Failed to load navigation menu:', err)
        if (mounted) {
          setMenuItems(activeTab === 'HEADER' ? defaultHeaderItems : defaultFooterItems)
          setHasUnsavedChanges(false)
        }
      }
    }
    void loadNavigation()
    return () => {
      mounted = false
    }
  }, [activeTab, currentSchool?.id, schoolSwitchKey])

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setItemForm({
      label: '',
      url: '/',
      target: '_self',
      preset: '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    const item = menuItems[index]
    if (!item) return
    setEditingIndex(index)
    setItemForm({
      label: item.label,
      url: item.url,
      target: item.target || '_self',
      preset: PRESET_PAGES.find((p) => p.url === item.url)?.url || '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    setFormError('')
    onCloseAddModal?.()
  }

  const handlePresetChange = (presetUrl: string) => {
    if (!presetUrl) {
      setItemForm((prev) => ({ ...prev, preset: '' }))
      return
    }
    const matched = PRESET_PAGES.find((p) => p.url === presetUrl)
    if (matched) {
      setItemForm((prev) => ({
        ...prev,
        preset: presetUrl,
        label: prev.label ? prev.label : matched.label,
        url: matched.url,
        target: matched.url.startsWith('http') ? '_blank' : '_self',
      }))
    }
  }

  const handleSaveItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!itemForm.label.trim()) {
      setFormError('Please enter a menu item label.')
      return
    }
    if (!itemForm.url.trim()) {
      setFormError('Please specify a destination URL for this menu item.')
      return
    }

    const cleanLabel = itemForm.label.trim()
    const cleanUrl = itemForm.url.trim()
    const isExt = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')

    const newItem: NavItem = {
      label: cleanLabel,
      url: cleanUrl,
      target: itemForm.target,
      isExternal: isExt,
      pageSlug: cleanUrl.startsWith('/') ? cleanUrl.replace(/^\//, '') : undefined,
    }

    if (editingIndex !== null && editingIndex >= 0 && editingIndex < menuItems.length) {
      const updated = [...menuItems]
      updated[editingIndex] = { ...updated[editingIndex], ...newItem }
      setMenuItems(updated)
      notify(`Updated "${cleanLabel}" in navigation`)
    } else {
      setMenuItems([...menuItems, newItem])
      notify(`Added "${cleanLabel}" to ${activeTab === 'HEADER' ? 'Header' : 'Footer'} menu`)
    }

    setHasUnsavedChanges(true)
    handleCloseModal()
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const formattedItems = menuItems.map((item, idx) => ({
        label: item.label,
        url: item.url,
        pageSlug: item.pageSlug || (item.url.startsWith('/') ? item.url.replace(/^\//, '') : undefined),
        order: idx + 1,
        target: item.target || '_self',
        isExternal: item.isExternal || item.url.startsWith('http'),
      }))

      await api.navigation.update(activeTab, formattedItems, activeId)
      notify(`${activeTab === 'HEADER' ? 'Header' : 'Footer'} navigation saved successfully!`)
      setHasUnsavedChanges(false)
    } catch (err) {
      console.error('Failed to save navigation:', err)
      notify('Failed to save navigation menu')
    } finally {
      setSaving(false)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    const updated = [...menuItems]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    setMenuItems(updated)
    setHasUnsavedChanges(true)
  }

  const handleMoveDown = (index: number) => {
    if (index >= menuItems.length - 1) return
    const updated = [...menuItems]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    setMenuItems(updated)
    setHasUnsavedChanges(true)
  }

  const handleRemove = (index: number) => {
    const item = menuItems[index]
    setMenuItems(menuItems.filter((_, i) => i !== index))
    setHasUnsavedChanges(true)
    if (item) {
      notify(`Removed "${item.label}" from menu`)
    }
  }

  return (
    <div className="nav-manager">
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
                padding: '24px',
                textAlign: 'center',
                color: '#94a3b8',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                margin: '12px 0',
              }}
            >
              No menu items defined yet. Click &quot;Add menu item&quot; below to add your first link.
            </div>
          ) : (
            menuItems.map((item, i) => (
              <div
                key={(item.id || item.label) + i}
                style={{
                  height: 'auto',
                  minHeight: '48px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      color: '#94a3b8',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      width: '18px',
                      textAlign: 'center',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="section-icon" style={{ flexShrink: 0 }}>
                    <Icon name={item.url === '/' ? 'home' : item.isExternal ? 'globe' : 'file'} size={14} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong
                      style={{
                        fontSize: '13px',
                        color: '#1e293b',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                        }}
                      >
                        {item.url}
                      </span>
                      {item.target === '_blank' && (
                        <span
                          style={{
                            fontSize: '9px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          New tab
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0}
                    title="Move up"
                    aria-label={`Move ${item.label} up`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: i === 0 ? '#cbd5e1' : '#64748b',
                      cursor: i === 0 ? 'not-allowed' : 'pointer',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(i)}
                    disabled={i === menuItems.length - 1}
                    title="Move down"
                    aria-label={`Move ${item.label} down`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: i === menuItems.length - 1 ? '#cbd5e1' : '#64748b',
                      cursor: i === menuItems.length - 1 ? 'not-allowed' : 'pointer',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    ▼
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(i)}
                    title="Edit menu item"
                    aria-label={`Edit ${item.label}`}
                    style={{
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#2563eb',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      marginLeft: '4px',
                    }}
                  >
                    <Icon name="layout" size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    title="Remove item"
                    aria-label={`Remove ${item.label}`}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      display: 'grid',
                      placeItems: 'center',
                    }}
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
          onClick={handleOpenAdd}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            border: '1px dashed #2563eb',
            background: '#f8fbff',
            color: '#2563eb',
            fontWeight: 600,
            borderRadius: '8px',
            marginTop: '12px',
          }}
        >
          <Icon name="plus" size={14} /> Add menu item
        </button>
      </div>

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
              onClick={() => notify('Preview: "Apply now" links to the admissions portal on the public site')}
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
          <Button kind="primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Saving...' : 'Save navigation'}
          </Button>
          {hasUnsavedChanges && (
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
              ● Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT MENU ITEM MODAL --- */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            className="editor-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            <div
              className="modal-head"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    letterSpacing: '0.05em',
                  }}
                >
                  {editingIndex !== null ? 'EDIT NAVIGATION ITEM' : 'ADD NAVIGATION ITEM'}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '2px 0 0' }}>
                  {editingIndex !== null ? 'Edit Menu Item' : 'New Menu Item'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                }}
                aria-label="Close modal"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} style={{ padding: '20px' }}>
              {formError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  ⚠️ {formError}
                </div>
              )}

              {/* Target Location */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Navigation Location
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('HEADER')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: activeTab === 'HEADER' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: activeTab === 'HEADER' ? '#eff6ff' : '#ffffff',
                      color: activeTab === 'HEADER' ? '#1d4ed8' : '#64748b',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Header Menu
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('FOOTER')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: activeTab === 'FOOTER' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: activeTab === 'FOOTER' ? '#eff6ff' : '#ffffff',
                      color: activeTab === 'FOOTER' ? '#1d4ed8' : '#64748b',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Footer Menu
                  </button>
                </div>
              </div>

              {/* Quick Select Preset */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Quick Fill from Known Pages (Optional)
                </label>
                <select
                  value={itemForm.preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#1e293b',
                    background: '#ffffff',
                  }}
                >
                  <option value="">-- Choose a predefined page or type custom --</option>
                  {PRESET_PAGES.map((p) => (
                    <option key={p.url || p.label} value={p.url}>
                      {p.label} {p.url ? `(${p.url})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Menu Item Label */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Menu Label <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Tour, Library, Athletics"
                  value={itemForm.label}
                  onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#1e293b',
                  }}
                  required
                />
              </div>

              {/* Destination URL */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Destination URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. /about, /gallery, or https://example.com"
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#1e293b',
                    fontFamily: 'monospace',
                  }}
                  required
                />
                <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  Use relative paths (e.g. <code>/contact</code>) for internal pages, or full URLs (e.g. <code>https://...</code>) for external links.
                </small>
              </div>

              {/* Open in new tab toggle */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="targetBlankCheck"
                  checked={itemForm.target === '_blank'}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      target: e.target.checked ? '_blank' : '_self',
                    })
                  }
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="targetBlankCheck" style={{ fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  Open this link in a new browser tab (<code>target=&quot;_blank&quot;</code>)
                </label>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px',
                }}
              >
                <Button type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button kind="primary" type="submit">
                  {editingIndex !== null ? 'Update Menu Item' : 'Add to Menu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
