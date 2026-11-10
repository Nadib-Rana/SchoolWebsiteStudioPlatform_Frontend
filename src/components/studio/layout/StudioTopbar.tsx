'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { NotificationsPopover } from '@/components/studio/layout/NotificationsPopover'
import { ProfilePopover } from '@/components/studio/layout/ProfilePopover'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useState } from 'react'

export function StudioTopbar() {
  const { setSidebarOpen, setView, notify, unreadNotifications, user, currentSchool, refreshSchools } = useStudio()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

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

  const userInitials = fullName.split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'
  const isLive = currentSchool?.isPublished ?? true
  const schoolSlug = currentSchool?.slug || 'northfield-high'

  const handleGlobalPublish = async () => {
    if (isPublishing) return

    const token = api.getAuthToken()
    if (!token) {
      notify('⚠️ Please sign in as an administrator to publish.')
      setView('login')
      return
    }

    setIsPublishing(true)
    const schoolId = currentSchool?.id || api.getActiveSchoolId()
    const schoolName = currentSchool?.name || 'School'

    try {
      let nextTag = 'v1.1'
      try {
        const statusRes = await api.publishing.getStatus(schoolId)
        const data = (statusRes as any)?.data || statusRes
        const currentTag = data?.currentVersionTag || 'v1.0'
        const match = currentTag.match(/v?(\d+)\.(\d+)/)
        if (match) {
          nextTag = `v${parseInt(match[1], 10)}.${parseInt(match[2], 10) + 1}`
        }
      } catch {
        nextTag = `v1.${Date.now().toString().slice(-2)}`
      }

      await api.publishing.release(
        {
          versionTag: nextTag,
          summary: `Production release ${nextTag} published via studio topbar for ${schoolName}`,
        },
        schoolId,
      )

      await refreshSchools(schoolId)
      notify(`🚀 Version ${nextTag} of ${schoolName} is now live!`)
    } catch (err: any) {
      console.error('[Publish] Release failed:', err)
      const msg = err?.message || 'Publishing release failed'
      if (msg.includes('Unauthorized') || msg.includes('401') || msg.includes('expired')) {
        notify('⚠️ Your session has expired. Please sign in to publish.')
        setView('login')
      } else {
        notify(`⚠️ Failed to publish: ${msg}`)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <header className="topbar">
      <button type="button" className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar menu">
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
        <Button kind="ghost" icon="eye" onClick={() => window.open(`/${schoolSlug}`, '_blank')}>
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
          {notificationsOpen && <NotificationsPopover onClose={() => setNotificationsOpen(false)} />}
        </div>

        <button type="button" className="icon-button hide-mobile" aria-label="Help" onClick={() => setView('settings')}>
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
            <div style={{ textTransform: 'uppercase', fontWeight: 700 }}>{userInitials}</div>
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
          onClick={handleGlobalPublish}
          disabled={isPublishing}
          title={`Publish changes for ${currentSchool?.name || 'school'}`}
        >
          <span className="publish-label">{isPublishing ? 'Publishing...' : 'Publish'}</span>
        </Button>
      </div>
    </header>
  )
}
