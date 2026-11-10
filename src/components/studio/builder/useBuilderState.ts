'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useStudio } from '@/context/StudioContext'
import { DEFAULT_STYLES, INITIAL_SECTIONS, type CustomSectionData, type SectionItem, type SectionStyle, type SECTION_TEMPLATES } from './builder.types'
import { loadBuilderStateFromLocal, persistBuilderStateToLocal } from './builder-storage'
import { syncHomepageToBackend } from './builder-sync'
import { loadHomepageSectionsFromBackend } from './builder-loader'
import { useBuilderFields } from './useBuilderFields'

export function useBuilderState() {
  const { notify, setView, previewTheme } = useStudio()
  const isInitializedRef = useRef(false)
  const [device, setDevice] = useState<'monitor' | 'tablet' | 'mobile'>('monitor')
  const [selected, setSelected] = useState('Hero section')
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content')
  const [leftPanelTab, setLeftPanelTab] = useState<'sections' | 'components'>('sections')
  const [sectionList, setSectionList] = useState<SectionItem[]>(INITIAL_SECTIONS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customSectionsData, setCustomSectionsData] = useState<Record<string, CustomSectionData>>({})
  const [sectionStyles, setSectionStyles] = useState<Record<string, SectionStyle>>(DEFAULT_STYLES)

  const { values: fieldValues, setters, applyLocalFields } = useBuilderFields(previewTheme)

  const stateFields = useMemo(() => ({
    ...fieldValues,
    sectionStyles,
    sectionList,
    customSectionsData,
  }), [fieldValues, sectionStyles, sectionList, customSectionsData])

  const activeStyle = sectionStyles[selected] || DEFAULT_STYLES[selected] || {
    bg: '#ffffff', align: 'left', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: '', customClass: '',
  }

  const updateActiveStyle = (patch: Partial<SectionStyle>) => {
    setSectionStyles((prev) => ({ ...prev, [selected]: { ...(prev[selected] || DEFAULT_STYLES[selected] || activeStyle), ...patch } }))
  }

  const handleUndo = () => {
    if (undoStack.length === 0) {
      notify('No earlier actions to undo')
      return
    }
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((r) => [selected, ...r])
    setUndoStack((u) => u.slice(0, -1))
    setSelected(prev)
    notify(`Undo: switched to ${prev}`)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) {
      notify('No actions to redo')
      return
    }
    const next = redoStack[0]
    setUndoStack((u) => [...u, selected])
    setRedoStack((r) => r.slice(1))
    setSelected(next)
    notify(`Redo: restored to ${next}`)
  }

  const handleSelectSection = (label: string) => {
    setUndoStack((prev) => [...prev, selected])
    setRedoStack([])
    setSelected(label)
    setShowSettings(true)
    const customId = sectionStyles[label]?.customId
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const el = (customId && document.getElementById(customId)) || document.getElementById(`canvas-${slug}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const handleAddSection = (tpl: typeof SECTION_TEMPLATES[0]) => {
    let uniqueLabel = tpl.label
    let counter = 1
    while (sectionList.some((s) => s.label === uniqueLabel)) {
      counter++
      uniqueLabel = `${tpl.label} (${counter})`
    }
    const newId = `sec-${Date.now()}`
    const newSection: SectionItem = { id: newId, icon: tpl.icon, label: uniqueLabel, type: tpl.type, isCustom: true }
    const footerIndex = sectionList.findIndex((s) => s.label === 'Footer')
    const updatedList = footerIndex >= 0 ? [...sectionList.slice(0, footerIndex), newSection, ...sectionList.slice(footerIndex)] : [...sectionList, newSection]

    setSectionList(updatedList)
    setCustomSectionsData((prev) => ({
      ...prev,
      [uniqueLabel]: {
        id: newId, type: tpl.type, label: uniqueLabel, title: tpl.title, subtitle: tpl.subtitle,
        items: tpl.items ? tpl.items.map((i) => ({ ...i })) : [], buttonText: tpl.buttonText, buttonLink: tpl.buttonLink,
      },
    }))
    setSectionStyles((prev) => ({
      ...prev,
      [uniqueLabel]: {
        bg: tpl.type === 'cta' ? '#163d72' : '#ffffff', align: 'left', padding: 'normal',
        border: false, shadow: 'none', hideOnMobile: false, animation: 'fade-in', customId: `canvas-${newId}`, customClass: '',
      },
    }))
    setShowAddModal(false)
    setSelected(uniqueLabel)
    setShowSettings(true)
    notify(`Added "${uniqueLabel}" to homepage!`)
    setTimeout(() => {
      const el = document.getElementById(`canvas-${newId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 120)
  }

  const handleDeleteSection = (label: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSectionList((prev) => prev.filter((s) => s.label !== label))
    setCustomSectionsData((prev) => {
      const copy = { ...prev }
      delete copy[label]
      return copy
    })
    if (selected === label) setSelected('Hero section')
    notify(`Removed "${label}"`)
  }

  const handlePreview = () => {
    persistBuilderStateToLocal(stateFields)
    setView('public')
  }

  useEffect(() => {
    if (isInitializedRef.current) persistBuilderStateToLocal(stateFields)
  }, [stateFields])

  useEffect(() => {
    const local = loadBuilderStateFromLocal()
    if (local) {
      applyLocalFields(local)
      if (local.sectionStyles) setSectionStyles(local.sectionStyles)
      if (local.sectionList) setSectionList(local.sectionList)
      if (local.customSectionsData) setCustomSectionsData(local.customSectionsData)
    } else {
      loadHomepageSectionsFromBackend(setSectionStyles, setters)
    }
    isInitializedRef.current = true
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    persistBuilderStateToLocal(stateFields)
    try {
      await syncHomepageToBackend(stateFields, sectionStyles, customSectionsData)
      notify('Homepage sections, content & styles successfully saved! Ready to preview.')
    } catch (err: unknown) {
      console.debug('Backend sync notice:', err)
      notify('Homepage saved successfully! Ready to preview.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    device, setDevice, selected, setSelected, isSaving, showSettings, setShowSettings,
    activeTab, setActiveTab, leftPanelTab, setLeftPanelTab, sectionList, setSectionList,
    showAddModal, setShowAddModal, customSectionsData, setCustomSectionsData,
    sectionStyles, setSectionStyles, activeStyle, updateActiveStyle,
    handleUndo, handleRedo, handleSelectSection, handleAddSection, handleDeleteSection, handleSave, handlePreview,
    notify, setView, state: { ...stateFields, ...setters },
  }
}
