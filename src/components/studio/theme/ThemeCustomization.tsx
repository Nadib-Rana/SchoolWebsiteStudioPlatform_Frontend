'use client'

import { Button } from '@/components/common/Button'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'
import { ThemeControlsSidebar } from './ThemeControlsSidebar'
import { ThemePreviewBrowser } from './ThemePreviewBrowser'

export function ThemeCustomization() {
  const { notify } = useStudio()
  const [style, setStyle] = useState('Rounded')
  const [header, setHeader] = useState('Centered')
  const [previewDevice, setPreviewDevice] = useState<'monitor' | 'tablet' | 'mobile'>('monitor')
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
      await api.theme.saveDraft({
        primaryColor,
        secondaryColor,
        fontHeading,
        fontBody,
        buttonRadius,
        headerLayout: header.toLowerCase(),
      })
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
        <ThemeControlsSidebar
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
          fontHeading={fontHeading}
          setFontHeading={setFontHeading}
          fontBody={fontBody}
          setFontBody={setFontBody}
          style={style}
          setStyle={setStyle}
          header={header}
          setHeader={setHeader}
        />

        <ThemePreviewBrowser
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          fontHeading={fontHeading}
          fontBody={fontBody}
          style={style}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
        />
      </div>
    </div>
  )
}
