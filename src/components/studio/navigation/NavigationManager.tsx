'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'

export function NavigationManager() {
  const { notify } = useStudio()
  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER'>('HEADER')
  const [menuItems, setMenuItems] = useState<string[]>([
    'Home',
    'About Us',
    'Academics',
    'Teachers',
    'Admissions',
    'Notices',
    'Events',
    'Gallery',
    'Contact Us',
  ])
  const [saving, setSaving] = useState(false)

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
    loadNavigation()
    return () => {
      mounted = false
    }
  }, [activeTab])

  const handleSave = async () => {
    setSaving(true)
    try {
      const formattedItems = menuItems.map((label, idx) => ({
        label,
        url: label === 'Home' ? '/' : `/${label.toLowerCase().replace(/\s+/g, '-')}`,
        order: idx,
      }))
      await api.navigation.update(activeTab, formattedItems)
      notify(`${activeTab === 'HEADER' ? 'Header' : 'Footer'} navigation saved to database`)
    } catch (err) {
      console.error('Failed to save navigation:', err)
      notify('Failed to save navigation')
    } finally {
      setSaving(false)
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
            <div key={x}>
              <i>⠿</i>
              <span className="section-icon">
                <Icon name={i === 0 ? 'home' : 'file'} size={14} />
              </span>
              <strong>{x}</strong>
              <small>{i === 1 || i === 2 ? 'Dropdown' : 'Page'}</small>
              <button type="button" aria-label={`Options for ${x}`}>
                <Icon name="more" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add-section"
          onClick={() => {
            const newItem = prompt('Enter menu item label:')
            if (newItem?.trim()) {
              setMenuItems([...menuItems, newItem.trim()])
            }
          }}
        >
          <Icon name="plus" /> Add menu item
        </button>
      </div>

      <div className="card menu-preview">
        <span>LIVE DATABASE PREVIEW</span>
        <div>
          <div className="public-logo">
            <b>N</b>
            <strong>Northfield</strong>
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
