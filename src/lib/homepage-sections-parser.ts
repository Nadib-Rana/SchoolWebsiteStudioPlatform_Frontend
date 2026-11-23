import type { PublicSiteData } from './public-site-types'

export interface ParsedHomepageSections {
  showAnnouncement?: boolean
  announcementText?: string
  announcementLink?: string
  schoolName?: string
  logoLetter?: string
  applyButtonText?: string
  eyebrow?: string
  heading?: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  heroBg?: string
  heroImages?: string[]
  sliderIntervalSec?: number
  overlayOpacity?: number
  introKicker?: string
  introTitle?: string
  introDesc?: string
  introImage?: string
  introQuote?: string
  introBadgeTitle?: string
  introBadgeSubtitle?: string
  principalName?: string
  principalTitle?: string
  principalQuote?: string
  principalPhoto?: string
  stat1Val?: string
  stat1Label?: string
  stat2Val?: string
  stat2Label?: string
  stat3Val?: string
  stat3Label?: string
  stat4Val?: string
  stat4Label?: string
  noticesHeading?: string
  notice1Date?: string
  notice1Title?: string
  notice2Date?: string
  notice2Title?: string
  eventsHeading?: string
  event1Date?: string
  event1Title?: string
  event1Venue?: string
  event2Date?: string
  event2Title?: string
  event2Venue?: string
  galleryHeading?: string
  gallerySub?: string
  footerAddress?: string
  footerPhone?: string
  footerEmail?: string
  footerCopyright?: string
  sectionStyles: Record<string, any>
  customSections: any[]
}

const STANDARD_TYPES = new Set([
  'announcement',
  'header',
  'hero',
  'intro',
  'programs',
  'principal',
  'stats',
  'news',
  'events',
  'gallery',
  'footer',
])

const TYPE_TO_STYLE_LABEL: Record<string, string> = {
  announcement: 'Announcement bar',
  header: 'Header',
  hero: 'Hero section',
  intro: 'School introduction',
  programs: 'School introduction',
  principal: 'Principal message',
  stats: 'Statistics',
  news: 'Latest notices',
  events: 'Upcoming events',
  gallery: 'Gallery',
  footer: 'Footer',
}

export function parseHomepageSections(
  schoolData?: PublicSiteData | null,
): ParsedHomepageSections {
  const result: ParsedHomepageSections = {
    sectionStyles: {},
    customSections: [],
  }

  const pages = schoolData?.pages
  if (!Array.isArray(pages) || pages.length === 0) {
    return result
  }

  const homePage: any =
    pages.find((p: any) => p.isHome || p.slug === 'home') || pages[0]
  const sections: any[] = Array.isArray(homePage?.sections)
    ? homePage.sections
    : []
  if (!Array.isArray(sections)) {
    return result
  }

  for (const sec of sections) {
    const type = String(sec.type || '').toLowerCase()
    const c = (sec.content && typeof sec.content === 'object' ? sec.content : {}) as Record<string, any>
    const styleLabel = TYPE_TO_STYLE_LABEL[type] || sec.title

    if (styleLabel && sec.settings && typeof sec.settings === 'object') {
      result.sectionStyles[styleLabel] = sec.settings
    }

    if (type === 'announcement') {
      if (c.text) result.announcementText = c.text
      if (c.link) result.announcementLink = c.link
      if (c.show !== undefined) result.showAnnouncement = Boolean(c.show)
    } else if (type === 'header') {
      if (c.schoolName) result.schoolName = c.schoolName
      if (c.logoLetter) result.logoLetter = c.logoLetter
      if (c.applyButtonText) result.applyButtonText = c.applyButtonText
    } else if (type === 'hero') {
      if (c.eyebrow) result.eyebrow = c.eyebrow
      if (c.heading) result.heading = c.heading
      if (c.description) result.description = c.description
      if (c.buttonLabel) result.buttonLabel = c.buttonLabel
      if (c.buttonLink) result.buttonLink = c.buttonLink
      if (c.heroBg) result.heroBg = c.heroBg
      if (Array.isArray(c.heroImages) && c.heroImages.length > 0) {
        result.heroImages = c.heroImages.filter((u: any) => typeof u === 'string' && u.trim())
      }
      if (c.sliderIntervalSec !== undefined) {
        result.sliderIntervalSec = Number(c.sliderIntervalSec)
      }
      if (c.overlayOpacity !== undefined) result.overlayOpacity = Number(c.overlayOpacity)
    } else if (type === 'intro' || type === 'programs') {
      if (c.kicker) result.introKicker = c.kicker
      if (c.title) result.introTitle = c.title
      if (c.description) result.introDesc = c.description
      if (c.image) result.introImage = c.image
      if (c.quote) result.introQuote = c.quote
      if (c.badgeTitle) result.introBadgeTitle = c.badgeTitle
      if (c.badgeSubtitle) result.introBadgeSubtitle = c.badgeSubtitle
    } else if (type === 'principal') {
      if (c.name) result.principalName = c.name
      if (c.title) result.principalTitle = c.title
      if (c.quote) result.principalQuote = c.quote
      if (c.photo) result.principalPhoto = c.photo
    } else if (type === 'stats') {
      if (c.stat1Val) result.stat1Val = c.stat1Val
      if (c.stat1Label) result.stat1Label = c.stat1Label
      if (c.stat2Val) result.stat2Val = c.stat2Val
      if (c.stat2Label) result.stat2Label = c.stat2Label
      if (c.stat3Val) result.stat3Val = c.stat3Val
      if (c.stat3Label) result.stat3Label = c.stat3Label
      if (c.stat4Val) result.stat4Val = c.stat4Val
      if (c.stat4Label) result.stat4Label = c.stat4Label
    } else if (type === 'news') {
      if (c.heading) result.noticesHeading = c.heading
      if (c.notice1Date) result.notice1Date = c.notice1Date
      if (c.notice1Title) result.notice1Title = c.notice1Title
      if (c.notice2Date) result.notice2Date = c.notice2Date
      if (c.notice2Title) result.notice2Title = c.notice2Title
    } else if (type === 'events') {
      if (c.heading) result.eventsHeading = c.heading
      if (c.event1Date) result.event1Date = c.event1Date
      if (c.event1Title) result.event1Title = c.event1Title
      if (c.event1Venue) result.event1Venue = c.event1Venue
      if (c.event2Date) result.event2Date = c.event2Date
      if (c.event2Title) result.event2Title = c.event2Title
      if (c.event2Venue) result.event2Venue = c.event2Venue
    } else if (type === 'gallery') {
      if (c.heading) result.galleryHeading = c.heading
      if (c.subtitle) result.gallerySub = c.subtitle
    } else if (type === 'footer') {
      if (c.address) result.footerAddress = c.address
      if (c.phone) result.footerPhone = c.phone
      if (c.email) result.footerEmail = c.email
      if (c.copyright) result.footerCopyright = c.copyright
    } else if (!STANDARD_TYPES.has(type)) {
      const csLabel = c.label || sec.title || c.title || type
      if (sec.settings && typeof sec.settings === 'object') {
        result.sectionStyles[csLabel] = sec.settings
      }
      result.customSections.push({
        id: sec.id || `custom-${result.customSections.length}`,
        type,
        label: csLabel,
        title: c.title || sec.title || '',
        subtitle: c.subtitle || '',
        items: Array.isArray(c.items) ? c.items : [],
        buttonText: c.buttonText,
        buttonLink: c.buttonLink,
      })
    }
  }

  return result
}
