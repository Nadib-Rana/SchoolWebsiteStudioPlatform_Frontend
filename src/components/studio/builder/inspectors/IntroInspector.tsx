'use client'

import { SettingGroup } from '@/components/common/SettingGroup'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'

interface IntroInspectorProps {
  introKicker: string
  setIntroKicker: (s: string) => void
  introTitle: string
  setIntroTitle: (s: string) => void
  introDesc: string
  setIntroDesc: (s: string) => void
  introImage: string
  setIntroImage: (url: string) => void
  introQuote: string
  setIntroQuote: (s: string) => void
}

export function IntroInspector({
  introKicker,
  setIntroKicker,
  introTitle,
  setIntroTitle,
  introDesc,
  setIntroDesc,
  introImage,
  setIntroImage,
  introQuote,
  setIntroQuote,
}: IntroInspectorProps) {
  return (
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
      <label>
        Highlight Quote
        <textarea
          style={{ height: '75px' }}
          value={introQuote}
          onChange={(e) => setIntroQuote(e.target.value)}
        />
      </label>
      <div style={{ marginTop: '12px' }}>
        <ImageUploadControl
          label="Campus / Introduction Image"
          value={introImage}
          onChange={(url) => setIntroImage(url || '')}
          aspectRatio="video"
          pickerTitle="Select School Introduction Image"
          helperText="Displayed beside your school introduction section on the live homepage."
        />
      </div>
    </SettingGroup>
  )
}
