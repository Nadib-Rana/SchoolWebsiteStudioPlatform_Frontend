'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'

export interface ProfilePopoverProps {
  onClose: () => void
}

export function ProfilePopover({ onClose }: ProfilePopoverProps) {
  const { setView, notify, user, currentSchool, logout } = useStudio()

  const navigate = (next: View) => {
    setView(next)
    onClose()
  }

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email
    : 'Administrator'

  const userInitials =
    fullName
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD'

  const schoolName = currentSchool?.name || 'School Studio'
  const schoolInitials =
    schoolName
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SC'

  const isLive = currentSchool?.isPublished ?? true

  return (
    <div className="topbar-popover profile-panel">
      <div className="profile-summary">
        <div style={{ textTransform: 'uppercase', fontWeight: 700 }}>
          {userInitials}
        </div>
        <span>
          <strong>{fullName}</strong>
          <small>{user?.email || 'user@example.com'}</small>
        </span>
      </div>

      <div className="profile-school">
        <span className="school-avatar" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
          {schoolInitials}
        </span>
        <div style={{ overflow: 'hidden' }}>
          <strong
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {schoolName}
          </strong>
          <small>{currentSchool?.role || 'Workspace Owner'}</small>
        </div>
        <span className={`state-badge ${isLive ? 'published' : 'draft'}`}>
          <i />
          {isLive ? 'Live' : 'Draft'}
        </span>
      </div>

      <nav>
        <button type="button" onClick={() => navigate('settings')}>
          <Icon name="users" size={16} />
          <span>
            <strong>Account settings</strong>
            <small>Profile, password and preferences</small>
          </span>
        </button>

        <button type="button" onClick={() => navigate('onboarding')}>
          <Icon name="home" size={16} />
          <span>
            <strong>Register school</strong>
            <small>Create another school website</small>
          </span>
        </button>

        <button type="button" onClick={() => navigate('publishing')}>
          <Icon name="clock" size={16} />
          <span>
            <strong>Publishing activity</strong>
            <small>Versions and live status</small>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            notify('Help center opened')
            onClose()
          }}
        >
          <Icon name="help" size={16} />
          <span>
            <strong>Help & support</strong>
            <small>Guides and support requests</small>
          </span>
        </button>
      </nav>

      <button
        type="button"
        className="profile-signout"
        onClick={() => {
          logout()
          onClose()
        }}
      >
        <Icon name="external" size={15} />
        Sign out
      </button>
    </div>
  )
}
