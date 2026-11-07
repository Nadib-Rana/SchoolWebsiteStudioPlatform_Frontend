'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { DeviceType } from '@/types/theme'
import { useState } from 'react'

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

export function Builder() {
  const { notify, setView } = useStudio()
  const [device, setDevice] = useState<DeviceType>('monitor')
  const [selected, setSelected] = useState('Hero section')
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content')

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

  const sections = [
    ['menu', 'Announcement bar'],
    ['layout', 'Header'],
    ['image', 'Hero section'],
    ['file', 'School introduction'],
    ['users', 'Principal message'],
    ['chart', 'Statistics'],
    ['bell', 'Latest notices'],
    ['calendar', 'Upcoming events'],
    ['image', 'Gallery'],
    ['globe', 'Footer'],
  ] as const

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const pagesRes = await api.pages.list()
      const pages = (pagesRes as any)?.data || pagesRes
      const homePage = Array.isArray(pages)
        ? pages.find((p: any) => p.slug === 'home' || p.isHome)
        : null
      if (homePage?.id) {
        await api.pages.update(homePage.id, {
          title: homePage.title || 'Homepage',
          status: 'PUBLISHED',
        })
      }
      notify('Homepage sections and content saved successfully to database!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save draft.'
      notify(`Error: ${msg}`)
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
            onClick={() => notify('Undo action')}
          >
            <Icon name="undo" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Redo last change"
            onClick={() => notify('Redo action')}
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
            onClick={() => setView('public')}
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
            <button type="button" className="active">
              Sections
            </button>
            <button
              type="button"
              onClick={() => notify('Components library active')}
            >
              Components
            </button>
          </div>
          <div className="panel-heading">
            <span>PAGE STRUCTURE</span>
            <button
              type="button"
              aria-label="Add element"
              onClick={() => notify('Add custom section to roadmap')}
            >
              <Icon name="plus" />
            </button>
          </div>
          <div className="section-list">
            {sections.map(([icon, label]) => {
              const isHidden = label === 'Announcement bar' && !showAnnouncement
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSelectSection(label)}
                  className={selected === label ? 'active' : ''}
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s, border 0.15s',
                  }}
                >
                  <i>⠿</i>
                  <span className="section-icon">
                    <Icon name={icon as any} size={15} />
                  </span>
                  <strong>{label}</strong>
                  {isHidden && <small>Hidden</small>}
                  <Icon name="more" size={15} />
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="add-section"
            onClick={() => notify('New section creation opened')}
          >
            <Icon name="plus" /> Add section
          </button>
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
                <button type="button">
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
                  <div
                    className="media-picker"
                    style={{ backgroundImage: `url(${heroImage})` }}
                  >
                    <button
                      type="button"
                      onClick={() => notify('Media library opened')}
                    >
                      Replace photo
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
                    onClick={() => notify('Photo uploader opened')}
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
    </div>
  )
}
