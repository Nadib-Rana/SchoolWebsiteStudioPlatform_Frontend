'use client'

import type { SchoolTheme } from '@/types/theme'
import type { View } from '@/types/studio'
import { api } from '@/lib/api-client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CurrentUser, CurrentSchool, StudioContextType } from './studio-context-types'
import { autoApplyButtonAriaLabels } from './studio-accessibility'

export type { CurrentUser, CurrentSchool, StudioContextType }

const StudioContext = createContext<StudioContextType | undefined>(undefined)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [previewTheme, setPreviewThemeState] = useState<SchoolTheme>('modern')
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const [user, setUser] = useState<CurrentUser | null>(null)
  const [currentSchool, setCurrentSchool] = useState<CurrentSchool | null>(null)
  const [userSchools, setUserSchools] = useState<CurrentSchool[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [schoolSwitchKey, setSchoolSwitchKey] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studio_selected_theme') as SchoolTheme
      if (saved) setPreviewThemeState(saved)
    }
  }, [])

  const setPreviewTheme = useCallback((theme: SchoolTheme) => {
    setPreviewThemeState(theme)
    if (typeof window !== 'undefined') localStorage.setItem('studio_selected_theme', theme)
  }, [])

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }, [])

  useEffect(() => {
    const handleExpired = () => {
      notify('⚠️ Your session has expired. Please sign in to continue.')
      setUser(null)
      setCurrentSchool(null)
      setUserSchools([])
      setView('login')
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('studio:session_expired', handleExpired)
      return () => window.removeEventListener('studio:session_expired', handleExpired)
    }
  }, [notify])

  const refreshSchools = useCallback(async (preferredSchoolId?: string) => {
    try {
      const token = api.getAuthToken()
      if (!token) {
        setUser(null)
        setUserSchools([])
        setCurrentSchool(null)
        setLoadingSchools(false)
        return
      }

      const [profileRes, schoolsRes] = await Promise.allSettled([
        api.auth.getProfile(),
        api.schools.getMySchools(),
      ])

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        setUser(profileRes.value.data)
      } else if (profileRes.status === 'rejected') {
        const err = (profileRes as PromiseRejectedResult).reason
        const errMsg = err?.message || ''
        if (errMsg.includes('Unauthorized') || errMsg.includes('401')) {
          api.clearAuthToken()
          setUser(null)
          setCurrentSchool(null)
          setUserSchools([])
          setView('login')
          return
        }
      }

      if (schoolsRes.status === 'fulfilled' && Array.isArray(schoolsRes.value?.data)) {
        const schools: CurrentSchool[] = schoolsRes.value.data.map((item: any) => ({
          id: item.school?.id || item.id,
          name: item.school?.name || item.name || 'Unnamed School',
          slug: item.school?.slug || item.slug || 'school',
          customDomain: item.school?.customDomain || item.customDomain || null,
          logoUrl: item.school?.logoUrl || item.logoUrl || null,
          plan: item.school?.plan || item.plan || 'STARTER',
          isPublished: item.school?.isPublished ?? item.isPublished ?? true,
          role: item.role || 'MEMBER',
        }))

        setUserSchools(schools)
        if (schools.length > 0) {
          const storedId = preferredSchoolId || api.getActiveSchoolId()
          const matched = schools.find((s) => s.id === storedId || s.slug === storedId)
          const active = matched || schools[0]
          setCurrentSchool(active)
          api.setActiveSchoolId(active.id)
          api.setActiveSchoolSlug(active.slug)
        } else {
          setCurrentSchool(null)
        }
      }
    } catch (err) {
      console.error('[StudioContext] Error refreshing schools:', err)
    } finally {
      setLoadingSchools(false)
    }
  }, [])

  const switchSchool = useCallback(async (schoolId: string) => {
    const target = userSchools.find((s) => s.id === schoolId)
    if (target) {
      setCurrentSchool(target)
      api.setActiveSchoolId(target.id)
      api.setActiveSchoolSlug(target.slug)
      setSchoolSwitchKey((prev) => prev + 1)
      notify(`Switched to ${target.name}`)
    }
  }, [userSchools, notify])

  const logout = useCallback(() => {
    api.auth.logout()
    setUser(null)
    setCurrentSchool(null)
    setUserSchools([])
    notify('Signed out successfully.')
    setView('login')
  }, [notify])

  useEffect(() => { refreshSchools() }, [refreshSchools])
  useEffect(() => { autoApplyButtonAriaLabels() })

  return (
    <StudioContext.Provider
      value={{
        view, setView, sidebarOpen, setSidebarOpen, toast, notify,
        previewTheme, setPreviewTheme, unreadNotifications, setUnreadNotifications,
        user, currentSchool, userSchools, loadingSchools, schoolSwitchKey,
        switchSchool, refreshSchools, logout,
      }}
    >
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider')
  return ctx
}
