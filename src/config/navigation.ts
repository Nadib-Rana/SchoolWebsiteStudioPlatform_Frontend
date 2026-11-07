import type { NavItem } from '@/types/studio'

export const studioNav: readonly NavItem[] = [
  ['overview', 'home', 'Overview'],
  ['builder', 'layout', 'Website Builder'],
  ['templates', 'layers', 'Templates'],
  ['theme', 'settings', 'Theme Customization'],
  ['pages', 'file', 'Pages'],
  ['content', 'layers', 'Content Management'],
  ['teachers', 'users', 'Teachers'],
  ['academics', 'file', 'Academics'],
  ['admissions', 'check', 'Admissions'],
  ['notices', 'bell', 'Notices'],
  ['events', 'calendar', 'Events'],
  ['gallery', 'image', 'Gallery'],
  ['navigation', 'menu', 'Navigation'],
  ['media', 'image', 'Media Library'],
  ['seo', 'search', 'SEO Manager'],
  ['domains', 'globe', 'Domain Management'],
  ['integrations', 'plug', 'Integrations'],
  ['analytics', 'chart', 'Analytics'],
  ['publishing', 'sparkle', 'Publishing'],
  ['design-system', 'layers', 'Design System'],
  ['settings', 'settings', 'Settings'],
] as const

export const workspaceNav = studioNav.slice(0, 4)
export const manageNav = studioNav.slice(4, 14)
export const optimizeNav = studioNav.slice(14)

export const publicPages = [
  'Home',
  'About School',
  'Principal’s Message',
  'Academic Programs',
  'Classes & Grades',
  'Teachers & Faculty',
  'Teacher Profile',
  'Facilities',
  'Notices',
  'Notice Details',
  'Events',
  'Event Details',
  'Photo Gallery',
  'Gallery Album',
  'Admission Information',
  'Contact Us',
  'Search Results',
  '404 Page',
] as const

export type PublicPageName = (typeof publicPages)[number]
