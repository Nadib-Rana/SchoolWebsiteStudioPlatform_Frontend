'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

export interface NotificationPref {
  id: string
  label: string
  desc: string
  email: boolean
  inApp: boolean
}

interface NotificationsTabProps {
  notificationPreferences: NotificationPref[]
  toggleNotification: (id: string, channel: 'email' | 'inApp') => void
  onSaveNotifications: () => Promise<void> | void
}

export function NotificationsTab({
  notificationPreferences,
  toggleNotification,
  onSaveNotifications,
}: NotificationsTabProps) {
  return (
    <div className="card settings-form">
      <SettingsTitle
        title="Notification preferences"
        description="Choose the activity you want to hear about and where."
      />
      <div className="notification-settings-head">
        <span>Notification</span>
        <span>Email</span>
        <span>In-app</span>
      </div>
      {notificationPreferences.map((x) => (
        <div className="notification-setting" key={x.id}>
          <div>
            <strong>{x.label}</strong>
            <small>{x.desc}</small>
          </div>
          <button
            type="button"
            className={x.email ? 'toggle on' : 'toggle'}
            onClick={() => toggleNotification(x.id, 'email')}
            aria-label={`Toggle email for ${x.label}`}
          >
            <i />
          </button>
          <button
            type="button"
            className={x.inApp ? 'toggle on' : 'toggle'}
            onClick={() => toggleNotification(x.id, 'inApp')}
            aria-label={`Toggle in-app for ${x.label}`}
          >
            <i />
          </button>
        </div>
      ))}
      <div className="settings-divider">
        <strong>Quiet hours</strong>
        <p>Pause non-critical notifications outside your working day.</p>
      </div>
      <div className="form-grid">
        <label>
          From
          <input type="time" defaultValue="18:00" />
        </label>
        <label>
          Until
          <input type="time" defaultValue="08:00" />
        </label>
      </div>
      <SettingsSave
        text="Critical security alerts are always delivered"
        onSave={onSaveNotifications}
      />
    </div>
  )
}
