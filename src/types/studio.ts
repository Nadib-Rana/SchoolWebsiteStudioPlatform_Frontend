export type View =
  | 'overview'
  | 'templates'
  | 'builder'
  | 'theme'
  | 'design-system'
  | 'public'
  | 'pages'
  | 'content'
  | 'teachers'
  | 'academics'
  | 'admissions'
  | 'inquiries'
  | 'notices'
  | 'events'
  | 'gallery'
  | 'navigation'
  | 'media'
  | 'seo'
  | 'domains'
  | 'integrations'
  | 'analytics'
  | 'audit-logs'
  | 'settings'
  | 'publishing'
  | 'onboarding'
  | 'login'

export type IconName =
  | 'home'
  | 'layers'
  | 'layout'
  | 'file'
  | 'users'
  | 'bell'
  | 'calendar'
  | 'image'
  | 'menu'
  | 'search'
  | 'globe'
  | 'plug'
  | 'chart'
  | 'settings'
  | 'eye'
  | 'plus'
  | 'arrow'
  | 'check'
  | 'more'
  | 'undo'
  | 'redo'
  | 'monitor'
  | 'tablet'
  | 'mobile'
  | 'help'
  | 'chevron'
  | 'sparkle'
  | 'clock'
  | 'external'
  | 'close'
  | 'download'
  | 'copy'

export type NavItem = readonly [id: View, icon: IconName, label: string]

export interface ScreenMetaItem {
  title: string
  eyebrow: string
  description: string
  action: string
}

export type ScreenMetaMap = Record<string, ScreenMetaItem>

export interface MetricItem {
  label: string
  value: string
  change?: string
  detail?: string
  icon: IconName
  tone: 'blue' | 'violet' | 'green' | 'orange' | 'pink' | 'slate'
}

export interface ActivityItem {
  initials: string
  title: string
  detail: string
  tone: 'blue' | 'green' | 'orange' | 'violet'
}
