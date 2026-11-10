'use client'

import { useState } from 'react'
import { loadBuilderStateFromLocal } from './builder-storage'
import { THEME_CONFIGS } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'

export function useBuilderFields(previewTheme?: string) {
  const local = typeof window !== 'undefined' ? loadBuilderStateFromLocal() : null
  const currentTheme = (local?.appliedTheme || (typeof window !== 'undefined' ? localStorage.getItem('studio_selected_theme') : null) || previewTheme || 'modern') as SchoolTheme
  const themeCfg = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.modern

  const [appliedTheme, setAppliedTheme] = useState<SchoolTheme>(currentTheme)
  const [heroBg, setHeroBg] = useState<string | null>(local?.heroBg || themeCfg.heroImage)
  const [showAnnouncement, setShowAnnouncement] = useState(local?.showAnnouncement !== undefined ? local.showAnnouncement : true)
  const [announcementText, setAnnouncementText] = useState(local?.announcementText || themeCfg.announcementText)
  const [announcementLink, setAnnouncementLink] = useState(local?.announcementLink || 'Apply now')
  const [schoolName, setSchoolName] = useState(local?.schoolName || themeCfg.schoolName)
  const [logoLetter, setLogoLetter] = useState(local?.logoLetter || themeCfg.schoolName.charAt(0))
  const [applyButtonText, setApplyButtonText] = useState(local?.applyButtonText || 'Apply now')
  const [eyebrow, setEyebrow] = useState(local?.eyebrow || themeCfg.eyebrow)
  const [heading, setHeading] = useState(local?.heading || themeCfg.headline)
  const [description, setDescription] = useState(local?.description || themeCfg.description)
  const [buttonLabel, setButtonLabel] = useState(local?.buttonLabel || themeCfg.buttonLabel)
  const [buttonLink, setButtonLink] = useState(local?.buttonLink || '/about-us')
  const [overlayOpacity, setOverlayOpacity] = useState(local?.overlayOpacity !== undefined ? local.overlayOpacity : 65)
  const [introKicker, setIntroKicker] = useState(local?.introKicker || `WELCOME TO ${themeCfg.schoolName.toUpperCase()}`)
  const [introTitle, setIntroTitle] = useState(local?.introTitle || 'Learning with purpose.\nGrowing with confidence.')
  const [introDesc, setIntroDesc] = useState(local?.introDesc || 'We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.')
  const [principalName, setPrincipalName] = useState(local?.principalName || 'Dr. Farhana Noor')
  const [principalTitle, setPrincipalTitle] = useState(local?.principalTitle || 'Principal & Head Administrator')
  const [principalQuote, setPrincipalQuote] = useState(local?.principalQuote || '“For more than four decades, Northfield has combined academic ambition with a culture of care, belonging, and purposeful growth.”')
  const [principalPhoto, setPrincipalPhoto] = useState(local?.principalPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400')
  const [stat1Val, setStat1Val] = useState(local?.stat1Val || '1,240')
  const [stat1Label, setStat1Label] = useState(local?.stat1Label || 'Students')
  const [stat2Val, setStat2Val] = useState(local?.stat2Val || '98%')
  const [stat2Label, setStat2Label] = useState(local?.stat2Label || 'Graduation rate')
  const [stat3Val, setStat3Val] = useState(local?.stat3Val || '42')
  const [stat3Label, setStat3Label] = useState(local?.stat3Label || 'Years of excellence')
  const [stat4Val, setStat4Val] = useState(local?.stat4Val || '16:1')
  const [stat4Label, setStat4Label] = useState(local?.stat4Label || 'Student–teacher ratio')
  const [noticesHeading, setNoticesHeading] = useState(local?.noticesHeading || 'Latest notices & circulars')
  const [notice1Title, setNotice1Title] = useState(local?.notice1Title || 'Term Examination Routine & Admit Card Distribution')
  const [notice1Date, setNotice1Date] = useState(local?.notice1Date || 'Nov 05, 2026')
  const [notice2Title, setNotice2Title] = useState(local?.notice2Title || 'Annual Inter-School Science & Tech Fair 2026 Registration')
  const [notice2Date, setNotice2Date] = useState(local?.notice2Date || 'Nov 02, 2026')
  const [eventsHeading, setEventsHeading] = useState(local?.eventsHeading || 'Upcoming events & calendar')
  const [event1Title, setEvent1Title] = useState(local?.event1Title || 'Annual Sports & Athletics Meet 2026')
  const [event1Date, setEvent1Date] = useState(local?.event1Date || 'Nov 15')
  const [event1Venue, setEvent1Venue] = useState(local?.event1Venue || 'Main Campus Stadium')
  const [event2Title, setEvent2Title] = useState(local?.event2Title || 'Parent-Teacher Academic Progress Conference')
  const [event2Date, setEvent2Date] = useState(local?.event2Date || 'Nov 22')
  const [event2Venue, setEvent2Venue] = useState(local?.event2Venue || 'Auditorium Hall')
  const [galleryHeading, setGalleryHeading] = useState(local?.galleryHeading || 'Campus life & moments')
  const [gallerySub, setGallerySub] = useState(local?.gallerySub || 'Explore our modern STEM labs, creative arts studios, and athletic facilities.')
  const [footerAddress, setFooterAddress] = useState(local?.footerAddress || '142 Northfield Avenue, Riverdale, NY 10471')
  const [footerPhone, setFooterPhone] = useState(local?.footerPhone || '+1 (555) 234-5678')
  const [footerEmail, setFooterEmail] = useState(local?.footerEmail || 'admissions@northfieldhigh.edu')
  const [footerCopyright, setFooterCopyright] = useState(local?.footerCopyright || '© 2026 Northfield High School. All rights reserved.')

  const applyLocalFields = (saved: Record<string, any>) => {
    if (saved.appliedTheme) setAppliedTheme(saved.appliedTheme)
    if (saved.showAnnouncement !== undefined) setShowAnnouncement(saved.showAnnouncement)
    if (saved.announcementText) setAnnouncementText(saved.announcementText)
    if (saved.announcementLink) setAnnouncementLink(saved.announcementLink)
    if (saved.schoolName) setSchoolName(saved.schoolName)
    if (saved.logoLetter) setLogoLetter(saved.logoLetter)
    if (saved.applyButtonText) setApplyButtonText(saved.applyButtonText)
    if (saved.eyebrow) setEyebrow(saved.eyebrow)
    if (saved.heading) setHeading(saved.heading)
    if (saved.description) setDescription(saved.description)
    if (saved.buttonLabel) setButtonLabel(saved.buttonLabel)
    if (saved.buttonLink) setButtonLink(saved.buttonLink)
    if (saved.heroBg) setHeroBg(saved.heroBg)
    if (saved.overlayOpacity !== undefined) setOverlayOpacity(saved.overlayOpacity)
    if (saved.introKicker) setIntroKicker(saved.introKicker)
    if (saved.introTitle) setIntroTitle(saved.introTitle)
    if (saved.introDesc) setIntroDesc(saved.introDesc)
    if (saved.principalName) setPrincipalName(saved.principalName)
    if (saved.principalTitle) setPrincipalTitle(saved.principalTitle)
    if (saved.principalQuote) setPrincipalQuote(saved.principalQuote)
    if (saved.principalPhoto) setPrincipalPhoto(saved.principalPhoto)
    if (saved.stat1Val) setStat1Val(saved.stat1Val)
    if (saved.stat1Label) setStat1Label(saved.stat1Label)
    if (saved.stat2Val) setStat2Val(saved.stat2Val)
    if (saved.stat2Label) setStat2Label(saved.stat2Label)
    if (saved.stat3Val) setStat3Val(saved.stat3Val)
    if (saved.stat3Label) setStat3Label(saved.stat3Label)
    if (saved.stat4Val) setStat4Val(saved.stat4Val)
    if (saved.stat4Label) setStat4Label(saved.stat4Label)
    if (saved.noticesHeading) setNoticesHeading(saved.noticesHeading)
    if (saved.notice1Date) setNotice1Date(saved.notice1Date)
    if (saved.notice1Title) setNotice1Title(saved.notice1Title)
    if (saved.notice2Date) setNotice2Date(saved.notice2Date)
    if (saved.notice2Title) setNotice2Title(saved.notice2Title)
    if (saved.eventsHeading) setEventsHeading(saved.eventsHeading)
    if (saved.event1Date) setEvent1Date(saved.event1Date)
    if (saved.event1Title) setEvent1Title(saved.event1Title)
    if (saved.event1Venue) setEvent1Venue(saved.event1Venue)
    if (saved.event2Date) setEvent2Date(saved.event2Date)
    if (saved.event2Title) setEvent2Title(saved.event2Title)
    if (saved.event2Venue) setEvent2Venue(saved.event2Venue)
    if (saved.galleryHeading) setGalleryHeading(saved.galleryHeading)
    if (saved.gallerySub) setGallerySub(saved.gallerySub)
    if (saved.footerAddress) setFooterAddress(saved.footerAddress)
    if (saved.footerPhone) setFooterPhone(saved.footerPhone)
    if (saved.footerEmail) setFooterEmail(saved.footerEmail)
    if (saved.footerCopyright) setFooterCopyright(saved.footerCopyright)
  }

  const values = {
    appliedTheme, heroBg, showAnnouncement, announcementText, announcementLink,
    schoolName, logoLetter, applyButtonText, eyebrow, heading, description,
    buttonLabel, buttonLink, overlayOpacity, introKicker, introTitle, introDesc,
    principalName, principalTitle, principalQuote, principalPhoto,
    stat1Val, stat1Label, stat2Val, stat2Label, stat3Val, stat3Label, stat4Val, stat4Label,
    noticesHeading, notice1Date, notice1Title, notice2Date, notice2Title,
    eventsHeading, event1Date, event1Title, event1Venue, event2Date, event2Title, event2Venue,
    galleryHeading, gallerySub, footerAddress, footerPhone, footerEmail, footerCopyright,
  }

  const setters = {
    setAppliedTheme, setHeroBg, setShowAnnouncement, setAnnouncementText, setAnnouncementLink,
    setSchoolName, setLogoLetter, setApplyButtonText, setEyebrow, setHeading, setDescription,
    setButtonLabel, setButtonLink, setOverlayOpacity, setIntroKicker, setIntroTitle, setIntroDesc,
    setPrincipalName, setPrincipalTitle, setPrincipalQuote, setPrincipalPhoto,
    setStat1Val, setStat1Label, setStat2Val, setStat2Label, setStat3Val, setStat3Label, setStat4Val, setStat4Label,
    setNoticesHeading, setNotice1Date, setNotice1Title, setNotice2Date, setNotice2Title,
    setEventsHeading, setEvent1Date, setEvent1Title, setEvent1Venue, setEvent2Date, setEvent2Title,
    setEvent2Venue, setGalleryHeading, setGallerySub, setFooterAddress, setFooterPhone,
    setFooterEmail, setFooterCopyright,
  }

  return { values, setters, applyLocalFields }
}
