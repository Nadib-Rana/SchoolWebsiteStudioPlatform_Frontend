'use client'

import { useState, useEffect } from 'react'
import {
  type NavItem,
  type NavigationManagerProps,
  PRESET_PAGES,
} from './navigation.types'
import { useNavigationManagerData } from './useNavigationManagerData'
import { NavMenuList } from './NavMenuList'
import { NavPreviewCard } from './NavPreviewCard'
import { AddMenuItemModal } from './AddMenuItemModal'

export function NavigationManager({
  openAddModal,
  onCloseAddModal,
}: NavigationManagerProps) {
  const {
    notify,
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
  } = useNavigationManagerData()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [itemForm, setItemForm] = useState({
    label: '', url: '/', target: '_self', preset: '',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (openAddModal) handleOpenAdd()
  }, [openAddModal])

  const handleOpenAdd = () => {
    setEditingIndex(null)
    setItemForm({ label: '', url: '/', target: '_self', preset: '' })
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
        ...prev, preset: presetUrl,
        label: prev.label ? prev.label : matched.label,
        url: matched.url,
        target: matched.url.startsWith('http') ? '_blank' : '_self',
      }))
    }
  }

  const handleSaveItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!itemForm.label.trim()) return setFormError('Please enter a menu item label.')
    if (!itemForm.url.trim()) return setFormError('Please specify a destination URL for this menu item.')

    const cleanLabel = itemForm.label.trim()
    const cleanUrl = itemForm.url.trim()
    const isExt = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')

    const newItem: NavItem = {
      label: cleanLabel, url: cleanUrl, target: itemForm.target, isExternal: isExt,
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

  return (
    <div className="nav-manager">
      <NavMenuList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onOpenEdit={handleOpenEdit}
        onRemove={handleRemove}
        onOpenAdd={handleOpenAdd}
      />
      <NavPreviewCard
        schoolInitial={schoolInitial}
        schoolName={schoolName}
        menuItems={menuItems}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveAll={handleSaveAll}
        onNotify={notify}
      />
      {isModalOpen && (
        <AddMenuItemModal
          editingIndex={editingIndex}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          itemForm={itemForm}
          setItemForm={setItemForm}
          formError={formError}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          onPresetChange={handlePresetChange}
        />
      )}
    </div>
  )
}
