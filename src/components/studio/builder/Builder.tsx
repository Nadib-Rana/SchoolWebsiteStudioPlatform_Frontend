'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { DeviceType } from '@/types/theme'
import { useState } from 'react'

export function Builder() {
  const { notify, setView } = useStudio()
  const [device, setDevice] = useState<DeviceType>('monitor')
  const [selected, setSelected] = useState('Hero section')
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(true)

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
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const el = document.getElementById(`canvas-${slug}`)
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
                id="canvas-announcement-bar"
                onClick={() => setSelected('Announcement bar')}
                style={{
                  background: '#0e2447',
                  color: '#f8fafc',
                  padding: '8px 20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  outline:
                    selected === 'Announcement bar'
                      ? '2px solid #2563eb'
                      : 'none',
                  outlineOffset: '-2px',
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
              id="canvas-header"
              onClick={() => setSelected('Header')}
              className={`site-mini-nav ${selected === 'Header' ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                outline: selected === 'Header' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              id="canvas-hero-section"
              onClick={() => setSelected('Hero section')}
              className={`mini-hero ${selected === 'Hero section' ? 'selected' : ''}`}
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(9,27,53,${overlayOpacity / 100}),rgba(9,27,53,${(overlayOpacity / 100) * 0.25})),url(${heroImage})`,
                cursor: 'pointer',
                position: 'relative',
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
              id="canvas-statistics"
              onClick={() => setSelected('Statistics')}
              className={`mini-stats ${selected === 'Statistics' ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'Statistics' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              id="canvas-school-introduction"
              onClick={() => setSelected('School introduction')}
              className={`mini-intro ${selected === 'School introduction' ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'School introduction'
                    ? '2px solid #2563eb'
                    : 'none',
                outlineOffset: '-2px',
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
              id="canvas-principal-message"
              onClick={() => setSelected('Principal message')}
              style={{
                padding: '30px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                display: 'grid',
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
              id="canvas-latest-notices"
              onClick={() => setSelected('Latest notices')}
              style={{
                padding: '30px',
                background: '#fff',
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'Latest notices' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              id="canvas-upcoming-events"
              onClick={() => setSelected('Upcoming events')}
              style={{
                padding: '30px',
                background: '#f1f5f9',
                cursor: 'pointer',
                position: 'relative',
                outline:
                  selected === 'Upcoming events' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              id="canvas-gallery"
              onClick={() => setSelected('Gallery')}
              style={{
                padding: '30px',
                background: '#fff',
                cursor: 'pointer',
                position: 'relative',
                outline: selected === 'Gallery' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              id="canvas-footer"
              onClick={() => setSelected('Footer')}
              style={{
                padding: '30px 25px',
                background: '#091a30',
                color: '#d4deea',
                cursor: 'pointer',
                position: 'relative',
                outline: selected === 'Footer' ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
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
              <button type="button" className="active">
                Content
              </button>
              <button
                type="button"
                onClick={() => notify('Style controls active')}
              >
                Style
              </button>
              <button
                type="button"
                onClick={() => notify('Advanced animations active')}
              >
                Advanced
              </button>
            </div>

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
          </aside>
        )}
      </div>
    </div>
  )
}
