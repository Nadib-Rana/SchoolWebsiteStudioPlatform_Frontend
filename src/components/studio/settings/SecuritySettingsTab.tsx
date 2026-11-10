'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

export interface SessionItem {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

interface SecuritySettingsTabProps {
  twoFactorAuth: boolean
  setTwoFactorAuth: React.Dispatch<React.SetStateAction<boolean>>
  strongPassword: boolean
  setStrongPassword: React.Dispatch<React.SetStateAction<boolean>>
  sessionTimeout: string
  handleCycleSessionTimeout: () => void
  newDeviceAlerts: boolean
  setNewDeviceAlerts: React.Dispatch<React.SetStateAction<boolean>>
  sessions: SessionItem[]
  handleRevokeSession: (id: string) => void
  handleSignOutOtherDevices: () => void
  handleSaveSecurity: () => Promise<void> | void
  notify: (msg: string) => void
}

export function SecuritySettingsTab({
  twoFactorAuth,
  setTwoFactorAuth,
  strongPassword,
  setStrongPassword,
  sessionTimeout,
  handleCycleSessionTimeout,
  newDeviceAlerts,
  setNewDeviceAlerts,
  sessions,
  handleRevokeSession,
  handleSignOutOtherDevices,
  handleSaveSecurity,
  notify,
}: SecuritySettingsTabProps) {
  const securityRows = [
    {
      label: 'Two-factor authentication',
      desc: 'Require an additional verification code at sign in',
      value: twoFactorAuth ? 'Required' : 'Optional',
      action: () => {
        setTwoFactorAuth((p) => !p)
        notify(`Two-factor authentication is now ${!twoFactorAuth ? 'Required' : 'Optional'}`)
      },
    },
    {
      label: 'Strong password policy',
      desc: 'Require at least 12 characters for all team members',
      value: strongPassword ? 'Enabled' : 'Disabled',
      action: () => {
        setStrongPassword((p) => !p)
        notify(`Strong password policy is now ${!strongPassword ? 'Enabled' : 'Disabled'}`)
      },
    },
    {
      label: 'Session timeout',
      desc: 'Automatically sign out inactive users',
      value: sessionTimeout,
      action: handleCycleSessionTimeout,
    },
    {
      label: 'New device alerts',
      desc: 'Email account owners when a new device signs in',
      value: newDeviceAlerts ? 'Enabled' : 'Disabled',
      action: () => {
        setNewDeviceAlerts((p) => !p)
        notify(`New device alerts are now ${!newDeviceAlerts ? 'Enabled' : 'Disabled'}`)
      },
    },
  ]

  return (
    <div className="settings-content-stack">
      <div className="card settings-form">
        <SettingsTitle
          title="Security settings"
          description="Protect your account, team, and published website."
        />
        <div className="security-score">
          <span>
            <Icon name="check" />
          </span>
          <div>
            <strong>Security posture is strong</strong>
            <p>All recommended protections are currently active.</p>
          </div>
          <b>94%</b>
        </div>

        {securityRows.map((x) => (
          <div className="security-row" key={x.label}>
            <span>
              <Icon name="check" size={13} />
            </span>
            <div>
              <strong>{x.label}</strong>
              <small>{x.desc}</small>
            </div>
            <button type="button" onClick={x.action}>
              {x.value} <Icon name="chevron" size={12} />
            </button>
          </div>
        ))}

        <SettingsSave
          text="Security settings apply immediately across all users"
          onSave={handleSaveSecurity}
        />
      </div>

      <div className="card settings-form">
        <SettingsTitle
          title="Active sessions"
          description="Devices currently signed in to your account."
        />
        {sessions.map((s) => (
          <div className="session-row" key={s.id}>
            <span>
              <Icon name={s.device.toLowerCase().includes('phone') ? 'mobile' : 'monitor'} />
            </span>
            <div>
              <strong>{s.device}</strong>
              <small>
                {s.location} · {s.current ? 'Current session' : s.lastActive}
              </small>
            </div>
            {s.current ? (
              <em>Active now</em>
            ) : (
              <button type="button" onClick={() => handleRevokeSession(s.id)}>
                Revoke
              </button>
            )}
          </div>
        ))}
        <div className="danger-settings">
          <div>
            <strong>Sign out everywhere</strong>
            <p>End all sessions except the device you are using now.</p>
          </div>
          <Button onClick={handleSignOutOtherDevices}>
            Sign out other devices
          </Button>
        </div>
      </div>
    </div>
  )
}
