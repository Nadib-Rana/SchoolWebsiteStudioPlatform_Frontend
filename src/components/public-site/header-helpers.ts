export interface PublicHeaderProps {
  schoolSlug?: string
  schoolName?: string
  motto?: string
  logoUrl?: string
  logoLetter?: string
  navigation?: Array<{ label: string; url: string }>
  setPage?: (p: string) => void
  applyButtonText?: string
  headerStyle?: {
    bg?: string
    align?: string
    padding?: string
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    customClass?: string
  }
}

export function isDarkColor(hex?: string): boolean {
  if (!hex || hex === 'transparent' || hex === '#ffffff' || hex === '#fff') return false
  const clean = hex.replace('#', '')
  let r = 255,
    g = 255,
    b = 255
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16)
    g = parseInt(clean.substring(2, 4), 16)
    b = parseInt(clean.substring(4, 6), 16)
  }
  return (r * 299 + g * 587 + b * 114) / 1000 < 145
}

export const DEFAULT_HEADER_NAV = [
  { label: 'About', path: '/about', page: 'About School' },
  { label: 'Academics', path: '/academics', page: 'Academic Programs' },
  { label: 'Faculty', path: '/teachers', page: 'Teachers & Faculty' },
  { label: 'Notices', path: '/notices', page: 'Notices' },
  { label: 'Events', path: '/events', page: 'Events' },
  { label: 'Gallery', path: '/gallery', page: 'Photo Gallery' },
  { label: 'Contact', path: '/contact', page: 'Contact Us' },
]
