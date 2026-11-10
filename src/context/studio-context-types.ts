import type { SchoolTheme } from '@/types/theme'
import type { View } from '@/types/studio'

export interface CurrentUser {
  id: string
  email: string
  username?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  role?: string
}

export interface CurrentSchool {
  id: string
  name: string
  slug: string
  customDomain?: string | null
  logoUrl?: string | null
  plan?: string
  isPublished?: boolean
  role?: string
}

export interface StudioContextType {
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

  // User & Tenant State
  user: CurrentUser | null
  currentSchool: CurrentSchool | null
  userSchools: CurrentSchool[]
  loadingSchools: boolean
  schoolSwitchKey: number
  switchSchool: (schoolId: string) => Promise<void>
  refreshSchools: (preferredSchoolId?: string) => Promise<void>
  logout: () => void
}
