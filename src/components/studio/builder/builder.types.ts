import type { IconName } from '@/types/studio'

export interface SectionStyle {
  bg: string
  align: 'left' | 'center' | 'right'
  padding: 'compact' | 'normal' | 'spacious'
  border: boolean
  shadow: 'none' | 'subtle' | 'card'
  hideOnMobile: boolean
  animation: string
  customId: string
  customClass: string
}

export const DEFAULT_STYLES: Record<string, SectionStyle> = {
  'Announcement bar': { bg: '#0e2447', align: 'center', padding: 'compact', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-announcement-bar', customClass: '' },
  'Header': { bg: '#ffffff', align: 'left', padding: 'compact', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-header', customClass: '' },
  'Hero section': { bg: '#091b35', align: 'left', padding: 'spacious', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-hero-section', customClass: '' },
  'Statistics': { bg: '#163d72', align: 'center', padding: 'compact', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-statistics', customClass: '' },
  'School introduction': { bg: '#ffffff', align: 'center', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-school-introduction', customClass: '' },
  'Principal message': { bg: '#f8fafc', align: 'left', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-principal-message', customClass: '' },
  'Latest notices': { bg: '#ffffff', align: 'left', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-latest-notices', customClass: '' },
  'Upcoming events': { bg: '#f1f5f9', align: 'left', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-upcoming-events', customClass: '' },
  'Gallery': { bg: '#ffffff', align: 'center', padding: 'normal', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-gallery', customClass: '' },
  'Footer': { bg: '#091a30', align: 'left', padding: 'spacious', border: false, shadow: 'none', hideOnMobile: false, animation: 'none', customId: 'canvas-footer', customClass: '' },
}

export interface SectionItem {
  id: string
  icon: IconName
  label: string
  type: string
  isCustom?: boolean
}

export const INITIAL_SECTIONS: SectionItem[] = [
  { id: 'sec-announcement', icon: 'menu', label: 'Announcement bar', type: 'announcement' },
  { id: 'sec-header', icon: 'layout', label: 'Header', type: 'header' },
  { id: 'sec-hero', icon: 'image', label: 'Hero section', type: 'hero' },
  { id: 'sec-intro', icon: 'file', label: 'School introduction', type: 'intro' },
  { id: 'sec-principal', icon: 'users', label: 'Principal message', type: 'principal' },
  { id: 'sec-stats', icon: 'chart', label: 'Statistics', type: 'stats' },
  { id: 'sec-notices', icon: 'bell', label: 'Latest notices', type: 'news' },
  { id: 'sec-events', icon: 'calendar', label: 'Upcoming events', type: 'events' },
  { id: 'sec-gallery', icon: 'image', label: 'Gallery', type: 'gallery' },
  { id: 'sec-footer', icon: 'globe', label: 'Footer', type: 'footer' },
]

export interface CustomSectionData {
  id: string
  type: string
  label: string
  title: string
  subtitle: string
  items: Array<{ title: string; text: string }>
  buttonText?: string
  buttonLink?: string
}

export const SECTION_TEMPLATES = [
  {
    type: 'faq',
    icon: 'file' as IconName,
    label: 'Frequently Asked Questions',
    title: 'Frequently Asked Questions',
    subtitle: 'Find quick answers to common questions about admissions, academics, and campus life.',
    items: [
      { title: 'What is the admission procedure?', text: 'Applications open in November each year. Submit the online application form and join our open campus tour.' },
      { title: 'What curriculum do you follow?', text: 'We offer an internationally accredited modern curriculum with strong STEM, robotics, and creative arts foundations.' },
      { title: 'Are transport and bus facilities available?', text: 'Yes, air-conditioned school buses operate across all major city routes with real-time GPS tracking.' },
    ],
  },
  {
    type: 'testimonials',
    icon: 'users' as IconName,
    label: 'Community Reviews & Voices',
    title: 'Voices of our School Community',
    subtitle: 'Hear from our parents, alumni, and students about their educational journey at Northfield.',
    items: [
      { title: 'Ayesha Rahman (Parent)', text: 'The nurturing environment and dedicated teachers have helped my daughter develop strong confidence and leadership skills.' },
      { title: 'Tanvir Ahmed (Alumni 2025)', text: 'Northfield prepared me thoroughly not just for top university admissions, but for real-world problem solving.' },
    ],
  },
  {
    type: 'facilities',
    icon: 'layout' as IconName,
    label: 'Campus Facilities & Labs',
    title: 'World-Class Campus Facilities',
    subtitle: 'Cutting-edge learning spaces designed to foster innovation, scientific research, and artistic expression.',
    items: [
      { title: 'Robotics & STEM Innovation Lab', text: 'Equipped with 3D printers, IoT microcontrollers, and modern computing stations.' },
      { title: 'Olympic-Standard Sports Arena', text: 'Indoor basketball courts, heated swimming pool, and athletic training tracks.' },
      { title: 'Digital Media & Performing Arts Studio', text: 'Acoustically treated sound recording booths, graphic design workstations, and theatre stage.' },
    ],
  },
  {
    type: 'cta',
    icon: 'bell' as IconName,
    label: 'Admission Call to Action',
    title: 'Ready to Join Northfield High?',
    subtitle: 'Applications for the upcoming 2026–2027 academic year are now open. Empower your child’s educational future today.',
    items: [],
    buttonText: 'Start Online Application',
    buttonLink: '/admissions',
  },
  {
    type: 'custom',
    icon: 'sparkle' as IconName,
    label: 'Custom Rich Text Block',
    title: 'Our Educational Philosophy',
    subtitle: 'Empowering minds, building character, and inspiring every learner to reach their highest potential.',
    items: [
      { title: 'Academic Rigor & Excellence', text: 'High intellectual standards balanced with personalized faculty mentoring and support.' },
      { title: 'Global Citizenship & Ethics', text: 'Encouraging students to think critically, act ethically, and contribute positively to society.' },
    ],
  },
]
