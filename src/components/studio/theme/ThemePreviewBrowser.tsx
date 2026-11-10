'use client'

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

  return (
    <div className="theme-preview-area">
      <div className="theme-preview-label">
        <span>
          <i />
          Live preview
        </span>
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
        style={
          {
            '--navy': primaryColor,
            '--accent': secondaryColor,
            fontFamily: fontBody,
            width:
              previewDevice === 'mobile'
                ? '320px'
                : previewDevice === 'tablet'
                ? '560px'
                : '100%',
            margin: '0 auto',
            transition: 'width 0.25s ease',
          } as React.CSSProperties
        }
      >
        <div className="site-mini-nav">
          <div
            className="mini-logo"
            style={{ backgroundColor: primaryColor }}
          >
            N
          </div>
          <strong>Northfield High</strong>
          <div>
            <span>About</span>
            <span>Academics</span>
            <span>Faculty</span>
            <span>Notices</span>
            <b
              className={style.toLowerCase()}
              style={{
                backgroundColor: primaryColor,
                borderRadius:
                  style === 'Pill'
                    ? '9999px'
                    : style === 'Square'
                    ? '0px'
                    : '6px',
              }}
            >
              Apply now
            </b>
          </div>
        </div>

        <div
          className="theme-hero"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(9,27,53,.9),rgba(9,27,53,.12)),url(${heroImage})`,
          }}
        >
          <div>
            <small style={{ color: secondaryColor }}>
              LEARN · LEAD · MAKE A DIFFERENCE
            </small>
            <h2 style={{ fontFamily: fontHeading }}>
              Shaping thinkers.
              <br />
              Building character.
            </h2>
            <p style={{ fontFamily: fontBody }}>
              A vibrant learning community where every student is known,
              challenged, and inspired.
            </p>
            <button
              type="button"
              className={style.toLowerCase()}
              onClick={() =>
                notify(
                  `Preview button styled with ${style.toLowerCase()} corners & theme colors.`,
                )
              }
              style={{
                backgroundColor: secondaryColor,
                color: '#0f172a',
                cursor: 'pointer',
                borderRadius:
                  style === 'Pill'
                    ? '9999px'
                    : style === 'Square'
                    ? '0px'
                    : '6px',
              }}
            >
              Discover Northfield <Icon name="arrow" size={13} />
            </button>
          </div>
        </div>

        <div className="theme-preview-content">
          <span style={{ color: secondaryColor }}>
            WELCOME TO NORTHFIELD
          </span>
          <h3 style={{ fontFamily: fontHeading }}>
            Learning with purpose.
            <br />
            Growing with confidence.
          </h3>
          <p style={{ fontFamily: fontBody }}>
            Education at Northfield goes beyond strong results.
          </p>
        </div>
      </div>
    </div>
  )
}
