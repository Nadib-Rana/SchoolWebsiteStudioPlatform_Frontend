'use client'

import { useState } from 'react'

export function useBuilderFields(previewTheme?: string) {
  const [heroBg, setHeroBg] = useState<string | null>(null)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [announcementText, setAnnouncementText] = useState('📢 Admissions open for the 2026–2027 Academic Year · Limited seats available!')
  const [announcementLink, setAnnouncementLink] = useState('Apply now')
  const [schoolName, setSchoolName] = useState('Northfield High')
  const [logoLetter, setLogoLetter] = useState('N')
  const [applyButtonText, setApplyButtonText] = useState('Apply now')
  const [eyebrow, setEyebrow] = useState('LEARN · LEAD · MAKE A DIFFERENCE')
  const [heading, setHeading] = useState('Shaping thinkers.\nBuilding character.')
  const [description, setDescription] = useState('A vibrant learning community where every student is known, challenged, and inspired to thrive.')
  const [buttonLabel, setButtonLabel] = useState('Discover Northfield')
  const [buttonLink, setButtonLink] = useState('/about-us')
  const [overlayOpacity, setOverlayOpacity] = useState(65)
  const [introKicker, setIntroKicker] = useState('WELCOME TO NORTHFIELD')
  const [introTitle, setIntroTitle] = useState('Learning with purpose.\nGrowing with confidence.')
  const [introDesc, setIntroDesc] = useState('We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.')
  const [principalName, setPrincipalName] = useState('Dr. Farhana Noor')
  const [principalTitle, setPrincipalTitle] = useState('Principal & Head Administrator')
  const [principalQuote, setPrincipalQuote] = useState('“For more than four decades, Northfield has combined academic ambition with a culture of care, belonging, and purposeful growth.”')
  const [principalPhoto, setPrincipalPhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400')
  const [stat1Val, setStat1Val] = useState('1,240')
  const [stat1Label, setStat1Label] = useState('Students')
  const [stat2Val, setStat2Val] = useState('98%')
  const [stat2Label, setStat2Label] = useState('Graduation rate')
  const [stat3Val, setStat3Val] = useState('42')
  const [stat3Label, setStat3Label] = useState('Years of excellence')
  const [stat4Val, setStat4Val] = useState('16:1')
  const [stat4Label, setStat4Label] = useState('Student–teacher ratio')
  const [noticesHeading, setNoticesHeading] = useState('Latest notices & circulars')
  const [notice1Title, setNotice1Title] = useState('Term Examination Routine & Admit Card Distribution')
  const [notice1Date, setNotice1Date] = useState('Nov 05, 2026')
  const [notice2Title, setNotice2Title] = useState('Annual Inter-School Science & Tech Fair 2026 Registration')
  const [notice2Date, setNotice2Date] = useState('Nov 02, 2026')
  const [eventsHeading, setEventsHeading] = useState('Upcoming events & calendar')
  const [event1Title, setEvent1Title] = useState('Annual Sports & Athletics Meet 2026')
  const [event1Date, setEvent1Date] = useState('Nov 15')
  const [event1Venue, setEvent1Venue] = useState('Main Campus Stadium')
  const [event2Title, setEvent2Title] = useState('Parent-Teacher Academic Progress Conference')
  const [event2Date, setEvent2Date] = useState('Nov 22')
  const [event2Venue, setEvent2Venue] = useState('Auditorium Hall')
  const [galleryHeading, setGalleryHeading] = useState('Campus life & moments')
  const [gallerySub, setGallerySub] = useState('Explore our modern STEM labs, creative arts studios, and athletic facilities.')
  const [footerAddress, setFooterAddress] = useState('142 Northfield Avenue, Riverdale, NY 10471')
  const [footerPhone, setFooterPhone] = useState('+1 (555) 234-5678')
  const [footerEmail, setFooterEmail] = useState('admissions@northfieldhigh.edu')
  const [footerCopyright, setFooterCopyright] = useState('© 2026 Northfield High School. All rights reserved.')

  const applyLocalFields = (local: Record<string, any>) => {
    if (local.showAnnouncement !== undefined) setShowAnnouncement(local.showAnnouncement)
    if (local.announcementText) setAnnouncementText(local.announcementText)
    if (local.announcementLink) setAnnouncementLink(local.announcementLink)
    if (local.schoolName) setSchoolName(local.schoolName)
    if (local.logoLetter) setLogoLetter(local.logoLetter)
    if (local.applyButtonText) setApplyButtonText(local.applyButtonText)
    if (local.eyebrow) setEyebrow(local.eyebrow)
    if (local.heading) setHeading(local.heading)
    if (local.description) setDescription(local.description)
    if (local.buttonLabel) setButtonLabel(local.buttonLabel)
    if (local.buttonLink) setButtonLink(local.buttonLink)
    if (local.heroBg) setHeroBg(local.heroBg)
    if (local.overlayOpacity !== undefined) setOverlayOpacity(local.overlayOpacity)
    if (local.introKicker) setIntroKicker(local.introKicker)
    if (local.introTitle) setIntroTitle(local.introTitle)
    if (local.introDesc) setIntroDesc(local.introDesc)
    if (local.principalName) setPrincipalName(local.principalName)
    if (local.principalTitle) setPrincipalTitle(local.principalTitle)
    if (local.principalQuote) setPrincipalQuote(local.principalQuote)
    if (local.principalPhoto) setPrincipalPhoto(local.principalPhoto)
    if (local.stat1Val) setStat1Val(local.stat1Val)
    if (local.stat1Label) setStat1Label(local.stat1Label)
    if (local.stat2Val) setStat2Val(local.stat2Val)
    if (local.stat2Label) setStat2Label(local.stat2Label)
    if (local.stat3Val) setStat3Val(local.stat3Val)
    if (local.stat3Label) setStat3Label(local.stat3Label)
    if (local.stat4Val) setStat4Val(local.stat4Val)
    if (local.stat4Label) setStat4Label(local.stat4Label)
    if (local.noticesHeading) setNoticesHeading(local.noticesHeading)
    if (local.notice1Date) setNotice1Date(local.notice1Date)
    if (local.notice1Title) setNotice1Title(local.notice1Title)
    if (local.notice2Date) setNotice2Date(local.notice2Date)
    if (local.notice2Title) setNotice2Title(local.notice2Title)
    if (local.eventsHeading) setEventsHeading(local.eventsHeading)
    if (local.event1Date) setEvent1Date(local.event1Date)
    if (local.event1Title) setEvent1Title(local.event1Title)
    if (local.event1Venue) setEvent1Venue(local.event1Venue)
    if (local.event2Date) setEvent2Date(local.event2Date)
    if (local.event2Title) setEvent2Title(local.event2Title)
    if (local.event2Venue) setEvent2Venue(local.event2Venue)
    if (local.galleryHeading) setGalleryHeading(local.galleryHeading)
    if (local.gallerySub) setGallerySub(local.gallerySub)
    if (local.footerAddress) setFooterAddress(local.footerAddress)
    if (local.footerPhone) setFooterPhone(local.footerPhone)
    if (local.footerEmail) setFooterEmail(local.footerEmail)
    if (local.footerCopyright) setFooterCopyright(local.footerCopyright)
  }

  const values = {
    appliedTheme: previewTheme || 'modern',
    heroBg, showAnnouncement, announcementText, announcementLink, schoolName, logoLetter, applyButtonText,
    eyebrow, heading, description, buttonLabel, buttonLink, overlayOpacity,
    introKicker, introTitle, introDesc, principalName, principalTitle, principalQuote, principalPhoto,
    stat1Val, stat1Label, stat2Val, stat2Label, stat3Val, stat3Label, stat4Val, stat4Label,
    noticesHeading, notice1Date, notice1Title, notice2Date, notice2Title,
    eventsHeading, event1Date, event1Title, event1Venue, event2Date, event2Title, event2Venue,
    galleryHeading, gallerySub, footerAddress, footerPhone, footerEmail, footerCopyright,
  }

  const setters = {
    setHeroBg, setShowAnnouncement, setAnnouncementText, setAnnouncementLink, setSchoolName, setLogoLetter,
    setApplyButtonText, setEyebrow, setHeading, setDescription, setButtonLabel, setButtonLink,
    setOverlayOpacity, setIntroKicker, setIntroTitle, setIntroDesc, setPrincipalName,
    setPrincipalTitle, setPrincipalQuote, setPrincipalPhoto, setStat1Val, setStat1Label,
    setStat2Val, setStat2Label, setStat3Val, setStat3Label, setStat4Val, setStat4Label,
    setNoticesHeading, setNotice1Date, setNotice1Title, setNotice2Date, setNotice2Title,
    setEventsHeading, setEvent1Date, setEvent1Title, setEvent1Venue, setEvent2Date, setEvent2Title,
    setEvent2Venue, setGalleryHeading, setGallerySub, setFooterAddress, setFooterPhone,
    setFooterEmail, setFooterCopyright,
  }

  return { values, setters, applyLocalFields }
}
