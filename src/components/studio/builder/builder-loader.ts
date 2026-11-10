import { api } from '@/lib/api-client'
import { DEFAULT_STYLES } from './builder.types'

export async function loadHomepageSectionsFromBackend(
  setSectionStyles: React.Dispatch<React.SetStateAction<any>>,
  setters: Record<string, (val: any) => void>
) {
  try {
    const pagesRes = await api.pages.list()
    const pages = (pagesRes as any)?.data?.items || (pagesRes as any)?.items || (pagesRes as any)?.data || pagesRes
    const home = Array.isArray(pages) ? pages.find((p: any) => p.slug === 'home' || p.isHome) : null

    if (!home?.id) return

    const detailsRes = await api.pages.get(home.id)
    const pageData = (detailsRes as any)?.data || detailsRes
    const sections: any[] = pageData?.sections || []
    if (!Array.isArray(sections)) return

    const typeToLabel: Record<string, string> = {
      announcement: 'Announcement bar', header: 'Header', hero: 'Hero section',
      intro: 'School introduction', programs: 'School introduction', principal: 'Principal message',
      stats: 'Statistics', news: 'Latest notices', events: 'Upcoming events',
      gallery: 'Gallery', facilities: 'Gallery', footer: 'Footer', cta: 'Announcement bar',
    }

    sections.forEach((sec: any) => {
      const label = typeToLabel[sec.type]
      if (label && sec.settings && typeof sec.settings === 'object') {
        setSectionStyles((prev: any) => ({
          ...prev,
          [label]: { ...(prev[label] || DEFAULT_STYLES[label]), ...sec.settings },
        }))
      }

      if (sec.content && typeof sec.content === 'object') {
        const c = sec.content
        if (sec.type === 'announcement') {
          if (c.text && setters.setAnnouncementText) setters.setAnnouncementText(c.text)
          if (c.link && setters.setAnnouncementLink) setters.setAnnouncementLink(c.link)
          if (c.show !== undefined && setters.setShowAnnouncement) setters.setShowAnnouncement(c.show)
        } else if (sec.type === 'header') {
          if (c.schoolName && setters.setSchoolName) setters.setSchoolName(c.schoolName)
          if (c.logoLetter && setters.setLogoLetter) setters.setLogoLetter(c.logoLetter)
          if (c.applyButtonText && setters.setApplyButtonText) setters.setApplyButtonText(c.applyButtonText)
        } else if (sec.type === 'hero') {
          if (c.eyebrow && setters.setEyebrow) setters.setEyebrow(c.eyebrow)
          if (c.heading && setters.setHeading) setters.setHeading(c.heading)
          if (c.description && setters.setDescription) setters.setDescription(c.description)
          if (c.buttonLabel && setters.setButtonLabel) setters.setButtonLabel(c.buttonLabel)
          if (c.buttonLink && setters.setButtonLink) setters.setButtonLink(c.buttonLink)
          if (c.heroBg && setters.setHeroBg) setters.setHeroBg(c.heroBg)
          if (c.overlayOpacity && setters.setOverlayOpacity) setters.setOverlayOpacity(c.overlayOpacity)
        } else if (sec.type === 'intro' || sec.type === 'programs') {
          if (c.kicker && setters.setIntroKicker) setters.setIntroKicker(c.kicker)
          if (c.title && setters.setIntroTitle) setters.setIntroTitle(c.title)
          if (c.description && setters.setIntroDesc) setters.setIntroDesc(c.description)
        } else if (sec.type === 'principal') {
          if (c.name && setters.setPrincipalName) setters.setPrincipalName(c.name)
          if (c.title && setters.setPrincipalTitle) setters.setPrincipalTitle(c.title)
          if (c.quote && setters.setPrincipalQuote) setters.setPrincipalQuote(c.quote)
          if (c.photo && setters.setPrincipalPhoto) setters.setPrincipalPhoto(c.photo)
        } else if (sec.type === 'stats') {
          if (c.stat1Val && setters.setStat1Val) setters.setStat1Val(c.stat1Val)
          if (c.stat1Label && setters.setStat1Label) setters.setStat1Label(c.stat1Label)
          if (c.stat2Val && setters.setStat2Val) setters.setStat2Val(c.stat2Val)
          if (c.stat2Label && setters.setStat2Label) setters.setStat2Label(c.stat2Label)
          if (c.stat3Val && setters.setStat3Val) setters.setStat3Val(c.stat3Val)
          if (c.stat3Label && setters.setStat3Label) setters.setStat3Label(c.stat3Label)
          if (c.stat4Val && setters.setStat4Val) setters.setStat4Val(c.stat4Val)
          if (c.stat4Label && setters.setStat4Label) setters.setStat4Label(c.stat4Label)
        } else if (sec.type === 'news') {
          if (c.heading && setters.setNoticesHeading) setters.setNoticesHeading(c.heading)
          if (c.notice1Date && setters.setNotice1Date) setters.setNotice1Date(c.notice1Date)
          if (c.notice1Title && setters.setNotice1Title) setters.setNotice1Title(c.notice1Title)
          if (c.notice2Date && setters.setNotice2Date) setters.setNotice2Date(c.notice2Date)
          if (c.notice2Title && setters.setNotice2Title) setters.setNotice2Title(c.notice2Title)
        } else if (sec.type === 'events') {
          if (c.heading && setters.setEventsHeading) setters.setEventsHeading(c.heading)
          if (c.event1Date && setters.setEvent1Date) setters.setEvent1Date(c.event1Date)
          if (c.event1Title && setters.setEvent1Title) setters.setEvent1Title(c.event1Title)
          if (c.event1Venue && setters.setEvent1Venue) setters.setEvent1Venue(c.event1Venue)
          if (c.event2Date && setters.setEvent2Date) setters.setEvent2Date(c.event2Date)
          if (c.event2Title && setters.setEvent2Title) setters.setEvent2Title(c.event2Title)
          if (c.event2Venue && setters.setEvent2Venue) setters.setEvent2Venue(c.event2Venue)
        } else if (sec.type === 'gallery' || sec.type === 'facilities') {
          if (c.heading && setters.setGalleryHeading) setters.setGalleryHeading(c.heading)
          if (c.subtitle && setters.setGallerySub) setters.setGallerySub(c.subtitle)
        } else if (sec.type === 'footer') {
          if (c.address && setters.setFooterAddress) setters.setFooterAddress(c.address)
          if (c.phone && setters.setFooterPhone) setters.setFooterPhone(c.phone)
          if (c.email && setters.setFooterEmail) setters.setFooterEmail(c.email)
          if (c.copyright && setters.setFooterCopyright) setters.setFooterCopyright(c.copyright)
        }
      }
    })
  } catch (err: unknown) {
    console.debug('Loaded default studio content state:', err)
  }
}
