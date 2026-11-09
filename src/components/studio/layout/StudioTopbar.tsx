'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { NotificationsPopover } from '@/components/studio/layout/NotificationsPopover'
import { ProfilePopover } from '@/components/studio/layout/ProfilePopover'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function StudioTopbar() {
  const {
    setSidebarOpen,
    setView,
    notify,
    unreadNotifications,
    user,
    currentSchool,
  } = useStudio()

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

  const isLive = currentSchool?.isPublished ?? true
  const schoolSlug = currentSchool?.slug || 'northfield-high'

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

      <div className="status" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          className="status-dot"
          style={{
            background: isLive ? '#10b981' : '#f59e0b',
            boxShadow: isLive ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
          }}
        />
        <span style={{ fontSize: '13px' }}>
          <strong>{currentSchool?.name || 'School'}</strong> is {isLive ? 'Live' : 'in Draft'}
        </span>
      </div>

      <div className="top-actions">
        <Button
          kind="ghost"
          icon="eye"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(`/${schoolSlug}`, '_blank')
            }
          }}
        >
          <span className="hide-mobile">View Live Site</span>
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

        <button
          type="button"
          className="icon-button hide-mobile"
          aria-label="Help"
          onClick={() => setView('settings')}
        >
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
            <div style={{ textTransform: 'uppercase', fontWeight: 700 }}>
              {userInitials}
            </div>
            <span>
              <strong>{fullName}</strong>
              <small>{currentSchool?.role || user?.role || 'Admin'}</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
          {profileOpen && <ProfilePopover onClose={() => setProfileOpen(false)} />}
        </div>

        <Button
          kind="primary"
          icon="sparkle"
          className="publish-button"
          onClick={() => notify(`Changes published for ${currentSchool?.name || 'school'}!`)}
        >
          <span className="publish-label">Publish</span>
        </Button>
      </div>
    </header>
  )
}
