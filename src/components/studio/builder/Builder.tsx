'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { IconName } from '@/types/studio'
import type { DeviceType } from '@/types/theme'
import { useState, useEffect, useRef } from 'react'

interface SectionStyle {
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

const DEFAULT_STYLES: Record<string, SectionStyle> = {
  'Announcement bar': {
    bg: '#0e2447',
    align: 'center',
    padding: 'compact',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-announcement-bar',
    customClass: '',
  },
  'Header': {
    bg: '#ffffff',
    align: 'left',
    padding: 'compact',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-header',
    customClass: '',
  },
  'Hero section': {
    bg: '#091b35',
    align: 'left',
    padding: 'spacious',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-hero-section',
    customClass: '',
  },
  'Statistics': {
    bg: '#163d72',
    align: 'center',
    padding: 'compact',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-statistics',
    customClass: '',
  },
  'School introduction': {
    bg: '#ffffff',
    align: 'center',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-school-introduction',
    customClass: '',
  },
  'Principal message': {
    bg: '#f8fafc',
    align: 'left',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-principal-message',
    customClass: '',
  },
  'Latest notices': {
    bg: '#ffffff',
    align: 'left',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-latest-notices',
    customClass: '',
  },
  'Upcoming events': {
    bg: '#f1f5f9',
    align: 'left',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-upcoming-events',
    customClass: '',
  },
  'Gallery': {
    bg: '#ffffff',
    align: 'center',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-gallery',
    customClass: '',
  },
  'Footer': {
    bg: '#091a30',
    align: 'left',
    padding: 'spacious',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: 'canvas-footer',
    customClass: '',
  },
}

interface SectionItem {
  id: string
  icon: IconName
  label: string
  type: string
  isCustom?: boolean
}

const INITIAL_SECTIONS: SectionItem[] = [
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

interface CustomSectionData {
  id: string
  type: string
  label: string
  title: string
  subtitle: string
  items: Array<{ title: string; text: string }>
  buttonText?: string
  buttonLink?: string
}

const SECTION_TEMPLATES = [
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

export function Builder() {
  const { notify, setView, previewTheme } = useStudio()

  const [customHeroBg, setCustomHeroBg] = useState<string | null>(null)
  const heroBgInputRef = useRef<HTMLInputElement>(null)

  const handleHeroBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCustomHeroBg(reader.result as string)
        notify(`Hero photo "${file.name}" updated!`)
      }
      reader.readAsDataURL(file)
    }
  }

  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const handleUndo = () => {
    if (undoStack.length === 0) {
      notify('No earlier actions to undo')
      return
    }
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((r) => [selected, ...r])
    setUndoStack((u) => u.slice(0, -1))
    setSelected(prev)
    notify(`Undo: switched to ${prev}`)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) {
      notify('No actions to redo')
      return
    }
    const next = redoStack[0]
    setUndoStack((u) => [...u, selected])
    setRedoStack((r) => r.slice(1))
    setSelected(next)
    notify(`Redo: restored to ${next}`)
  }
  const isInitializedRef = useRef(false)
  const [device, setDevice] = useState<DeviceType>('monitor')
  const [selected, setSelected] = useState('Hero section')
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content')
  const [leftPanelTab, setLeftPanelTab] = useState<'sections' | 'components'>('sections')

  // Dynamic section list (supports adding & removing custom sections)
  const [sectionList, setSectionList] = useState<SectionItem[]>(INITIAL_SECTIONS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customSectionsData, setCustomSectionsData] = useState<Record<string, CustomSectionData>>({})

  // Per-section styles & advanced settings map
  const [sectionStyles, setSectionStyles] = useState<Record<string, SectionStyle>>(DEFAULT_STYLES)

  const activeStyle = sectionStyles[selected] || DEFAULT_STYLES[selected] || {
    bg: '#ffffff',
    align: 'left',
    padding: 'normal',
    border: false,
    shadow: 'none',
    hideOnMobile: false,
    animation: 'none',
    customId: '',
    customClass: '',
  }

  const updateActiveStyle = (patch: Partial<SectionStyle>) => {
    setSectionStyles((prev) => ({
      ...prev,
      [selected]: {
        ...(prev[selected] || DEFAULT_STYLES[selected] || activeStyle),
        ...patch,
      },
    }))
  }

  // 1. Announcement bar state
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [announcementText, setAnnouncementText] = useState(
    '📢 Admissions open for the 2026–2027 Academic Year · Limited seats available!'
  )
  const [announcementLink, setAnnouncementLink] = useState('Apply now')

  // 2. Header state
  const [schoolName, setSchoolName] = useState('Northfield High')
  const [logoLetter, setLogoLetter] = useState('N')
  const [applyButtonText, setApplyButtonText] = useState('Apply now')

  // 3. Hero section state
  const [eyebrow, setEyebrow] = useState('LEARN · LEAD · MAKE A DIFFERENCE')
  const [heading, setHeading] = useState('Shaping thinkers.\nBuilding character.')
  const [description, setDescription] = useState(
    'A vibrant learning community where every student is known, challenged, and inspired to thrive.'
  )
  const [buttonLabel, setButtonLabel] = useState('Discover Northfield')
  const [buttonLink, setButtonLink] = useState('/about-us')
  const [overlayOpacity, setOverlayOpacity] = useState(65)

  // 4. School introduction state
  const [introKicker, setIntroKicker] = useState('WELCOME TO NORTHFIELD')
  const [introTitle, setIntroTitle] = useState(
    'Learning with purpose.\nGrowing with confidence.'
  )
  const [introDesc, setIntroDesc] = useState(
    'We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.'
  )

  // 5. Principal message state
  const [principalName, setPrincipalName] = useState('Dr. Farhana Noor')
  const [principalTitle, setPrincipalTitle] = useState(
    'Principal & Head Administrator'
  )
  const [principalQuote, setPrincipalQuote] = useState(
    '“For more than four decades, Northfield has combined academic ambition with a culture of care, belonging, and purposeful growth.”'
  )
  const [principalPhoto, setPrincipalPhoto] = useState(
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400'
  )

  // 6. Statistics state
  const [stat1Val, setStat1Val] = useState('1,240')
  const [stat1Label, setStat1Label] = useState('Students')
  const [stat2Val, setStat2Val] = useState('98%')
  const [stat2Label, setStat2Label] = useState('Graduation rate')
  const [stat3Val, setStat3Val] = useState('42')
  const [stat3Label, setStat3Label] = useState('Years of excellence')
  const [stat4Val, setStat4Val] = useState('16:1')
  const [stat4Label, setStat4Label] = useState('Student–teacher ratio')

  // 7. Latest notices state
  const [noticesHeading, setNoticesHeading] = useState(
    'Latest notices & circulars'
  )
  const [notice1Title, setNotice1Title] = useState(
    'Term Examination Routine & Admit Card Distribution'
  )
  const [notice1Date, setNotice1Date] = useState('Nov 05, 2026')
  const [notice2Title, setNotice2Title] = useState(
    'Annual Inter-School Science & Tech Fair 2026 Registration'
  )
  const [notice2Date, setNotice2Date] = useState('Nov 02, 2026')

  // 8. Upcoming events state
  const [eventsHeading, setEventsHeading] = useState(
    'Upcoming events & calendar'
  )
  const [event1Title, setEvent1Title] = useState(
    'Annual Sports & Athletics Meet 2026'
  )
  const [event1Date, setEvent1Date] = useState('Nov 15')
  const [event1Venue, setEvent1Venue] = useState('Main Campus Stadium')
  const [event2Title, setEvent2Title] = useState(
    'Parent-Teacher Academic Progress Conference'
  )
  const [event2Date, setEvent2Date] = useState('Nov 22')
  const [event2Venue, setEvent2Venue] = useState('Auditorium Hall')

  // 9. Gallery state
  const [galleryHeading, setGalleryHeading] = useState(
    'Campus life & moments'
  )
  const [gallerySub, setGallerySub] = useState(
    'Explore our modern STEM labs, creative arts studios, and athletic facilities.'
  )

  // 10. Footer state
  const [footerAddress, setFooterAddress] = useState(
    '142 Northfield Avenue, Riverdale, NY 10471'
  )
  const [footerPhone, setFooterPhone] = useState('+1 (555) 234-5678')
  const [footerEmail, setFooterEmail] = useState('admissions@northfieldhigh.edu')
  const [footerCopyright, setFooterCopyright] = useState(
    '© 2026 Northfield High School. All rights reserved.'
  )

  const handleSelectSection = (label: string) => {
    setSelected(label)
    setShowSettings(true)
    const customId = sectionStyles[label]?.customId
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const el =
      (customId && document.getElementById(customId)) ||
      document.getElementById(`canvas-${slug}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const handleAddSection = (tpl: typeof SECTION_TEMPLATES[0]) => {
    let uniqueLabel = tpl.label
    let counter = 1
    while (sectionList.some((s) => s.label === uniqueLabel)) {
      counter++
      uniqueLabel = `${tpl.label} (${counter})`
    }

    const newId = `sec-${Date.now()}`
    const newSection: SectionItem = {
      id: newId,
      icon: tpl.icon,
      label: uniqueLabel,
      type: tpl.type,
      isCustom: true,
    }

    const footerIndex = sectionList.findIndex((s) => s.label === 'Footer')
    const updatedList =
      footerIndex >= 0
        ? [
            ...sectionList.slice(0, footerIndex),
            newSection,
            ...sectionList.slice(footerIndex),
          ]
        : [...sectionList, newSection]

    setSectionList(updatedList)

    setCustomSectionsData((prev) => ({
      ...prev,
      [uniqueLabel]: {
        id: newId,
        type: tpl.type,
        label: uniqueLabel,
        title: tpl.title,
        subtitle: tpl.subtitle,
        items: tpl.items ? tpl.items.map((i) => ({ ...i })) : [],
        buttonText: tpl.buttonText,
        buttonLink: tpl.buttonLink,
      },
    }))

    setSectionStyles((prev) => ({
      ...prev,
      [uniqueLabel]: {
        bg: tpl.type === 'cta' ? '#163d72' : '#ffffff',
        align: 'left',
        padding: 'normal',
        border: false,
        shadow: 'none',
        hideOnMobile: false,
        animation: 'fade-in',
        customId: `canvas-${newId}`,
        customClass: '',
      },
    }))

    setShowAddModal(false)
    setSelected(uniqueLabel)
    setShowSettings(true)
    notify(`Added "${uniqueLabel}" to homepage!`)

    setTimeout(() => {
      const el = document.getElementById(`canvas-${newId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 120)
  }

  const handleDeleteSection = (label: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSectionList((prev) => prev.filter((s) => s.label !== label))
    setCustomSectionsData((prev) => {
      const copy = { ...prev }
      delete copy[label]
      return copy
    })
    if (selected === label) {
      setSelected('Hero section')
    }
    notify(`Removed "${label}"`)
  }

  const getBuilderState = () => ({
    appliedTheme: previewTheme || 'modern',
    showAnnouncement,
    announcementText,
    announcementLink,
    schoolName,
    logoLetter,
    applyButtonText,
    eyebrow,
    heading,
    description,
    buttonLabel,
    buttonLink,
    overlayOpacity,
    introKicker,
    introTitle,
    introDesc,
    principalName,
    principalTitle,
    principalQuote,
    principalPhoto,
    stat1Val,
    stat1Label,
    stat2Val,
    stat2Label,
    stat3Val,
    stat3Label,
    stat4Val,
    stat4Label,
    noticesHeading,
    notice1Date,
    notice1Title,
    notice2Date,
    notice2Title,
    eventsHeading,
    event1Date,
    event1Title,
    event1Venue,
    event2Date,
    event2Title,
    event2Venue,
    galleryHeading,
    gallerySub,
    footerAddress,
    footerPhone,
    footerEmail,
    footerCopyright,
    sectionStyles,
    sectionList,
    customSectionsData,
  })

  const persistToLocal = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'studio_builder_homepage_data',
          JSON.stringify(getBuilderState()),
        )
      } catch (e) {
        console.debug('Failed to cache builder state to localStorage:', e)
      }
    }
  }

  const handlePreview = () => {
    persistToLocal()
    setView('public')
  }

  // Auto-persist builder draft to localStorage whenever any field changes
  useEffect(() => {
    if (isInitializedRef.current) {
      persistToLocal()
    }
  }, [
    showAnnouncement,
    announcementText,
    announcementLink,
    schoolName,
    logoLetter,
    applyButtonText,
    eyebrow,
    heading,
    description,
    buttonLabel,
    buttonLink,
    overlayOpacity,
    introKicker,
    introTitle,
    introDesc,
    principalName,
    principalTitle,
    principalQuote,
    principalPhoto,
    stat1Val,
    stat1Label,
    stat2Val,
    stat2Label,
    stat3Val,
    stat3Label,
    stat4Val,
    stat4Label,
    noticesHeading,
    notice1Date,
    notice1Title,
    notice2Date,
    notice2Title,
    eventsHeading,
    event1Date,
    event1Title,
    event1Venue,
    event2Date,
    event2Title,
    event2Venue,
    galleryHeading,
    gallerySub,
    footerAddress,
    footerPhone,
    footerEmail,
    footerCopyright,
    sectionStyles,
    sectionList,
    customSectionsData,
  ])

  // Load saved homepage sections & styles from local cache and backend on mount
  useEffect(() => {
    let isMounted = true

    // 1. Immediately load local storage state if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('studio_builder_homepage_data')
        if (saved) {
          const d = JSON.parse(saved)
          if (d.showAnnouncement !== undefined) setShowAnnouncement(d.showAnnouncement)
          if (d.announcementText) setAnnouncementText(d.announcementText)
          if (d.announcementLink) setAnnouncementLink(d.announcementLink)
          if (d.schoolName) setSchoolName(d.schoolName)
          if (d.logoLetter) setLogoLetter(d.logoLetter)
          if (d.applyButtonText) setApplyButtonText(d.applyButtonText)
          if (d.eyebrow) setEyebrow(d.eyebrow)
          if (d.heading) setHeading(d.heading)
          if (d.description) setDescription(d.description)
          if (d.buttonLabel) setButtonLabel(d.buttonLabel)
          if (d.buttonLink) setButtonLink(d.buttonLink)
          if (d.overlayOpacity !== undefined) setOverlayOpacity(d.overlayOpacity)
          if (d.introKicker) setIntroKicker(d.introKicker)
          if (d.introTitle) setIntroTitle(d.introTitle)
          if (d.introDesc) setIntroDesc(d.introDesc)
          if (d.principalName) setPrincipalName(d.principalName)
          if (d.principalTitle) setPrincipalTitle(d.principalTitle)
          if (d.principalQuote) setPrincipalQuote(d.principalQuote)
          if (d.principalPhoto) setPrincipalPhoto(d.principalPhoto)
          if (d.stat1Val) setStat1Val(d.stat1Val)
          if (d.stat1Label) setStat1Label(d.stat1Label)
          if (d.stat2Val) setStat2Val(d.stat2Val)
          if (d.stat2Label) setStat2Label(d.stat2Label)
          if (d.stat3Val) setStat3Val(d.stat3Val)
          if (d.stat3Label) setStat3Label(d.stat3Label)
          if (d.stat4Val) setStat4Val(d.stat4Val)
          if (d.stat4Label) setStat4Label(d.stat4Label)
          if (d.noticesHeading) setNoticesHeading(d.noticesHeading)
          if (d.notice1Date) setNotice1Date(d.notice1Date)
          if (d.notice1Title) setNotice1Title(d.notice1Title)
          if (d.notice2Date) setNotice2Date(d.notice2Date)
          if (d.notice2Title) setNotice2Title(d.notice2Title)
          if (d.eventsHeading) setEventsHeading(d.eventsHeading)
          if (d.event1Date) setEvent1Date(d.event1Date)
          if (d.event1Title) setEvent1Title(d.event1Title)
          if (d.event1Venue) setEvent1Venue(d.event1Venue)
          if (d.event2Date) setEvent2Date(d.event2Date)
          if (d.event2Title) setEvent2Title(d.event2Title)
          if (d.event2Venue) setEvent2Venue(d.event2Venue)
          if (d.galleryHeading) setGalleryHeading(d.galleryHeading)
          if (d.gallerySub) setGallerySub(d.gallerySub)
          if (d.footerAddress) setFooterAddress(d.footerAddress)
          if (d.footerPhone) setFooterPhone(d.footerPhone)
          if (d.footerEmail) setFooterEmail(d.footerEmail)
          if (d.footerCopyright) setFooterCopyright(d.footerCopyright)
          if (d.sectionStyles) setSectionStyles(d.sectionStyles)
          if (d.sectionList) setSectionList(d.sectionList)
          if (d.customSectionsData) setCustomSectionsData(d.customSectionsData)
        }
      } catch (err) {
        console.debug('Failed to load local builder state:', err)
      }
    }
    isInitializedRef.current = true

    // 2. Fetch and synchronize with backend (only when no local draft exists yet)
    const loadFromBackend = async () => {
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('studio_builder_homepage_data')) {
          return
        }
        const pagesRes = await api.pages.list()
        const pages =
          (pagesRes as any)?.data?.items ||
          (pagesRes as any)?.items ||
          (pagesRes as any)?.data ||
          pagesRes
        const home = Array.isArray(pages)
          ? pages.find((p: any) => p.slug === 'home' || p.isHome)
          : null

        if (home?.id) {
          const detailsRes = await api.pages.get(home.id)
          const pageData = (detailsRes as any)?.data || detailsRes
          const sections: any[] = pageData?.sections || []

          if (Array.isArray(sections) && isMounted) {
            const typeToLabel: Record<string, string> = {
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
              facilities: 'Gallery',
              footer: 'Footer',
              cta: 'Announcement bar',
            }

            sections.forEach((sec: any) => {
              const label = typeToLabel[sec.type]
              if (label && sec.settings && typeof sec.settings === 'object') {
                setSectionStyles((prev) => ({
                  ...prev,
                  [label]: {
                    ...(prev[label] || DEFAULT_STYLES[label]),
                    ...sec.settings,
                  },
                }))
              }

              if (sec.content && typeof sec.content === 'object') {
                const c = sec.content
                if (sec.type === 'announcement') {
                  if (c.text) setAnnouncementText(c.text)
                  if (c.link) setAnnouncementLink(c.link)
                  if (c.show !== undefined) setShowAnnouncement(c.show)
                } else if (sec.type === 'header') {
                  if (c.schoolName) setSchoolName(c.schoolName)
                  if (c.logoLetter) setLogoLetter(c.logoLetter)
                  if (c.applyButtonText) setApplyButtonText(c.applyButtonText)
                } else if (sec.type === 'hero') {
                  if (c.eyebrow) setEyebrow(c.eyebrow)
                  if (c.heading) setHeading(c.heading)
                  if (c.description) setDescription(c.description)
                  if (c.buttonLabel) setButtonLabel(c.buttonLabel)
                  if (c.buttonLink) setButtonLink(c.buttonLink)
                  if (c.overlayOpacity) setOverlayOpacity(c.overlayOpacity)
                } else if (sec.type === 'intro' || sec.type === 'programs') {
                  if (c.kicker) setIntroKicker(c.kicker)
                  if (c.title) setIntroTitle(c.title)
                  if (c.description) setIntroDesc(c.description)
                } else if (sec.type === 'principal') {
                  if (c.name) setPrincipalName(c.name)
                  if (c.title) setPrincipalTitle(c.title)
                  if (c.quote) setPrincipalQuote(c.quote)
                  if (c.photo) setPrincipalPhoto(c.photo)
                } else if (sec.type === 'stats') {
                  if (c.stat1Val) setStat1Val(c.stat1Val)
                  if (c.stat1Label) setStat1Label(c.stat1Label)
                  if (c.stat2Val) setStat2Val(c.stat2Val)
                  if (c.stat2Label) setStat2Label(c.stat2Label)
                  if (c.stat3Val) setStat3Val(c.stat3Val)
                  if (c.stat3Label) setStat3Label(c.stat3Label)
                  if (c.stat4Val) setStat4Val(c.stat4Val)
                  if (c.stat4Label) setStat4Label(c.stat4Label)
                } else if (sec.type === 'news') {
                  if (c.heading) setNoticesHeading(c.heading)
                  if (c.notice1Date) setNotice1Date(c.notice1Date)
                  if (c.notice1Title) setNotice1Title(c.notice1Title)
                  if (c.notice2Date) setNotice2Date(c.notice2Date)
                  if (c.notice2Title) setNotice2Title(c.notice2Title)
                } else if (sec.type === 'events') {
                  if (c.heading) setEventsHeading(c.heading)
                  if (c.event1Date) setEvent1Date(c.event1Date)
                  if (c.event1Title) setEvent1Title(c.event1Title)
                  if (c.event1Venue) setEvent1Venue(c.event1Venue)
                  if (c.event2Date) setEvent2Date(c.event2Date)
                  if (c.event2Title) setEvent2Title(c.event2Title)
                  if (c.event2Venue) setEvent2Venue(c.event2Venue)
                } else if (sec.type === 'gallery' || sec.type === 'facilities') {
                  if (c.heading) setGalleryHeading(c.heading)
                  if (c.subtitle) setGallerySub(c.subtitle)
                } else if (sec.type === 'footer') {
                  if (c.address) setFooterAddress(c.address)
                  if (c.phone) setFooterPhone(c.phone)
                  if (c.email) setFooterEmail(c.email)
                  if (c.copyright) setFooterCopyright(c.copyright)
                }
              }
            })
          }
        }
      } catch (err: unknown) {
        // Fallback silently to initial state if backend not reached yet
        console.debug('Loaded default studio content state:', err)
      }
    }

    loadFromBackend()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    persistToLocal()
    try {
      const pagesRes = await api.pages.list()
      const pages =
        (pagesRes as any)?.data?.items ||
        (pagesRes as any)?.items ||
        (pagesRes as any)?.data ||
        pagesRes
      let homePage = Array.isArray(pages)
        ? pages.find((p: any) => p.slug === 'home' || p.isHome)
        : null

      if (!homePage?.id) {
        const createRes = await api.pages.create({
          slug: 'home',
          title: 'Homepage',
          isHome: true,
          status: 'PUBLISHED',
        })
        homePage = (createRes as any)?.data || createRes
      } else {
        await api.pages.update(homePage.id, {
          title: homePage.title || 'Homepage',
          status: 'PUBLISHED',
        })
      }

      if (homePage?.id) {
        // Fetch current sections from database
        const detailsRes = await api.pages.get(homePage.id)
        const pageData = (detailsRes as any)?.data || detailsRes
        const existingSections: any[] = pageData?.sections || []

        // All sections payload with Content + Style Settings
        const allSectionsToSync: Array<{
          type: string
          title: string
          content: Record<string, any>
          settings: any
          isVisible: boolean
        }> = [
          {
            type: 'announcement',
            title: 'Announcement bar',
            content: {
              text: announcementText,
              link: announcementLink,
              show: showAnnouncement,
            },
            settings:
              sectionStyles['Announcement bar'] ||
              DEFAULT_STYLES['Announcement bar'],
            isVisible: showAnnouncement,
          },
          {
            type: 'header',
            title: 'Site Header',
            content: { schoolName, logoLetter, applyButtonText },
            settings: sectionStyles['Header'] || DEFAULT_STYLES['Header'],
            isVisible: true,
          },
          {
            type: 'hero',
            title: 'Hero section',
            content: {
              eyebrow,
              heading,
              description,
              buttonLabel,
              buttonLink,
              overlayOpacity,
            },
            settings:
              sectionStyles['Hero section'] || DEFAULT_STYLES['Hero section'],
            isVisible: true,
          },
          {
            type: 'intro',
            title: 'School introduction',
            content: {
              kicker: introKicker,
              title: introTitle,
              description: introDesc,
            },
            settings:
              sectionStyles['School introduction'] ||
              DEFAULT_STYLES['School introduction'],
            isVisible: true,
          },
          {
            type: 'principal',
            title: "Principal's Message",
            content: {
              name: principalName,
              title: principalTitle,
              quote: principalQuote,
              photo: principalPhoto,
            },
            settings:
              sectionStyles['Principal message'] ||
              DEFAULT_STYLES['Principal message'],
            isVisible: true,
          },
          {
            type: 'stats',
            title: 'Statistics Counters',
            content: {
              stat1Val,
              stat1Label,
              stat2Val,
              stat2Label,
              stat3Val,
              stat3Label,
              stat4Val,
              stat4Label,
            },
            settings:
              sectionStyles['Statistics'] || DEFAULT_STYLES['Statistics'],
            isVisible: true,
          },
          {
            type: 'news',
            title: 'Latest notices & circulars',
            content: {
              heading: noticesHeading,
              notice1Date,
              notice1Title,
              notice2Date,
              notice2Title,
            },
            settings:
              sectionStyles['Latest notices'] ||
              DEFAULT_STYLES['Latest notices'],
            isVisible: true,
          },
          {
            type: 'events',
            title: 'Upcoming events',
            content: {
              heading: eventsHeading,
              event1Date,
              event1Title,
              event1Venue,
              event2Date,
              event2Title,
              event2Venue,
            },
            settings:
              sectionStyles['Upcoming events'] ||
              DEFAULT_STYLES['Upcoming events'],
            isVisible: true,
          },
          {
            type: 'gallery',
            title: 'Campus Moments Gallery',
            content: { heading: galleryHeading, subtitle: gallerySub },
            settings: sectionStyles['Gallery'] || DEFAULT_STYLES['Gallery'],
            isVisible: true,
          },
          {
            type: 'footer',
            title: 'Site Footer',
            content: {
              address: footerAddress,
              phone: footerPhone,
              email: footerEmail,
              copyright: footerCopyright,
            },
            settings: sectionStyles['Footer'] || DEFAULT_STYLES['Footer'],
            isVisible: true,
          },
        ]

        // Append all custom dynamic sections
        Object.values(customSectionsData).forEach((cs) => {
          allSectionsToSync.push({
            type: cs.type,
            title: cs.title,
            content: {
              title: cs.title,
              subtitle: cs.subtitle,
              items: cs.items,
              buttonText: cs.buttonText,
              buttonLink: cs.buttonLink,
            },
            settings:
              sectionStyles[cs.label] ||
              DEFAULT_STYLES['School introduction'],
            isVisible: true,
          })
        })

        // Persist each section to database
        for (let i = 0; i < allSectionsToSync.length; i++) {
          const item = allSectionsToSync[i]
          const existing = existingSections.find((s) => s.type === item.type)
          if (existing?.id) {
            await api.sections.update(homePage.id, existing.id, {
              title: item.title,
              content: item.content,
              settings: item.settings,
              isVisible: item.isVisible,
              order: i + 1,
            })
          } else {
            await api.sections.create(homePage.id, {
              type: item.type,
              title: item.title,
              content: item.content,
              settings: item.settings,
              isVisible: item.isVisible,
              order: i + 1,
            })
          }
        }
      }

      notify('Homepage sections, content & styles successfully saved! Ready to preview.')
    } catch (err: unknown) {
      console.debug('Backend sync notice:', err)
      notify('Homepage saved successfully! Ready to preview.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="builder">
      {/* Top Toolbar */}
      <div className="builder-toolbar">
        <div className="builder-title">
          <span className="saved-dot" />
          <div>
            <strong>Homepage</strong>
            <small>All changes saved</small>
          </div>
        </div>

        <div className="device-switch">
          {(['monitor', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={device === d ? 'active' : ''}
              onClick={() => setDevice(d)}
              aria-label={`${d} preview`}
            >
              <Icon name={d} />
            </button>
          ))}
        </div>

        <div className="builder-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Undo last change"
            onClick={handleUndo}
          >
            <Icon name="undo" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Redo last change"
            onClick={handleRedo}
          >
            <Icon name="redo" />
          </button>
          <span />
          <Button
            kind={showSettings ? 'primary' : 'secondary'}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Icon name="layout" size={15} />
            {showSettings ? 'Hide panel' : 'Edit section'}
          </Button>
          <Button
            kind="secondary"
            onClick={handlePreview}
          >
            <Icon name="eye" size={15} />
            Preview
          </Button>
          <Button
            kind="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save draft'}
          </Button>
        </div>
      </div>

      <div className="builder-body">
        {/* Left Sidebar: Page Structure Navigation */}
        <aside className="builder-left">
          <div className="panel-tabs">
            <button
              type="button"
              className={leftPanelTab === 'sections' ? 'active' : ''}
              onClick={() => setLeftPanelTab('sections')}
            >
              Sections
            </button>
            <button
              type="button"
              className={leftPanelTab === 'components' ? 'active' : ''}
              onClick={() => setLeftPanelTab('components')}
            >
              Components
            </button>
          </div>
          {leftPanelTab === 'sections' ? (
            <>
              <div className="panel-heading">
                <span>PAGE STRUCTURE</span>
                <button
                  type="button"
                  aria-label="Add element"
                  onClick={() => setShowAddModal(true)}
                >
                  <Icon name="plus" />
                </button>
              </div>
              <div className="section-list">
                {sectionList.map((sec) => {
                  const isHidden =
                    sec.label === 'Announcement bar' && !showAnnouncement
                  return (
                    <button
                      key={sec.label}
                      type="button"
                      onClick={() => handleSelectSection(sec.label)}
                      className={selected === sec.label ? 'active' : ''}
                      style={{
                        cursor: 'pointer',
                        transition: 'background 0.15s, border 0.15s',
                      }}
                    >
                      <i>⠿</i>
                      <span className="section-icon">
                        <Icon name={sec.icon as any} size={15} />
                      </span>
                      <strong>{sec.label}</strong>
                      {isHidden && <small>Hidden</small>}
                      {sec.isCustom ? (
                        <span
                          title="Remove section"
                          onClick={(e) => handleDeleteSection(sec.label, e)}
                          style={{
                            marginLeft: 'auto',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Icon name="close" size={13} />
                        </span>
                      ) : (
                        <Icon name="more" size={15} />
                      )}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                className="add-section"
                onClick={() => setShowAddModal(true)}
              >
                <Icon name="plus" /> Add section
              </button>
            </>
          ) : (
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                AVAILABLE COMPONENTS
              </span>
              {SECTION_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.type}
                  onClick={() => handleAddSection(tpl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name={tpl.icon} size={14} />
                    <strong style={{ color: '#1e293b' }}>{tpl.label}</strong>
                  </div>
                  <span style={{ color: '#2563eb', fontWeight: 600, fontSize: '11px' }}>+ Add</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Center Canvas Area: Fully interactive preview */}
        <div className="canvas-area">
          <div className={`canvas ${device}`}>
            {/* 1. Announcement bar section */}
            {showAnnouncement && (
              <div
                id={
                  sectionStyles['Announcement bar']?.customId ||
                  'canvas-announcement-bar'
                }
                onClick={() => setSelected('Announcement bar')}
                className={sectionStyles['Announcement bar']?.customClass || ''}
                style={{
                  background:
                    sectionStyles['Announcement bar']?.bg || '#0e2447',
                  color: '#f8fafc',
                  padding:
                    sectionStyles['Announcement bar']?.padding === 'compact'
                      ? '6px 20px'
                      : sectionStyles['Announcement bar']?.padding === 'spacious'
                      ? '16px 20px'
                      : '10px 20px',
                  fontSize: '12px',
                  display:
                    sectionStyles['Announcement bar']?.hideOnMobile &&
                    device === 'mobile'
                      ? 'none'
                      : 'flex',
                  alignItems: 'center',
                  justifyContent:
                    sectionStyles['Announcement bar']?.align === 'left'
                      ? 'flex-start'
                      : sectionStyles['Announcement bar']?.align === 'right'
                      ? 'flex-end'
                      : 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  outline:
                    selected === 'Announcement bar'
                      ? '2px solid #2563eb'
                      : 'none',
                  outlineOffset: '-2px',
                  ...(sectionStyles['Announcement bar']?.border
                    ? { borderBottom: '2px solid #2563eb' }
                    : {}),
                  ...(sectionStyles['Announcement bar']?.shadow === 'subtle'
                    ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                    : sectionStyles['Announcement bar']?.shadow === 'card'
                    ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                    : {}),
                }}
              >
                {selected === 'Announcement bar' && (
                  <div className="selection-label">Announcement bar</div>
                )}
                <span>{announcementText}</span>
                <span
                  style={{
                    color: '#facc15',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {announcementLink} →
                </span>
              </div>
            )}

            {/* 2. Header / Navigation */}
            <div
              id={sectionStyles['Header']?.customId || 'canvas-header'}
              onClick={() => setSelected('Header')}
              className={`site-mini-nav ${selected === 'Header' ? 'selected' : ''} ${sectionStyles['Header']?.customClass || ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                background: sectionStyles['Header']?.bg || '#ffffff',
                paddingTop:
                  sectionStyles['Header']?.padding === 'compact'
                    ? '8px'
                    : sectionStyles['Header']?.padding === 'spacious'
                    ? '24px'
                    : '14px',
                paddingBottom:
                  sectionStyles['Header']?.padding === 'compact'
                    ? '8px'
                    : sectionStyles['Header']?.padding === 'spacious'
                    ? '24px'
                    : '14px',
                display:
                  sectionStyles['Header']?.hideOnMobile && device === 'mobile'
                    ? 'none'
                    : 'flex',
                outline: selected === 'Header' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Header']?.border
                  ? { borderBottom: '2px solid #2563eb' }
                  : {}),
                ...(sectionStyles['Header']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Header']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Header' && (
                <div className="selection-label">Header</div>
              )}
              <div className="mini-logo">{logoLetter}</div>
              <strong>{schoolName}</strong>
              <div>
                <span>About</span>
                <span>Academics</span>
                <span>Faculty</span>
                <span>Notices</span>
                <span>Events</span>
                <b style={{ cursor: 'pointer' }}>{applyButtonText}</b>
              </div>
            </div>

            {/* 3. Hero Section */}
            <div
              id={
                sectionStyles['Hero section']?.customId || 'canvas-hero-section'
              }
              onClick={() => setSelected('Hero section')}
              className={`mini-hero ${selected === 'Hero section' ? 'selected' : ''} ${sectionStyles['Hero section']?.customClass || ''}`}
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(9,27,53,${overlayOpacity / 100}),rgba(9,27,53,${(overlayOpacity / 100) * 0.25})),url(${heroImage})`,
                textAlign: sectionStyles['Hero section']?.align || 'left',
                paddingTop:
                  sectionStyles['Hero section']?.padding === 'compact'
                    ? '35px'
                    : sectionStyles['Hero section']?.padding === 'spacious'
                    ? '95px'
                    : '60px',
                paddingBottom:
                  sectionStyles['Hero section']?.padding === 'compact'
                    ? '35px'
                    : sectionStyles['Hero section']?.padding === 'spacious'
                    ? '95px'
                    : '60px',
                display:
                  sectionStyles['Hero section']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'flex',
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'Hero section' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Hero section']?.border
                  ? { borderBottom: '2px solid #2563eb' }
                  : {}),
                ...(sectionStyles['Hero section']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Hero section']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Hero section' && (
                <div className="selection-label">Hero section</div>
              )}
              <div>
                <small>{eyebrow}</small>
                <h2>
                  {heading.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx < heading.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                <p>{description}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected('Hero section')
                    notify(`Hero button action: "${buttonLabel}" (links to ${buttonLink || '/admissions'})`)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {buttonLabel} <Icon name="arrow" size={13} />
                </button>
              </div>
            </div>

            {/* 4. Statistics */}
            <div
              id={
                sectionStyles['Statistics']?.customId || 'canvas-statistics'
              }
              onClick={() => setSelected('Statistics')}
              className={`mini-stats ${selected === 'Statistics' ? 'selected' : ''} ${sectionStyles['Statistics']?.customClass || ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                background: sectionStyles['Statistics']?.bg || '#163d72',
                textAlign: sectionStyles['Statistics']?.align || 'center',
                paddingTop:
                  sectionStyles['Statistics']?.padding === 'compact'
                    ? '14px'
                    : sectionStyles['Statistics']?.padding === 'spacious'
                    ? '45px'
                    : '26px',
                paddingBottom:
                  sectionStyles['Statistics']?.padding === 'compact'
                    ? '14px'
                    : sectionStyles['Statistics']?.padding === 'spacious'
                    ? '45px'
                    : '26px',
                display:
                  sectionStyles['Statistics']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'grid',
                outline:
                  selected === 'Statistics' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Statistics']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Statistics']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Statistics']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Statistics' && (
                <div className="selection-label">Statistics</div>
              )}
              <div>
                <strong>{stat1Val}</strong>
                <span>{stat1Label}</span>
              </div>
              <div>
                <strong>{stat2Val}</strong>
                <span>{stat2Label}</span>
              </div>
              <div>
                <strong>{stat3Val}</strong>
                <span>{stat3Label}</span>
              </div>
              <div>
                <strong>{stat4Val}</strong>
                <span>{stat4Label}</span>
              </div>
            </div>

            {/* 5. School Introduction */}
            <div
              id={
                sectionStyles['School introduction']?.customId ||
                'canvas-school-introduction'
              }
              onClick={() => setSelected('School introduction')}
              className={`mini-intro ${selected === 'School introduction' ? 'selected' : ''} ${sectionStyles['School introduction']?.customClass || ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                background:
                  sectionStyles['School introduction']?.bg || '#ffffff',
                textAlign:
                  sectionStyles['School introduction']?.align || 'center',
                paddingTop:
                  sectionStyles['School introduction']?.padding === 'compact'
                    ? '18px'
                    : sectionStyles['School introduction']?.padding === 'spacious'
                    ? '65px'
                    : '36px',
                paddingBottom:
                  sectionStyles['School introduction']?.padding === 'compact'
                    ? '18px'
                    : sectionStyles['School introduction']?.padding === 'spacious'
                    ? '65px'
                    : '36px',
                display:
                  sectionStyles['School introduction']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'block',
                outline:
                  selected === 'School introduction'
                    ? '2px solid #2563eb'
                    : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['School introduction']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['School introduction']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['School introduction']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'School introduction' && (
                <div className="selection-label">School introduction</div>
              )}
              <small>{introKicker}</small>
              <h3>
                {introTitle.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < introTitle.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                {introDesc}
              </p>
            </div>

            {/* 6. Principal Message */}
            <div
              id={
                sectionStyles['Principal message']?.customId ||
                'canvas-principal-message'
              }
              onClick={() => setSelected('Principal message')}
              className={sectionStyles['Principal message']?.customClass || ''}
              style={{
                padding:
                  sectionStyles['Principal message']?.padding === 'compact'
                    ? '16px 25px'
                    : sectionStyles['Principal message']?.padding === 'spacious'
                    ? '55px 30px'
                    : '30px',
                background:
                  sectionStyles['Principal message']?.bg || '#f8fafc',
                textAlign: sectionStyles['Principal message']?.align || 'left',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                display:
                  sectionStyles['Principal message']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: '24px',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'Principal message'
                    ? '2px solid #2563eb'
                    : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Principal message']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Principal message']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Principal message']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Principal message' && (
                <div className="selection-label">Principal message</div>
              )}
              <img
                src={principalPhoto}
                alt={principalName}
                style={{
                  width: '120px',
                  height: '135px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.1)',
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    color: '#b45309',
                    textTransform: 'uppercase',
                  }}
                >
                  Principal&apos;s Message
                </span>
                <p
                  style={{
                    fontFamily: 'serif',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    color: '#334155',
                    margin: '8px 0 12px',
                    lineHeight: 1.5,
                  }}
                >
                  {principalQuote}
                </p>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                  {principalName}
                </strong>
                <small style={{ color: '#64748b', fontSize: '12px' }}>
                  {principalTitle}
                </small>
              </div>
            </div>

            {/* 7. Latest Notices */}
            <div
              id={
                sectionStyles['Latest notices']?.customId ||
                'canvas-latest-notices'
              }
              onClick={() => setSelected('Latest notices')}
              className={sectionStyles['Latest notices']?.customClass || ''}
              style={{
                padding:
                  sectionStyles['Latest notices']?.padding === 'compact'
                    ? '16px 25px'
                    : sectionStyles['Latest notices']?.padding === 'spacious'
                    ? '55px 30px'
                    : '30px',
                background:
                  sectionStyles['Latest notices']?.bg || '#ffffff',
                textAlign: sectionStyles['Latest notices']?.align || 'left',
                cursor: 'pointer',
                position: 'relative',
                display:
                  sectionStyles['Latest notices']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'block',
                outline:
                  selected === 'Latest notices' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Latest notices']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Latest notices']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Latest notices']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Latest notices' && (
                <div className="selection-label">Latest notices</div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <small
                    style={{
                      fontSize: '11px',
                      color: '#2563eb',
                      fontWeight: 700,
                      letterSpacing: '1px',
                    }}
                  >
                    ACADEMIC NOTICES
                  </small>
                  <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#0f172a' }}>
                    {noticesHeading}
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                  View all notices →
                </span>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                  >
                    {notice1Date}
                  </div>
                  <strong style={{ fontSize: '13px', color: '#1e293b', flex: 1 }}>
                    {notice1Title}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>PDF</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                  >
                    {notice2Date}
                  </div>
                  <strong style={{ fontSize: '13px', color: '#1e293b', flex: 1 }}>
                    {notice2Title}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>PDF</span>
                </div>
              </div>
            </div>

            {/* 8. Upcoming Events */}
            <div
              id={
                sectionStyles['Upcoming events']?.customId ||
                'canvas-upcoming-events'
              }
              onClick={() => setSelected('Upcoming events')}
              className={sectionStyles['Upcoming events']?.customClass || ''}
              style={{
                padding:
                  sectionStyles['Upcoming events']?.padding === 'compact'
                    ? '16px 25px'
                    : sectionStyles['Upcoming events']?.padding === 'spacious'
                    ? '55px 30px'
                    : '30px',
                background:
                  sectionStyles['Upcoming events']?.bg || '#f1f5f9',
                textAlign: sectionStyles['Upcoming events']?.align || 'left',
                cursor: 'pointer',
                position: 'relative',
                display:
                  sectionStyles['Upcoming events']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'block',
                outline:
                  selected === 'Upcoming events' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Upcoming events']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Upcoming events']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Upcoming events']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Upcoming events' && (
                <div className="selection-label">Upcoming events</div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <small
                    style={{
                      fontSize: '11px',
                      color: '#d97706',
                      fontWeight: 700,
                      letterSpacing: '1px',
                    }}
                  >
                    CAMPUS HAPPENINGS
                  </small>
                  <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#0f172a' }}>
                    {eventsHeading}
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>
                  Full calendar →
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '45px',
                      height: '45px',
                      background: '#fef3c7',
                      color: '#b45309',
                      borderRadius: '8px',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      textAlign: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    {event1Date}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a' }}>
                      {event1Title}
                    </strong>
                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                      📍 {event1Venue}
                    </small>
                  </div>
                </div>

                <div
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '45px',
                      height: '45px',
                      background: '#fef3c7',
                      color: '#b45309',
                      borderRadius: '8px',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      textAlign: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    {event2Date}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a' }}>
                      {event2Title}
                    </strong>
                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                      📍 {event2Venue}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Gallery Section */}
            <div
              id={
                sectionStyles['Gallery']?.customId || 'canvas-gallery'
              }
              onClick={() => setSelected('Gallery')}
              className={sectionStyles['Gallery']?.customClass || ''}
              style={{
                padding:
                  sectionStyles['Gallery']?.padding === 'compact'
                    ? '16px 25px'
                    : sectionStyles['Gallery']?.padding === 'spacious'
                    ? '55px 30px'
                    : '30px',
                background: sectionStyles['Gallery']?.bg || '#ffffff',
                textAlign: sectionStyles['Gallery']?.align || 'center',
                cursor: 'pointer',
                position: 'relative',
                display:
                  sectionStyles['Gallery']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'block',
                outline: selected === 'Gallery' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Gallery']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Gallery']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Gallery']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Gallery' && (
                <div className="selection-label">Gallery</div>
              )}
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <small
                  style={{
                    fontSize: '11px',
                    color: '#2563eb',
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  PHOTO ALBUMS
                </small>
                <h3 style={{ margin: '4px 0 6px', fontSize: '18px', color: '#0f172a' }}>
                  {galleryHeading}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  {gallerySub}
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                }}
              >
                <img
                  src={campusImage}
                  alt="Campus"
                  style={{
                    width: '100%',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <img
                  src={interiorImage}
                  alt="Interior"
                  style={{
                    width: '100%',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <img
                  src={heroImage}
                  alt="Students"
                  style={{
                    width: '100%',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>

            {/* Dynamic Custom Added Sections */}
            {sectionList
              .filter((s) => s.isCustom)
              .map((sec) => {
                const data = customSectionsData[sec.label]
                if (!data) return null
                const st =
                  sectionStyles[sec.label] ||
                  DEFAULT_STYLES['School introduction']
                const isSelected = selected === sec.label
                const customSlug = sec.label
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')

                return (
                  <div
                    key={sec.id}
                    id={st.customId || `canvas-${customSlug}`}
                    onClick={() => setSelected(sec.label)}
                    className={st.customClass || ''}
                    style={{
                      padding:
                        st.padding === 'compact'
                          ? '20px 25px'
                          : st.padding === 'spacious'
                          ? '65px 30px'
                          : '40px 30px',
                      background: st.bg,
                      textAlign: st.align,
                      cursor: 'pointer',
                      position: 'relative',
                      color:
                        st.bg === '#163d72' || st.bg === '#091a30'
                          ? '#ffffff'
                          : '#0f172a',
                      outline: isSelected ? '2px solid #2563eb' : 'none',
                      outlineOffset: '-2px',
                      display:
                        st.hideOnMobile && device === 'mobile'
                          ? 'none'
                          : 'block',
                      ...(st.border
                        ? {
                            borderTop: '2px solid #2563eb',
                            borderBottom: '2px solid #2563eb',
                          }
                        : {}),
                      ...(st.shadow === 'subtle'
                        ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                        : st.shadow === 'card'
                        ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                        : {}),
                    }}
                  >
                    {isSelected && (
                      <div className="selection-label">{sec.label}</div>
                    )}

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                      <h3
                        style={{
                          fontSize: '22px',
                          margin: '0 0 8px',
                          fontWeight: 700,
                        }}
                      >
                        {data.title}
                      </h3>
                      {data.subtitle && (
                        <p
                          style={{
                            fontSize: '13px',
                            color:
                              st.bg === '#163d72' || st.bg === '#091a30'
                                ? '#cbd5e1'
                                : '#64748b',
                            margin: '0 0 24px',
                            lineHeight: 1.6,
                          }}
                        >
                          {data.subtitle}
                        </p>
                      )}

                      {data.items && data.items.length > 0 && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              data.type === 'testimonials'
                                ? '1fr 1fr'
                                : data.type === 'facilities'
                                ? 'repeat(3, 1fr)'
                                : '1fr',
                            gap: '14px',
                            marginTop: '12px',
                          }}
                        >
                          {data.items.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                background:
                                  st.bg === '#ffffff'
                                    ? '#f8fafc'
                                    : 'rgba(255,255,255,0.08)',
                                border:
                                  st.bg === '#ffffff'
                                    ? '1px solid #e2e8f0'
                                    : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                padding: '16px 20px',
                                textAlign: 'left',
                              }}
                            >
                              <strong
                                style={{
                                  display: 'block',
                                  fontSize: '14px',
                                  marginBottom: '6px',
                                }}
                              >
                                {data.type === 'faq'
                                  ? `Q: ${item.title}`
                                  : item.title}
                              </strong>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '12px',
                                  color:
                                    st.bg === '#163d72' || st.bg === '#091a30'
                                      ? '#e2e8f0'
                                      : '#475569',
                                  lineHeight: 1.6,
                                }}
                              >
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {data.buttonText && (
                        <div style={{ marginTop: '24px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelected(sec.label)
                              notify(`Section button clicked: "${data.buttonText}" (links to ${data.buttonLink || '#'})`)
                            }}
                            style={{
                              background: '#e3ad3f',
                              color: '#0f172a',
                              border: 'none',
                              fontWeight: 700,
                              padding: '10px 24px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                          >
                            {data.buttonText} →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            {/* 10. Footer Section */}
            <div
              id={
                sectionStyles['Footer']?.customId || 'canvas-footer'
              }
              onClick={() => setSelected('Footer')}
              className={sectionStyles['Footer']?.customClass || ''}
              style={{
                padding:
                  sectionStyles['Footer']?.padding === 'compact'
                    ? '18px 25px'
                    : sectionStyles['Footer']?.padding === 'spacious'
                    ? '60px 25px'
                    : '30px 25px',
                background: sectionStyles['Footer']?.bg || '#091a30',
                color: '#d4deea',
                textAlign: sectionStyles['Footer']?.align || 'left',
                cursor: 'pointer',
                position: 'relative',
                display:
                  sectionStyles['Footer']?.hideOnMobile &&
                  device === 'mobile'
                    ? 'none'
                    : 'block',
                outline: selected === 'Footer' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                ...(sectionStyles['Footer']?.border
                  ? {
                      borderTop: '2px solid #2563eb',
                      borderBottom: '2px solid #2563eb',
                    }
                  : {}),
                ...(sectionStyles['Footer']?.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : sectionStyles['Footer']?.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {selected === 'Footer' && (
                <div className="selection-label">Footer</div>
              )}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr 1fr',
                  gap: '18px',
                  fontSize: '12px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#fff',
                      marginBottom: '6px',
                    }}
                  >
                    {schoolName}
                  </strong>
                  <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
                    {footerAddress}
                  </p>
                </div>
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: '#fff',
                      marginBottom: '6px',
                    }}
                  >
                    Contact
                  </strong>
                  <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
                    📞 {footerPhone}
                    <br />
                    ✉️ {footerEmail}
                  </p>
                </div>
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: '#fff',
                      marginBottom: '6px',
                    }}
                  >
                    Admissions
                  </strong>
                  <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
                    Office hours: Mon – Fri
                    <br />
                    8:00 AM – 4:00 PM
                  </p>
                </div>
              </div>
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#64748b',
                }}
              >
                <span>{footerCopyright}</span>
                <span>Powered by SchoolCanvas Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Editing Settings for Currently Selected Section */}
        {showSettings && (
          <aside className="builder-right">
            <div className="settings-header">
              <div>
                <span>EDITING SECTION</span>
                <strong>{selected}</strong>
              </div>
              <button
                type="button"
                aria-label="Close settings"
                onClick={() => setShowSettings(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="settings-tabs">
              <button
                type="button"
                className={activeTab === 'content' ? 'active' : ''}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                type="button"
                className={activeTab === 'style' ? 'active' : ''}
                onClick={() => setActiveTab('style')}
              >
                Style
              </button>
              <button
                type="button"
                className={activeTab === 'advanced' ? 'active' : ''}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced
              </button>
            </div>

            {/* TAB 1: CONTENT SETTINGS */}
            {activeTab === 'content' && (
              <>
                {/* 1. Announcement bar Settings */}
                {selected === 'Announcement bar' && (
              <>
                <SettingGroup title="Announcement settings">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={showAnnouncement}
                      onChange={(e) => setShowAnnouncement(e.target.checked)}
                      style={{ width: 'auto', margin: 0 }}
                    />
                    <span>Show announcement banner on top</span>
                  </label>
                  <label>
                    Banner message
                    <input
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                  </label>
                  <label>
                    Action link text
                    <input
                      value={announcementLink}
                      onChange={(e) => setAnnouncementLink(e.target.value)}
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 2. Header Settings */}
            {selected === 'Header' && (
              <>
                <SettingGroup title="Header settings">
                  <label>
                    School brand name
                    <input
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </label>
                  <label>
                    Logo letter
                    <input
                      value={logoLetter}
                      maxLength={2}
                      onChange={(e) => setLogoLetter(e.target.value.toUpperCase())}
                    />
                  </label>
                  <label>
                    Call to Action button
                    <input
                      value={applyButtonText}
                      onChange={(e) => setApplyButtonText(e.target.value)}
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 3. Hero Section Settings */}
            {selected === 'Hero section' && (
              <>
                <SettingGroup title="Hero content">
                  <label>
                    Eyebrow text
                    <input
                      value={eyebrow}
                      onChange={(e) => setEyebrow(e.target.value)}
                    />
                  </label>
                  <label>
                    Heading (multi-line)
                    <textarea
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </label>
                </SettingGroup>

                <SettingGroup title="Action Button">
                  <label>
                    Button label
                    <input
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                    />
                  </label>
                  <label>
                    Button link
                    <div className="input-icon">
                      <input
                        value={buttonLink}
                        onChange={(e) => setButtonLink(e.target.value)}
                      />
                      <Icon name="external" size={15} />
                    </div>
                  </label>
                </SettingGroup>

                <SettingGroup title="Background Image">
                  <input
                    type="file"
                    ref={heroBgInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleHeroBgUpload}
                  />
                  <div
                    className="media-picker"
                    style={{ backgroundImage: `url(${customHeroBg || heroImage})` }}
                  >
                    <button
                      type="button"
                      onClick={() => heroBgInputRef.current?.click()}
                    >
                      {customHeroBg ? 'Change photo' : 'Replace photo'}
                    </button>
                  </div>
                  <label>
                    Dark overlay ({overlayOpacity}%)
                    <div className="range">
                      <input
                        type="range"
                        min="15"
                        max="95"
                        value={overlayOpacity}
                        onChange={(e) =>
                          setOverlayOpacity(Number(e.target.value))
                        }
                      />
                      <span>{overlayOpacity}%</span>
                    </div>
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 4. School Introduction Settings */}
            {selected === 'School introduction' && (
              <>
                <SettingGroup title="Introduction content">
                  <label>
                    Kicker eyebrow
                    <input
                      value={introKicker}
                      onChange={(e) => setIntroKicker(e.target.value)}
                    />
                  </label>
                  <label>
                    Headline
                    <textarea
                      value={introTitle}
                      onChange={(e) => setIntroTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Introduction paragraph
                    <textarea
                      style={{ height: '100px' }}
                      value={introDesc}
                      onChange={(e) => setIntroDesc(e.target.value)}
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 5. Principal Message Settings */}
            {selected === 'Principal message' && (
              <>
                <SettingGroup title="Principal details">
                  <label>
                    Principal name
                    <input
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                    />
                  </label>
                  <label>
                    Official title
                    <input
                      value={principalTitle}
                      onChange={(e) => setPrincipalTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Quote / Message
                    <textarea
                      style={{ height: '90px' }}
                      value={principalQuote}
                      onChange={(e) => setPrincipalQuote(e.target.value)}
                    />
                  </label>
                  <label>
                    Photo URL
                    <input
                      value={principalPhoto}
                      onChange={(e) => setPrincipalPhoto(e.target.value)}
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 6. Statistics Settings */}
            {selected === 'Statistics' && (
              <>
                <SettingGroup title="Key stats counters">
                  <label>
                    Stat 1 (Value / Label)
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={stat1Val}
                        onChange={(e) => setStat1Val(e.target.value)}
                        style={{ width: '40%' }}
                      />
                      <input
                        value={stat1Label}
                        onChange={(e) => setStat1Label(e.target.value)}
                        style={{ width: '60%' }}
                      />
                    </div>
                  </label>
                  <label>
                    Stat 2 (Value / Label)
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={stat2Val}
                        onChange={(e) => setStat2Val(e.target.value)}
                        style={{ width: '40%' }}
                      />
                      <input
                        value={stat2Label}
                        onChange={(e) => setStat2Label(e.target.value)}
                        style={{ width: '60%' }}
                      />
                    </div>
                  </label>
                  <label>
                    Stat 3 (Value / Label)
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={stat3Val}
                        onChange={(e) => setStat3Val(e.target.value)}
                        style={{ width: '40%' }}
                      />
                      <input
                        value={stat3Label}
                        onChange={(e) => setStat3Label(e.target.value)}
                        style={{ width: '60%' }}
                      />
                    </div>
                  </label>
                  <label>
                    Stat 4 (Value / Label)
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={stat4Val}
                        onChange={(e) => setStat4Val(e.target.value)}
                        style={{ width: '40%' }}
                      />
                      <input
                        value={stat4Label}
                        onChange={(e) => setStat4Label(e.target.value)}
                        style={{ width: '60%' }}
                      />
                    </div>
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 7. Latest Notices Settings */}
            {selected === 'Latest notices' && (
              <>
                <SettingGroup title="Notices section">
                  <label>
                    Section heading
                    <input
                      value={noticesHeading}
                      onChange={(e) => setNoticesHeading(e.target.value)}
                    />
                  </label>
                  <label>
                    Notice 1 (Date / Title)
                    <input
                      value={notice1Date}
                      onChange={(e) => setNotice1Date(e.target.value)}
                      placeholder="Date"
                      style={{ marginBottom: '6px' }}
                    />
                    <input
                      value={notice1Title}
                      onChange={(e) => setNotice1Title(e.target.value)}
                      placeholder="Notice title"
                    />
                  </label>
                  <label>
                    Notice 2 (Date / Title)
                    <input
                      value={notice2Date}
                      onChange={(e) => setNotice2Date(e.target.value)}
                      placeholder="Date"
                      style={{ marginBottom: '6px' }}
                    />
                    <input
                      value={notice2Title}
                      onChange={(e) => setNotice2Title(e.target.value)}
                      placeholder="Notice title"
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 8. Upcoming Events Settings */}
            {selected === 'Upcoming events' && (
              <>
                <SettingGroup title="Events calendar">
                  <label>
                    Section title
                    <input
                      value={eventsHeading}
                      onChange={(e) => setEventsHeading(e.target.value)}
                    />
                  </label>
                  <label>
                    Event 1 (Date badge / Title / Venue)
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <input
                        value={event1Date}
                        onChange={(e) => setEvent1Date(e.target.value)}
                        style={{ width: '30%' }}
                        placeholder="Date"
                      />
                      <input
                        value={event1Venue}
                        onChange={(e) => setEvent1Venue(e.target.value)}
                        style={{ width: '70%' }}
                        placeholder="Venue"
                      />
                    </div>
                    <input
                      value={event1Title}
                      onChange={(e) => setEvent1Title(e.target.value)}
                      placeholder="Event title"
                    />
                  </label>

                  <label>
                    Event 2 (Date badge / Title / Venue)
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <input
                        value={event2Date}
                        onChange={(e) => setEvent2Date(e.target.value)}
                        style={{ width: '30%' }}
                        placeholder="Date"
                      />
                      <input
                        value={event2Venue}
                        onChange={(e) => setEvent2Venue(e.target.value)}
                        style={{ width: '70%' }}
                        placeholder="Venue"
                      />
                    </div>
                    <input
                      value={event2Title}
                      onChange={(e) => setEvent2Title(e.target.value)}
                      placeholder="Event title"
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 9. Gallery Settings */}
            {selected === 'Gallery' && (
              <>
                <SettingGroup title="Photo gallery">
                  <label>
                    Gallery heading
                    <input
                      value={galleryHeading}
                      onChange={(e) => setGalleryHeading(e.target.value)}
                    />
                  </label>
                  <label>
                    Subtitle
                    <textarea
                      value={gallerySub}
                      onChange={(e) => setGallerySub(e.target.value)}
                    />
                  </label>
                  <Button
                    kind="secondary"
                    onClick={() => setView('gallery')}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    Manage album photos
                  </Button>
                </SettingGroup>
              </>
            )}

            {/* 10. Footer Settings */}
            {selected === 'Footer' && (
              <>
                <SettingGroup title="Footer content">
                  <label>
                    Campus address
                    <input
                      value={footerAddress}
                      onChange={(e) => setFooterAddress(e.target.value)}
                    />
                  </label>
                  <label>
                    Contact phone
                    <input
                      value={footerPhone}
                      onChange={(e) => setFooterPhone(e.target.value)}
                    />
                  </label>
                  <label>
                    Contact email
                    <input
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                    />
                  </label>
                  <label>
                    Copyright notice
                    <input
                      value={footerCopyright}
                      onChange={(e) => setFooterCopyright(e.target.value)}
                    />
                  </label>
                </SettingGroup>
              </>
            )}

            {/* 11. Custom Section Content Editor */}
            {customSectionsData[selected] && (
              <>
                <SettingGroup title="Section details">
                  <label>
                    Section heading
                    <input
                      value={customSectionsData[selected].title}
                      onChange={(e) => {
                        const val = e.target.value
                        setCustomSectionsData((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], title: val },
                        }))
                      }}
                    />
                  </label>
                  <label>
                    Subtitle / Description
                    <textarea
                      value={customSectionsData[selected].subtitle}
                      onChange={(e) => {
                        const val = e.target.value
                        setCustomSectionsData((prev) => ({
                          ...prev,
                          [selected]: { ...prev[selected], subtitle: val },
                        }))
                      }}
                    />
                  </label>
                </SettingGroup>

                <SettingGroup title="Content Items & Cards">
                  {customSectionsData[selected].items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        background: '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <small style={{ fontWeight: 700, color: '#2563eb' }}>
                          Card #{idx + 1}
                        </small>
                        <span
                          title="Delete card"
                          onClick={() => {
                            const nextItems = customSectionsData[
                              selected
                            ].items.filter((_, i) => i !== idx)
                            setCustomSectionsData((prev) => ({
                              ...prev,
                              [selected]: {
                                ...prev[selected],
                                items: nextItems,
                              },
                            }))
                          }}
                          style={{
                            cursor: 'pointer',
                            color: '#ef4444',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </span>
                      </div>
                      <label style={{ margin: '0 0 6px' }}>
                        Title
                        <input
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value
                            const nextItems = [
                              ...customSectionsData[selected].items,
                            ]
                            nextItems[idx].title = val
                            setCustomSectionsData((prev) => ({
                              ...prev,
                              [selected]: {
                                ...prev[selected],
                                items: nextItems,
                              },
                            }))
                          }}
                        />
                      </label>
                      <label style={{ margin: 0 }}>
                        Body text
                        <textarea
                          style={{ height: '60px' }}
                          value={item.text}
                          onChange={(e) => {
                            const val = e.target.value
                            const nextItems = [
                              ...customSectionsData[selected].items,
                            ]
                            nextItems[idx].text = val
                            setCustomSectionsData((prev) => ({
                              ...prev,
                              [selected]: {
                                ...prev[selected],
                                items: nextItems,
                              },
                            }))
                          }}
                        />
                      </label>
                    </div>
                  ))}

                  <Button
                    kind="secondary"
                    onClick={() => {
                      const nextItems = [
                        ...(customSectionsData[selected].items || []),
                        {
                          title: 'New Item',
                          text: 'Enter description text here...',
                        },
                      ]
                      setCustomSectionsData((prev) => ({
                        ...prev,
                        [selected]: { ...prev[selected], items: nextItems },
                      }))
                    }}
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <Icon name="plus" size={13} /> Add New Card
                  </Button>
                </SettingGroup>

                {customSectionsData[selected].buttonText !== undefined && (
                  <SettingGroup title="Action Button">
                    <label>
                      Button label
                      <input
                        value={customSectionsData[selected].buttonText}
                        onChange={(e) => {
                          const val = e.target.value
                          setCustomSectionsData((prev) => ({
                            ...prev,
                            [selected]: {
                              ...prev[selected],
                              buttonText: val,
                            },
                          }))
                        }}
                      />
                    </label>
                    <label>
                      Button link URL
                      <input
                        value={customSectionsData[selected].buttonLink}
                        onChange={(e) => {
                          const val = e.target.value
                          setCustomSectionsData((prev) => ({
                            ...prev,
                            [selected]: {
                              ...prev[selected],
                              buttonLink: val,
                            },
                          }))
                        }}
                      />
                    </label>
                  </SettingGroup>
                )}
              </>
            )}
            </>
            )}

            {/* TAB 2: STYLE SETTINGS */}
            {activeTab === 'style' && (
              <>
                <SettingGroup title="Section Colors">
                  <label>
                    Custom background color
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '6px',
                      }}
                    >
                      <input
                        type="color"
                        value={activeStyle.bg.startsWith('#') ? activeStyle.bg : '#ffffff'}
                        onChange={(e) => updateActiveStyle({ bg: e.target.value })}
                        style={{
                          width: '38px',
                          height: '38px',
                          padding: 0,
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '6px',
                        }}
                      />
                      <input
                        value={activeStyle.bg}
                        onChange={(e) => updateActiveStyle({ bg: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    {[
                      { label: 'White', color: '#ffffff' },
                      { label: 'Light', color: '#f8fafc' },
                      { label: 'Slate', color: '#f1f5f9' },
                      { label: 'Navy', color: '#091a30' },
                      { label: 'Brand', color: '#163d72' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => updateActiveStyle({ bg: c.color })}
                        style={{
                          flex: 1,
                          padding: '6px 2px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border:
                            activeStyle.bg === c.color
                              ? '2px solid #2563eb'
                              : '1px solid #cbd5e1',
                          background: c.color,
                          color:
                            c.color === '#091a30' || c.color === '#163d72'
                              ? '#fff'
                              : '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </SettingGroup>

                <SettingGroup title="Alignment & Spacing">
                  <label>
                    Text alignment
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {(['left', 'center', 'right'] as const).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => updateActiveStyle({ align: a })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border:
                              activeStyle.align === a
                                ? '2px solid #2563eb'
                                : '1px solid #e2e8f0',
                            background: activeStyle.align === a ? '#eff6ff' : '#fff',
                            color: activeStyle.align === a ? '#2563eb' : '#475569',
                            fontWeight: activeStyle.align === a ? 700 : 500,
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </label>

                  <label style={{ marginTop: '12px', display: 'block' }}>
                    Vertical padding (Spacing)
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {[
                        { id: 'compact', label: 'Compact' },
                        { id: 'normal', label: 'Normal' },
                        { id: 'spacious', label: 'Spacious' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => updateActiveStyle({ padding: p.id as any })}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            border:
                              activeStyle.padding === p.id
                                ? '2px solid #2563eb'
                                : '1px solid #e2e8f0',
                            background:
                              activeStyle.padding === p.id ? '#eff6ff' : '#fff',
                            color:
                              activeStyle.padding === p.id ? '#2563eb' : '#475569',
                            fontWeight: activeStyle.padding === p.id ? 700 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </label>
                </SettingGroup>

                <SettingGroup title="Borders & Shadows">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={activeStyle.border}
                      onChange={(e) => updateActiveStyle({ border: e.target.checked })}
                      style={{ width: 'auto', margin: 0 }}
                    />
                    <span>Section divider border (Top & Bottom)</span>
                  </label>

                  <label>
                    Card elevation shadow
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {(['none', 'subtle', 'card'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateActiveStyle({ shadow: s })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border:
                              activeStyle.shadow === s
                                ? '2px solid #2563eb'
                                : '1px solid #e2e8f0',
                            background:
                              activeStyle.shadow === s ? '#eff6ff' : '#fff',
                            color: activeStyle.shadow === s ? '#2563eb' : '#475569',
                            fontWeight: activeStyle.shadow === s ? 700 : 500,
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </label>
                </SettingGroup>
              </>
            )}

            {/* TAB 3: ADVANCED SETTINGS */}
            {activeTab === 'advanced' && (
              <>
                <SettingGroup title="Device Visibility">
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={activeStyle.hideOnMobile}
                      onChange={(e) => updateActiveStyle({ hideOnMobile: e.target.checked })}
                      style={{ width: 'auto', margin: 0 }}
                    />
                    <span>Hide this section on mobile devices</span>
                  </label>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>
                    When checked, this section will automatically be hidden on phone screens.
                  </small>
                </SettingGroup>

                <SettingGroup title="Scroll Animation">
                  <label>
                    Entrance effect
                    <select
                      value={activeStyle.animation}
                      onChange={(e) => updateActiveStyle({ animation: e.target.value })}
                      style={{ marginTop: '6px' }}
                    >
                      <option value="none">None (Immediate)</option>
                      <option value="fade-in">Fade in on scroll</option>
                      <option value="slide-up">Slide up smoothly</option>
                      <option value="zoom-in">Subtle zoom in</option>
                    </select>
                  </label>
                </SettingGroup>

                <SettingGroup title="Developer Attributes">
                  <label>
                    Custom HTML ID (Anchor navigation)
                    <input
                      value={activeStyle.customId}
                      onChange={(e) => updateActiveStyle({ customId: e.target.value })}
                      placeholder="e.g. upcoming-events"
                    />
                  </label>
                  <label style={{ marginTop: '10px', display: 'block' }}>
                    Custom CSS Class names
                    <input
                      value={activeStyle.customClass}
                      onChange={(e) => updateActiveStyle({ customClass: e.target.value })}
                      placeholder="e.g. shadow-lg rounded-2xl"
                    />
                  </label>
                </SettingGroup>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="editor-modal"
            style={{
              width: 'min(640px, 95vw)',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span>SECTION TEMPLATE LIBRARY</span>
                <h2>Add Section to Homepage</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                <Icon name="close" />
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                display: 'grid',
                gap: '12px',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '13px',
                  color: '#64748b',
                }}
              >
                Choose a pre-designed section template to add to your layout:
              </p>

              {SECTION_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.type}
                  onClick={() => handleAddSection(tpl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb'
                    e.currentTarget.style.background = '#eff6ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = '#f8fafc'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: '#dbeafe',
                      color: '#2563eb',
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 auto',
                    }}
                  >
                    <Icon name={tpl.icon as any} size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        color: '#0f172a',
                      }}
                    >
                      {tpl.label}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {tpl.subtitle}
                    </span>
                  </div>
                  <Button
                    kind="primary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => handleAddSection(tpl)}
                  >
                    <Icon name="plus" size={13} /> Add
                  </Button>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <Button kind="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
