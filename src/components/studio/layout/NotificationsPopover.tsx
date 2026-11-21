'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'

export interface NotificationsPopoverProps {
  onClose: () => void
}

export function NotificationsPopover({ onClose }: NotificationsPopoverProps) {
  const { unreadNotifications, setUnreadNotifications, notify, setView, currentSchool } = useStudio()

  const schoolName = currentSchool?.name || 'Your school'
  const domainLabel = currentSchool?.customDomain || `/${currentSchool?.slug || 'school'}`
  const isLive = currentSchool?.isPublished ?? true

  const handleItemClick = (targetView: View) => {
    setUnreadNotifications(Math.max(0, unreadNotifications - 1))
    onClose()
    setView(targetView)
  }

  const markAllRead = () => {
    setUnreadNotifications(0)
    notify('All notifications marked as read')
  }

  return (
    <div className="topbar-popover notification-panel">
      <div className="popover-head">
        <div>
          <strong>Workspace Alerts</strong>
          <span>{unreadNotifications > 0 ? `${unreadNotifications} unread` : 'All caught up'}</span>
        </div>
        {unreadNotifications > 0 && (
          <button type="button" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-list">
        <button
          type="button"
          onClick={() => handleItemClick('admissions')}
        >
          <span className="notice-symbol sync">
            <Icon name="check" size={15} />
          </span>
          <div>
            <strong>Admissions Registry</strong>
            <p>Review online applications and ERP sync status for {schoolName}.</p>
            <small>Open Admissions</small>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('inquiries')}
        >
          <span className="notice-symbol sync">
            <Icon name="help" size={15} />
          </span>
          <div>
            <strong>Contact Inquiries Inbox</strong>
            <p>Check recent messages submitted from your public Contact page.</p>
            <small>Open Inbox</small>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('publishing')}
        >
          <span className="notice-symbol publish">
            <Icon name="sparkle" size={15} />
          </span>
          <div>
            <strong>Website Status: {isLive ? 'Live' : 'Draft'}</strong>
            <p>{domainLabel} — review staged drafts or version history.</p>
            <small>Open Publishing</small>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('integrations')}
        >
          <span className="notice-symbol domain">
            <Icon name="plug" size={15} />
          </span>
          <div>
            <strong>School ERP & Webhooks</strong>
            <p>Manage live admission sync, classes, teachers, and alumni verify.</p>
            <small>Open Integrations</small>
          </div>
        </button>
      </div>

      <div className="popover-foot">
        <button
          type="button"
          onClick={() => {
            onClose()
            setView('audit-logs')
          }}
        >
          View activity audit logs <Icon name="arrow" size={13} />
        </button>
      </div>
    </div>
  )
}
