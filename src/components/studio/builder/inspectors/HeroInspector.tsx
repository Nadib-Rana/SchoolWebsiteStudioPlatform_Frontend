'use client'

import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'
import { heroImage } from '@/config/templates'

interface HeroInspectorProps {
  eyebrow: string
  setEyebrow: (s: string) => void
  heading: string
  setHeading: (s: string) => void
  description: string
  setDescription: (s: string) => void
  buttonLabel: string
  setButtonLabel: (s: string) => void
  buttonLink: string
  setButtonLink: (s: string) => void
  heroBg: string | null
  setHeroBg: (url: string | null) => void
  overlayOpacity: number
  setOverlayOpacity: (n: number) => void
}

export function HeroInspector({
  eyebrow,
  setEyebrow,
  heading,
  setHeading,
  description,
  setDescription,
  buttonLabel,
  setButtonLabel,
  buttonLink,
  setButtonLink,
  heroBg,
  setHeroBg,
  overlayOpacity,
  setOverlayOpacity,
}: HeroInspectorProps) {
  return (
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
        <ImageUploadControl
          value={heroBg || heroImage}
          onChange={(url) => setHeroBg(url)}
          aspectRatio="video"
          pickerTitle="Select Hero Background Image"
          helperText="Recommended: 1600 × 900 px. Replaces live canvas hero & persists to database."
        />
        <label style={{ marginTop: '12px' }}>
          Dark overlay ({overlayOpacity}%)
          <div className="range">
            <input
              type="range"
              min="15"
              max="95"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            />
            <span>{overlayOpacity}%</span>
          </div>
        </label>
      </SettingGroup>
    </>
  )
}
