'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

export function NavigationManager() {
  const { notify } = useStudio()
  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER'>('HEADER')
  const [menuItems, setMenuItems] = useState<string[]>([
    'Home',
    'About Us',
    'Academics',
    'Faculty',
    'Admissions',
    'Notices',
    'Events',
    'Gallery',
    'Contact Us',
  ])
  const [saving, setSaving] = useState(false)
  const activeSlug = api.getActiveSchoolSlug()
  const schoolInitial = activeSlug.charAt(0).toUpperCase() || 'S'

  useEffect(() => {
    let mounted = true
    const loadNavigation = async () => {
      try {
        const res = await api.navigation.get()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const menu = data.find((m: any) => m.location === activeTab) || data[0]
          if (menu && menu.items?.length) {
            setMenuItems(menu.items.map((it: any) => it.label))
          }
        }
      } catch (err) {
        console.warn('Failed to load navigation menu:', err)
      }
    }
    void loadNavigation()
    return () => {
      mounted = false
    }
  }, [activeTab])

  const handleSave = async () => {
    setSaving(true)
    try {
      const formattedItems = menuItems.map((label, idx) => ({
        label,
        url:
          label.toLowerCase() === 'home'
            ? '/'
            : `/${label.toLowerCase().replace(/\s+/g, '-')}`,
        order: idx,
      }))
      await api.navigation.update(activeTab, formattedItems)
      notify(
        `${activeTab === 'HEADER' ? 'Header' : 'Footer'} navigation saved to database`,
      )
    } catch (err) {
      console.error('Failed to save navigation:', err)
      notify('Failed to save navigation')
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
  }

  const handleMoveDown = (index: number) => {
    if (index >= menuItems.length - 1) return
    const updated = [...menuItems]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    setMenuItems(updated)
  }

  const handleRemove = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index))
  }

  const handleAddItem = () => {
    const newItem = typeof window !== 'undefined' ? window.prompt('Enter menu item label:') : null
    if (newItem?.trim()) {
      setMenuItems([...menuItems, newItem.trim()])
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

        <div className="menu-list">
          {menuItems.map((x, i) => (
            <div key={x + i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-mono w-4">{i + 1}</span>
                <span className="section-icon">
                  <Icon name={i === 0 ? 'home' : 'file'} size={14} />
                </span>
                <strong className="text-sm text-slate-800">{x}</strong>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(i)}
                  disabled={i === 0}
                  title="Move up"
                  className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(i)}
                  disabled={i === menuItems.length - 1}
                  title="Move down"
                  className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  title="Remove item"
                  className="p-1 text-rose-500 hover:text-rose-700 ml-2"
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-section"
          onClick={handleAddItem}
        >
          <Icon name="plus" /> Add menu item
        </button>
      </div>

      <div className="card menu-preview">
        <span>LIVE DATABASE PREVIEW</span>
        <div>
          <div className="public-logo">
            <b>{schoolInitial}</b>
            <strong className="capitalize">{activeSlug.replace(/-/g, ' ')}</strong>
          </div>
          <nav>
            {menuItems.slice(0, 6).map((x) => (
              <small key={x}>{x}</small>
            ))}
          </nav>
          <button type="button">Apply now</button>
        </div>
        <p>
          Organize your site navigation. Reordered and saved items will be
          served immediately to public visitors.
        </p>
        <Button kind="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save navigation'}
        </Button>
      </div>
    </div>
  )
}
