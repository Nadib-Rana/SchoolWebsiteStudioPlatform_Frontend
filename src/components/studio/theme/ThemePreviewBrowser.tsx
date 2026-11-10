'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'

interface ThemePreviewBrowserProps {
  primaryColor: string
  secondaryColor: string
  fontHeading: string
  fontBody: string
  style: string
  previewDevice: 'monitor' | 'tablet' | 'mobile'
  setPreviewDevice: (dev: 'monitor' | 'tablet' | 'mobile') => void
}

export function ThemePreviewBrowser({
  primaryColor,
  secondaryColor,
  fontHeading,
  fontBody,
  style,
  previewDevice,
  setPreviewDevice,
}: ThemePreviewBrowserProps) {
  const { notify } = useStudio()
  const [builderData, setBuilderData] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem('studio_builder_homepage_data')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const cached = localStorage.getItem('studio_builder_homepage_data')
      if (cached) setBuilderData(JSON.parse(cached))
    } catch (err) {
      console.debug('Failed to load builder homepage data in theme preview:', err)
    }
  }, [])

  const schoolName = builderData?.schoolName || 'Northfield High'
  const logoLetter = builderData?.logoLetter || schoolName.charAt(0).toUpperCase()
  const eyebrow = builderData?.eyebrow || 'LEARN · LEAD · MAKE A DIFFERENCE'
  const heading = builderData?.heading || 'Shaping thinkers.\nBuilding character.'
  const description = builderData?.description || 'A vibrant learning community where every student is known, challenged, and inspired.'
  const buttonLabel = builderData?.buttonLabel || `Discover ${schoolName}`
  const currentHeroImage = builderData?.heroBg || heroImage
  const introKicker = builderData?.introKicker || `WELCOME TO ${schoolName.toUpperCase()}`
  const introTitle = builderData?.introTitle || 'Learning with purpose.\nGrowing with confidence.'
  const introDesc = builderData?.introDesc || `Education at ${schoolName} goes beyond strong results.`
  const announcementText = builderData?.announcementText
  const showAnnouncement = builderData?.showAnnouncement !== false && Boolean(announcementText)
  const radius = style === 'Pill' ? '9999px' : style === 'Square' ? '0px' : '6px'
  const browserWidth = previewDevice === 'mobile' ? '320px' : previewDevice === 'tablet' ? '560px' : '100%'

  return (
    <div className="theme-preview-area">
      <div className="theme-preview-label">
        <span><i />Live preview</span>
        <div className="device-switch">
          {(['monitor', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={previewDevice === d ? 'active' : ''}
              onClick={() => setPreviewDevice(d)}
              aria-label={`${d} preview`}
            >
              <Icon name={d} />
            </button>
          ))}
        </div>
        <span>Homepage</span>
      </div>

      <div
        className={`theme-browser ${previewDevice}`}
        style={{
          '--navy': primaryColor,
          '--accent': secondaryColor,
          fontFamily: fontBody,
          width: browserWidth,
          margin: '0 auto',
          transition: 'width 0.25s ease',
        } as React.CSSProperties}
      >
        {showAnnouncement && (
          <div style={{ background: primaryColor, color: '#ffffff', fontSize: '11px', padding: '6px 14px', textAlign: 'center' }}>
            <span>{announcementText}</span>
          </div>
        )}
        <div className="site-mini-nav">
          <div className="mini-logo" style={{ backgroundColor: primaryColor }}>{logoLetter}</div>
          <strong>{schoolName}</strong>
          <div>
            <span>About</span>
            <span>Academics</span>
            <span>Faculty</span>
            <span>Notices</span>
            <b className={style.toLowerCase()} style={{ backgroundColor: primaryColor, color: '#ffffff', borderRadius: radius }}>
              Apply now
            </b>
          </div>
        </div>

        <div className="theme-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(9,27,53,.85),rgba(9,27,53,.25)),url(${currentHeroImage})` }}>
          <div>
            <small style={{ color: secondaryColor }}>{eyebrow}</small>
            <h2 style={{ fontFamily: fontHeading, whiteSpace: 'pre-line' }}>{heading}</h2>
            <p style={{ fontFamily: fontBody }}>{description}</p>
            <button
              type="button"
              className={style.toLowerCase()}
              onClick={() => notify(`Preview button styled with ${style.toLowerCase()} corners & theme colors.`)}
              style={{ backgroundColor: secondaryColor, color: '#0f172a', cursor: 'pointer', borderRadius: radius }}
            >
              {buttonLabel} <Icon name="arrow" size={13} />
            </button>
          </div>
        </div>

        <div className="theme-preview-content">
          <span style={{ color: secondaryColor }}>{introKicker}</span>
          <h3 style={{ fontFamily: fontHeading, whiteSpace: 'pre-line' }}>{introTitle}</h3>
          <p style={{ fontFamily: fontBody }}>{introDesc}</p>
        </div>
      </div>
    </div>
  )
}
