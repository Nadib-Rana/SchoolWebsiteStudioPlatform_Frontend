'use client'

import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { IconName } from '@/types/studio'

interface SettingsNavProps {
  active: string
  setActive: (tab: string) => void
  notify: (msg: string) => void
  setView: (view: any) => void
}

const TABS: [string, IconName][] = [
  ['School profile', 'home'],
  ['Account', 'users'],
  ['Users & roles', 'users'],
  ['Notifications', 'bell'],
  ['Website', 'globe'],
  ['Security', 'settings'],
  ['Backup & export', 'file'],
]

export function SettingsNav({ active, setActive, notify, setView }: SettingsNavProps) {
  return (
    <div className="settings-nav">
      {TABS.map(([label, icon]) => (
        <button
          key={label}
          type="button"
          className={active === label ? 'active' : ''}
          onClick={() => setActive(label)}
        >
          <Icon name={icon} size={16} />
          {label}
          <Icon name="chevron" size={13} />
        </button>
      ))}
      <button
        type="button"
        className="signout"
        onClick={() => {
          api.clearAuthToken()
          notify('Signed out successfully')
          setView('login')
        }}
      >
        <Icon name="external" size={15} />
        Sign out
      </button>
    </div>
  )
}
