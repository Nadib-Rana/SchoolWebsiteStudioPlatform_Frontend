'use client'

import { useState, useEffect } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import {
  type NavItem,
  defaultHeaderItems,
  defaultFooterItems,
} from './navigation.types'

export function useNavigationManagerData() {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [activeTab, setActiveTab] = useState<'HEADER' | 'FOOTER'>('HEADER')
  const [menuItems, setMenuItems] = useState<NavItem[]>(defaultHeaderItems)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const activeSlug = currentSchool?.slug || api.getActiveSchoolSlug() || 'school'
  const schoolName = currentSchool?.name || activeSlug.replace(/-/g, ' ')
  const schoolInitial = (schoolName.charAt(0) || 'S').toUpperCase()

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
                id: it.id, label: it.label, url: it.url,
                pageSlug: it.pageSlug, target: it.target || '_self', isExternal: it.isExternal || false,
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
    return () => { mounted = false }
  }, [activeTab, currentSchool?.id, schoolSwitchKey])

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const formattedItems = menuItems.map((item, idx) => ({
        label: item.label, url: item.url,
        pageSlug: item.pageSlug || (item.url.startsWith('/') ? item.url.replace(/^\//, '') : undefined),
        order: idx + 1, target: item.target || '_self', isExternal: item.isExternal || item.url.startsWith('http'),
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
    if (item) notify(`Removed "${item.label}" from menu`)
  }

  return {
    notify,
    currentSchool,
    activeTab,
    setActiveTab,
    menuItems,
    setMenuItems,
    saving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    schoolName,
    schoolInitial,
    handleSaveAll,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
  }
}
