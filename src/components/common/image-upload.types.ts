import type { CSSProperties } from 'react'

export type AspectRatioType = 'video' | 'square' | 'portrait' | 'auto'

export interface ImageUploadControlProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  helperText?: string
  aspectRatio?: AspectRatioType
  fallbackInitial?: string
  placeholderText?: string
  pickerTitle?: string
}

export function getAspectStyle(aspectRatio: AspectRatioType): CSSProperties {
  switch (aspectRatio) {
    case 'square':
      return { aspectRatio: '1', width: '90px' }
    case 'portrait':
      return { aspectRatio: '3 / 4', width: '100px' }
    case 'video':
      return { aspectRatio: '16 / 9', width: '100%' }
    default:
      return { height: '110px', width: '100%' }
  }
}
