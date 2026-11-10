'use client'

import type { DeviceType } from '@/types/theme'
import type { ThemeConfig } from '@/config/themes'
import type { SectionStyle } from '../builder.types'

interface CanvasAnnouncementHeaderProps {
  showAnnouncement: boolean
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  announcementText: string
  announcementLink: string
  logoLetter: string
  schoolName: string
  applyButtonText: string
  activeCfg?: ThemeConfig
}

export function CanvasAnnouncementHeader({
  showAnnouncement,
  sectionStyles,
  selected,
  setSelected,
  device,
  announcementText,
  announcementLink,
  logoLetter,
  schoolName,
  applyButtonText,
  activeCfg,
}: CanvasAnnouncementHeaderProps) {
  const annoStyle = sectionStyles['Announcement bar']
  const headerStyle = sectionStyles['Header']
  const pad =
    annoStyle?.padding === 'compact'
      ? '6px 20px'
      : annoStyle?.padding === 'spacious'
      ? '16px 20px'
      : '10px 20px'
  const headerPad =
    headerStyle?.padding === 'compact'
      ? '8px'
      : headerStyle?.padding === 'spacious'
      ? '24px'
      : '14px'

  return (
    <>
      {showAnnouncement && (
        <div
          id={annoStyle?.customId || 'canvas-announcement-bar'}
          onClick={() => setSelected('Announcement bar')}
          className={annoStyle?.customClass || ''}
          style={{
            background: annoStyle?.bg || activeCfg?.primaryColor || '#0e2447',
            color: '#f8fafc',
            padding: pad,
            fontSize: '12px',
            display:
              annoStyle?.hideOnMobile && device === 'mobile'
                ? 'none'
                : 'flex',
            alignItems: 'center',
            justifyContent:
              annoStyle?.align === 'left'
                ? 'flex-start'
                : annoStyle?.align === 'right'
                ? 'flex-end'
                : 'center',
            gap: '12px',
            cursor: 'pointer',
            position: 'relative',
            outline: selected === 'Announcement bar' ? '2px solid #2563eb' : 'none',
            outlineOffset: '-2px',
            ...(annoStyle?.border ? { borderBottom: '2px solid #2563eb' } : {}),
            ...(annoStyle?.shadow === 'subtle'
              ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
              : annoStyle?.shadow === 'card'
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

      <div
        id={headerStyle?.customId || 'canvas-header'}
        onClick={() => setSelected('Header')}
        className={`site-mini-nav ${selected === 'Header' ? 'selected' : ''} ${headerStyle?.customClass || ''}`}
        style={{
          cursor: 'pointer',
          position: 'relative',
          background: headerStyle?.bg || activeCfg?.headerBg || '#ffffff',
          paddingTop: headerPad,
          paddingBottom: headerPad,
          display:
            headerStyle?.hideOnMobile && device === 'mobile'
              ? 'none'
              : 'flex',
          outline: selected === 'Header' ? '2px solid #2563eb' : 'none',
          outlineOffset: '-2px',
          ...(headerStyle?.border ? { borderBottom: '2px solid #2563eb' } : {}),
          ...(headerStyle?.shadow === 'subtle'
            ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
            : headerStyle?.shadow === 'card'
            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
            : {}),
        }}
      >
        {selected === 'Header' && (
          <div className="selection-label">Header</div>
        )}
        <div
          className="mini-logo"
          style={{
            background: activeCfg?.primaryColor || '#163d72',
            color: '#ffffff',
          }}
        >
          {logoLetter}
        </div>
        <strong>{schoolName}</strong>
        <div>
          <span>About</span>
          <span>Academics</span>
          <span>Faculty</span>
          <span>Notices</span>
          <span>Events</span>
          <b
            style={{
              cursor: 'pointer',
              background: activeCfg?.secondaryColor || '#e9b949',
              color: '#16243a',
            }}
          >
            {applyButtonText}
          </b>
        </div>
      </div>
    </>
  )
}
