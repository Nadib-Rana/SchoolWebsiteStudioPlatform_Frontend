'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'

export function ThemeCustomization() {
  const { notify, setPreviewTheme } = useStudio()
  const [style, setStyle] = useState('Rounded')
  const [header, setHeader] = useState('Centered')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const [primaryColor, setPrimaryColor] = useState('#163D72')
  const [secondaryColor, setSecondaryColor] = useState('#E3AD3F')
  const [fontHeading, setFontHeading] = useState('DM Serif Display')
  const [fontBody, setFontBody] = useState('Inter')

  useEffect(() => {
    let mounted = true
    const loadTheme = async () => {
      try {
        const res = await api.theme.get()
        const data = (res as any)?.data || res
        if (mounted && data) {
          const cfg = data.draftConfig || data
          if (cfg.primaryColor) setPrimaryColor(cfg.primaryColor)
          if (cfg.secondaryColor) setSecondaryColor(cfg.secondaryColor)
          if (cfg.fontHeading) setFontHeading(cfg.fontHeading)
          if (cfg.fontBody) setFontBody(cfg.fontBody)
          if (cfg.buttonRadius) {
            setStyle(
              cfg.buttonRadius.includes('full')
                ? 'Pill'
                : cfg.buttonRadius.includes('none')
                ? 'Square'
                : 'Rounded'
            )
          }
        }
      } catch (err) {
        console.warn('Failed to load theme configuration:', err)
      }
    }
    loadTheme()
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      const buttonRadius =
        style === 'Pill' ? 'rounded-full' : style === 'Square' ? 'rounded-none' : 'rounded-md'
      await api.theme.saveDraft({
        primaryColor,
        secondaryColor,
        fontHeading,
        fontBody,
        buttonRadius,
        headerLayout: header.toLowerCase(),
      })
      notify('Theme draft saved to database')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save theme draft.'
      notify(`Error: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const buttonRadius =
        style === 'Pill' ? 'rounded-full' : style === 'Square' ? 'rounded-none' : 'rounded-md'
      // First save current values as draft
      await api.theme.saveDraft({
        primaryColor,
        secondaryColor,
        fontHeading,
        fontBody,
        buttonRadius,
        headerLayout: header.toLowerCase(),
      })
      // Then publish
      await api.theme.publish()
      notify('Theme successfully published to live website!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish theme.'
      notify(`Error: ${msg}`)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="theme-studio">
      <div className="theme-toolbar">
        <div>
          <span className="eyebrow">GLOBAL STYLES</span>
          <h1>Theme customization</h1>
          <p>Shape a consistent visual identity across every page.</p>
        </div>
        <div>
          <Button
            onClick={() => {
              setPrimaryColor('#163D72')
              setSecondaryColor('#E3AD3F')
              setStyle('Rounded')
              setFontHeading('DM Serif Display')
              notify('Reset to default school brand palette')
            }}
          >
            Reset to default
          </Button>
          <Button onClick={handleSaveDraft} disabled={isSaving || isPublishing}>
            {isSaving ? 'Saving...' : 'Save draft'}
          </Button>
          <Button
            kind="primary"
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish changes'}
          </Button>
        </div>
      </div>

      <div className="theme-body">
        <aside className="theme-controls">
          <SettingGroup title="Brand colors">
            <div className="theme-colors">
              <label>
                <span>Primary Color</span>
                <div>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                  />
                  <input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
              </label>

              <label>
                <span>Accent Color</span>
                <div>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                  />
                  <input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </SettingGroup>

          <SettingGroup title="Typography">
            <label>
              Heading font
              <select
                value={fontHeading}
                onChange={(e) => setFontHeading(e.target.value)}
              >
                <option value="DM Serif Display">DM Serif Display</option>
                <option value="Inter">Inter</option>
                <option value="Georgia">Georgia</option>
              </select>
            </label>
            <label>
              Body font
              <select
                value={fontBody}
                onChange={(e) => setFontBody(e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="system-ui">System Default</option>
              </select>
            </label>
            <div className="font-preview">
              <span>Aa</span>
              <div>
                <strong>{fontHeading}</strong>
                <small>Headings and editorial moments</small>
              </div>
            </div>
          </SettingGroup>

          <SettingGroup title="Buttons & corners">
            <label>
              Button style
              <div className="choice-row">
                {['Square', 'Rounded', 'Pill'].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={style === x ? 'active' : ''}
                    onClick={() => setStyle(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </label>
          </SettingGroup>

          <SettingGroup title="Header & navigation">
            <label>
              Header layout
              <div className="choice-row">
                {['Compact', 'Centered', 'Overlay'].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={header === x ? 'active' : ''}
                    onClick={() => setHeader(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </label>
          </SettingGroup>
        </aside>

        <div className="theme-preview-area">
          <div className="theme-preview-label">
            <span>
              <i />
              Live preview
            </span>
            <div className="device-switch">
              <button
                type="button"
                className="active"
                aria-label="Desktop preview"
              >
                <Icon name="monitor" />
              </button>
              <button type="button" aria-label="Tablet preview">
                <Icon name="tablet" />
              </button>
              <button type="button" aria-label="Mobile preview">
                <Icon name="mobile" />
              </button>
            </div>
            <span>Homepage</span>
          </div>

          <div
            className="theme-browser"
            style={
              {
                '--navy': primaryColor,
                '--accent': secondaryColor,
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
                <h2>
                  Shaping thinkers.
                  <br />
                  Building character.
                </h2>
                <p>
                  A vibrant learning community where every student is known,
                  challenged, and inspired.
                </p>
                <button
                  type="button"
                  className={style.toLowerCase()}
                  style={{
                    backgroundColor: secondaryColor,
                    color: '#0f172a',
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
              <h3>
                Learning with purpose.
                <br />
                Growing with confidence.
              </h3>
              <p>Education at Northfield goes beyond strong results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
