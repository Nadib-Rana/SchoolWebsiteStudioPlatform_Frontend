import { api } from '@/lib/api-client'
import { DEFAULT_STYLES, type CustomSectionData, type SectionStyle } from './builder.types'

export function buildSectionsPayload(
  state: any,
  sectionStyles: Record<string, SectionStyle>,
  customSectionsData: Record<string, CustomSectionData>
) {
  const all: Array<{
    type: string
    title: string
    content: Record<string, any>
    settings: any
    isVisible: boolean
  }> = [
    {
      type: 'announcement',
      title: 'Announcement bar',
      content: { text: state.announcementText, link: state.announcementLink, show: state.showAnnouncement },
      settings: sectionStyles['Announcement bar'] || DEFAULT_STYLES['Announcement bar'],
      isVisible: state.showAnnouncement,
    },
    {
      type: 'header',
      title: 'Site Header',
      content: { schoolName: state.schoolName, logoLetter: state.logoLetter, applyButtonText: state.applyButtonText },
      settings: sectionStyles['Header'] || DEFAULT_STYLES['Header'],
      isVisible: true,
    },
    {
      type: 'hero',
      title: 'Hero section',
      content: {
        eyebrow: state.eyebrow, heading: state.heading, description: state.description,
        buttonLabel: state.buttonLabel, buttonLink: state.buttonLink,
        overlayOpacity: state.overlayOpacity, heroBg: state.heroBg || undefined,
      },
      settings: sectionStyles['Hero section'] || DEFAULT_STYLES['Hero section'],
      isVisible: true,
    },
    {
      type: 'intro',
      title: 'School introduction',
      content: { kicker: state.introKicker, title: state.introTitle, description: state.introDesc },
      settings: sectionStyles['School introduction'] || DEFAULT_STYLES['School introduction'],
      isVisible: true,
    },
    {
      type: 'principal',
      title: "Principal's Message",
      content: { name: state.principalName, title: state.principalTitle, quote: state.principalQuote, photo: state.principalPhoto },
      settings: sectionStyles['Principal message'] || DEFAULT_STYLES['Principal message'],
      isVisible: true,
    },
    {
      type: 'stats',
      title: 'Statistics Counters',
      content: {
        stat1Val: state.stat1Val, stat1Label: state.stat1Label,
        stat2Val: state.stat2Val, stat2Label: state.stat2Label,
        stat3Val: state.stat3Val, stat3Label: state.stat3Label,
        stat4Val: state.stat4Val, stat4Label: state.stat4Label,
      },
      settings: sectionStyles['Statistics'] || DEFAULT_STYLES['Statistics'],
      isVisible: true,
    },
    {
      type: 'news',
      title: 'Latest notices & circulars',
      content: {
        heading: state.noticesHeading, notice1Date: state.notice1Date, notice1Title: state.notice1Title,
        notice2Date: state.notice2Date, notice2Title: state.notice2Title,
      },
      settings: sectionStyles['Latest notices'] || DEFAULT_STYLES['Latest notices'],
      isVisible: true,
    },
    {
      type: 'events',
      title: 'Upcoming events',
      content: {
        heading: state.eventsHeading, event1Date: state.event1Date, event1Title: state.event1Title,
        event1Venue: state.event1Venue, event2Date: state.event2Date, event2Title: state.event2Title,
        event2Venue: state.event2Venue,
      },
      settings: sectionStyles['Upcoming events'] || DEFAULT_STYLES['Upcoming events'],
      isVisible: true,
    },
    {
      type: 'gallery',
      title: 'Campus Moments Gallery',
      content: { heading: state.galleryHeading, subtitle: state.gallerySub },
      settings: sectionStyles['Gallery'] || DEFAULT_STYLES['Gallery'],
      isVisible: true,
    },
    {
      type: 'footer',
      title: 'Site Footer',
      content: { address: state.footerAddress, phone: state.footerPhone, email: state.footerEmail, copyright: state.footerCopyright },
      settings: sectionStyles['Footer'] || DEFAULT_STYLES['Footer'],
      isVisible: true,
    },
  ]

  Object.values(customSectionsData).forEach((cs) => {
    all.push({
      type: cs.type,
      title: cs.title,
      content: { title: cs.title, subtitle: cs.subtitle, items: cs.items, buttonText: cs.buttonText, buttonLink: cs.buttonLink },
      settings: sectionStyles[cs.label] || DEFAULT_STYLES['School introduction'],
      isVisible: true,
    })
  })

  return all
}

export async function syncHomepageToBackend(
  state: any,
  sectionStyles: Record<string, SectionStyle>,
  customSectionsData: Record<string, CustomSectionData>
) {
  const pagesRes = await api.pages.list()
  const pages = (pagesRes as any)?.data?.items || (pagesRes as any)?.items || (pagesRes as any)?.data || pagesRes
  let homePage = Array.isArray(pages) ? pages.find((p: any) => p.slug === 'home' || p.isHome) : null

  if (!homePage?.id) {
    const createRes = await api.pages.create({ slug: 'home', title: 'Homepage', isHome: true, status: 'PUBLISHED' })
    homePage = (createRes as any)?.data || createRes
  } else {
    await api.pages.update(homePage.id, { title: homePage.title || 'Homepage', status: 'PUBLISHED' })
  }

  if (homePage?.id) {
    const detailsRes = await api.pages.get(homePage.id)
    const pageData = (detailsRes as any)?.data || detailsRes
    const existingSections: any[] = pageData?.sections || []
    const all = buildSectionsPayload(state, sectionStyles, customSectionsData)

    for (let i = 0; i < all.length; i++) {
      const item = all[i]
      const existing = existingSections.find((s: any) => s.type === item.type)
      if (existing?.id) {
        await api.sections.update(homePage.id, existing.id, {
          title: item.title, content: item.content, settings: item.settings, isVisible: item.isVisible, order: i + 1,
        })
      } else {
        await api.sections.create(homePage.id, {
          type: item.type, title: item.title, content: item.content, settings: item.settings, isVisible: item.isVisible, order: i + 1,
        })
      }
    }
  }
}
