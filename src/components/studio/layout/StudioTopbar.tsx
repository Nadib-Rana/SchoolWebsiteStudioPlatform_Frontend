'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { NotificationsPopover } from '@/components/studio/layout/NotificationsPopover'
import { ProfilePopover } from '@/components/studio/layout/ProfilePopover'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function StudioTopbar() {
  const { setSidebarOpen, setView, notify, unreadNotifications } = useStudio()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
    setProfileOpen(false)
  }

  const toggleProfile = () => {
    setProfileOpen(!profileOpen)
    setNotificationsOpen(false)
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="menu-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Icon name="menu" />
      </button>

      <div className="status">
        <span className="status-dot" />
        Website is live <small>Last published 2h ago</small>
      </div>

      <div className="top-actions">
        <Button
          kind="ghost"
          icon="eye"
          onClick={() => setView('public')}
        >
          <span className="hide-mobile">Preview website</span>
        </Button>

        <div className="popover-anchor">
          <button
            type="button"
            className={notificationsOpen ? 'icon-button active' : 'icon-button'}
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <Icon name="bell" />
            {unreadNotifications > 0 && (
              <>
                <span className="notification-dot" />
                <em className="notification-count">{unreadNotifications}</em>
              </>
            )}
          </button>
          {notificationsOpen && (
            <NotificationsPopover onClose={() => setNotificationsOpen(false)} />
          )}
        </div>

        <button type="button" className="icon-button hide-mobile" aria-label="Help">
          <Icon name="help" />
        </button>

        <div className="popover-anchor">
          <button
            type="button"
            className={profileOpen ? 'profile active' : 'profile'}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={toggleProfile}
          >
            <div>AR</div>
            <span>
              <strong>Amina Rahman</strong>
              <small>Administrator</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
          {profileOpen && <ProfilePopover onClose={() => setProfileOpen(false)} />}
        </div>

        <Button
          kind="primary"
          icon="sparkle"
          className="publish-button"
          onClick={() => notify('Your latest changes are now live')}
        >
          <span className="publish-label">Publish</span>
        </Button>
      </div>
    </header>
  )
}
