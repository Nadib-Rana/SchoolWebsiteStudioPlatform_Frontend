'use client'

import type { SchoolTheme } from '@/types/theme'
import type { View } from '@/types/studio'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface StudioContextType {
  view: View
  setView: (view: View) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toast: string
  notify: (message: string) => void
  previewTheme: SchoolTheme
  setPreviewTheme: (theme: SchoolTheme) => void
  unreadNotifications: number
  setUnreadNotifications: (count: number) => void
}

const StudioContext = createContext<StudioContextType | undefined>(undefined)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [previewTheme, setPreviewTheme] = useState<SchoolTheme>('modern')
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }, [])

  // Auto aria-label accessibility helper matching old implementation
  useEffect(() => {
    const labels: Partial<Record<string, string>> = {
      more: 'More options',
      close: 'Close',
      menu: 'Open menu',
      bell: 'Notifications',
      help: 'Help',
      undo: 'Undo',
      redo: 'Redo',
      plus: 'Add item',
      eye: 'Preview',
      chevron: 'Open',
      arrow: 'Continue',
    }
    document.querySelectorAll<HTMLButtonElement>('button:not([aria-label])').forEach((button) => {
      if (!button.textContent?.trim()) {
        const icon = button.querySelector<SVGElement>('svg[data-icon]')?.dataset.icon
        const label = (icon && labels[icon]) || 'Action'
        button.setAttribute('aria-label', label)
        button.setAttribute('title', label)
      }
    })
  })

  return (
    <StudioContext.Provider
      value={{
        view,
        setView,
        sidebarOpen,
        setSidebarOpen,
        toast,
        notify,
        previewTheme,
        setPreviewTheme,
        unreadNotifications,
        setUnreadNotifications,
      }}
    >
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) {
    throw new Error('useStudio must be used within a StudioProvider')
  }
  return ctx
}
