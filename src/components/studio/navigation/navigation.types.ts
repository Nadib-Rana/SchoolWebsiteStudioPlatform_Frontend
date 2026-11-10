export interface NavItem {
  id?: string
  label: string
  url: string
  pageSlug?: string
  target?: string // '_self' | '_blank'
  isExternal?: boolean
}

export interface NavigationManagerProps {
  openAddModal?: boolean
  onCloseAddModal?: () => void
}

export const PRESET_PAGES = [
  { label: 'Home', url: '/' },
  { label: 'About School', url: '/about' },
  { label: 'Academic Programs', url: '/academics' },
  { label: 'Admissions Information', url: '/admissions' },
  { label: 'Faculty & Teachers', url: '/teachers' },
  { label: 'Notice Board', url: '/notices' },
  { label: 'School Events', url: '/events' },
  { label: 'Photo Gallery', url: '/gallery' },
  { label: 'Contact Us', url: '/contact' },
  { label: 'Custom Internal Link', url: '/custom-page' },
  { label: 'External Website', url: 'https://' },
]

export const defaultHeaderItems: NavItem[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Academics', url: '/academics' },
  { label: 'Admissions', url: '/admissions' },
  { label: 'Teachers', url: '/teachers' },
  { label: 'Contact', url: '/contact' },
]

export const defaultFooterItems: NavItem[] = [
  { label: 'About', url: '/about' },
  { label: 'Academics', url: '/academics' },
  { label: 'Admissions', url: '/admissions' },
  { label: 'Notices', url: '/notices' },
  { label: 'Contact', url: '/contact' },
]
