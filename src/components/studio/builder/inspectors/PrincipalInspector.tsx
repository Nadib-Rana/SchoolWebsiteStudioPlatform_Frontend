'use client'

import { SettingGroup } from '@/components/common/SettingGroup'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'

interface PrincipalInspectorProps {
  principalName: string
  setPrincipalName: (s: string) => void
  principalTitle: string
  setPrincipalTitle: (s: string) => void
  principalQuote: string
  setPrincipalQuote: (s: string) => void
  principalPhoto: string
  setPrincipalPhoto: (url: string) => void
}

export function PrincipalInspector({
  principalName,
  setPrincipalName,
  principalTitle,
  setPrincipalTitle,
  principalQuote,
  setPrincipalQuote,
  principalPhoto,
  setPrincipalPhoto,
}: PrincipalInspectorProps) {
  return (
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
      <div style={{ marginTop: '12px' }}>
        <ImageUploadControl
          label="Principal Portrait Photo"
          value={principalPhoto}
          onChange={(url) => setPrincipalPhoto(url || '')}
          aspectRatio="portrait"
          pickerTitle="Select Principal Portrait Photo"
          helperText="Professional headshot recommended (400 × 500 px)."
        />
      </div>
    </SettingGroup>
  )
}
