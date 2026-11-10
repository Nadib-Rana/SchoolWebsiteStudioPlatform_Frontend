'use client'

import { type ReactNode } from 'react'
import { Button } from '@/components/common/Button'

export function SettingsTitle({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="settings-title">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

export function SettingsSave({
  text,
  notify,
  onSave,
  isSaving = false,
}: {
  text: string
  notify?: () => void
  onSave?: () => Promise<void> | void
  isSaving?: boolean
}) {
  const handleClick = () => {
    if (onSave) {
      onSave()
    } else if (notify) {
      notify()
    }
  }

  return (
    <div className="settings-save">
      <span>{text}</span>
      <Button disabled={isSaving} onClick={handleClick}>
        {isSaving ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}
