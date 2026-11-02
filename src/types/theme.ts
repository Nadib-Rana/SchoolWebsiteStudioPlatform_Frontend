export type SchoolTheme =
  | 'modern'
  | 'classic'
  | 'international'
  | 'college'
  | 'high-school'
  | 'primary'
  | 'religious'
  | 'minimal'
  | 'premium'

export interface TemplateItem {
  name: string
  theme: SchoolTheme
  category: string
  desc: string
  image: string
  colors: string[]
  tag?: string
}

export type DeviceType = 'monitor' | 'tablet' | 'mobile'
