'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'
import { api } from '@/lib/api-client'

export interface ProfilePopoverProps {
  onClose: () => void
}

export function ProfilePopover({ onClose }: ProfilePopoverProps) {
  const { setView, notify } = useStudio()

  const navigate = (next: View) => {
    setView(next)
    onClose()
  }

  return (
    <div className="topbar-popover profile-panel">
      <div className="profile-summary">
        <div>AR</div>
        <span>
          <strong>Amina Rahman</strong>
          <small>admin@northfield.edu</small>
        </span>
      </div>

      <div className="profile-school">
        <span className="school-avatar">NH</span>
        <div>
          <strong>Northfield High School</strong>
          <small>Workspace administrator</small>
        </div>
        <span className="state-badge published">
          <i />
          Live
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
            <strong>School setup</strong>
            <small>Identity and website details</small>
          </span>
        </button>

        <button type="button" onClick={() => navigate('publishing')}>
          <Icon name="clock" size={16} />
          <span>
            <strong>Publishing activity</strong>
            <small>Versions and recent changes</small>
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
          api.clearAuthToken()
          notify('Signed out successfully')
          navigate('login')
        }}
      >
        <Icon name="external" size={15} />
        Sign out
      </button>
    </div>
  )
}
