'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface HeaderInspectorProps {
  schoolName: string
  setSchoolName: (s: string) => void
  logoLetter: string
  setLogoLetter: (s: string) => void
  applyButtonText: string
  setApplyButtonText: (s: string) => void
}

export function HeaderInspector({
  schoolName,
  setSchoolName,
  logoLetter,
  setLogoLetter,
  applyButtonText,
  setApplyButtonText,
}: HeaderInspectorProps) {
  return (
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
  )
}
