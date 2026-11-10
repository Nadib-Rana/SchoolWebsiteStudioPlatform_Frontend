'use client'

import { RefObject } from 'react'

interface SettingsHiddenInputsProps {
  logoInputRef: RefObject<HTMLInputElement | null>
  faviconInputRef: RefObject<HTMLInputElement | null>
  accountPhotoInputRef: RefObject<HTMLInputElement | null>
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFaviconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAccountPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsHiddenInputs({
  logoInputRef,
  faviconInputRef,
  accountPhotoInputRef,
  onLogoUpload,
  onFaviconUpload,
  onAccountPhotoUpload,
}: SettingsHiddenInputsProps) {
  return (
    <>
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onLogoUpload}
      />
      <input
        ref={faviconInputRef}
        type="file"
        accept="image/*,.ico"
        style={{ display: 'none' }}
        onChange={onFaviconUpload}
      />
      <input
        ref={accountPhotoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onAccountPhotoUpload}
      />
    </>
  )
}
