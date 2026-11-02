'use client'

import { Icon } from '@/components/common/Icon'
import { useState, type ReactNode } from 'react'

export interface SettingGroupProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function SettingGroup({
  title,
  children,
  defaultOpen = true,
  className = '',
}: SettingGroupProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`setting-group ${className}`}>
      <button type="button" onClick={() => setOpen(!open)}>
        <strong>{title}</strong>
        <Icon name="chevron" size={14} />
      </button>
      {open && <div className="setting-content">{children}</div>}
    </div>
  )
}
