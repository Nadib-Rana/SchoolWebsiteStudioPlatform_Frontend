'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface IntroInspectorProps {
  introKicker: string
  setIntroKicker: (s: string) => void
  introTitle: string
  setIntroTitle: (s: string) => void
  introDesc: string
  setIntroDesc: (s: string) => void
}

export function IntroInspector({
  introKicker,
  setIntroKicker,
  introTitle,
  setIntroTitle,
  introDesc,
  setIntroDesc,
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
    </SettingGroup>
  )
}
