'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'

export interface NotificationsPopoverProps {
  onClose: () => void
}

export function NotificationsPopover({ onClose }: NotificationsPopoverProps) {
  const { unreadNotifications, setUnreadNotifications, notify, setView } = useStudio()

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
          <strong>Notifications</strong>
          <span>{unreadNotifications} unread updates</span>
        </div>
        <button type="button" onClick={markAllRead}>
          Mark all read
        </button>
      </div>

      <div className="notification-list">
        <button
          type="button"
          className="unread"
          onClick={() => handleItemClick('inquiries')}
        >
          <span className="notice-symbol sync">
            <Icon name="help" size={15} />
          </span>
          <div>
            <strong>New contact inquiry received</strong>
            <p>A prospective family inquired about admissions and campus tour.</p>
            <small>Just now</small>
          </div>
          <i />
        </button>

        <button
          type="button"
          className="unread"
          onClick={() => handleItemClick('publishing')}
        >
          <span className="notice-symbol publish">
            <Icon name="sparkle" size={15} />
          </span>
          <div>
            <strong>Draft is ready to publish</strong>
            <p>Five approved changes are waiting in version 2.8.</p>
            <small>12 minutes ago</small>
          </div>
          <i />
        </button>

        <button
          type="button"
          className="unread"
          onClick={() => handleItemClick('integrations')}
        >
          <span className="notice-symbol sync">
            <Icon name="plug" size={15} />
          </span>
          <div>
            <strong>ERP sync completed</strong>
            <p>36 records synchronized. Three need your review.</p>
            <small>28 minutes ago</small>
          </div>
          <i />
        </button>

        <button
          type="button"
          className="unread"
          onClick={() => handleItemClick('domains')}
        >
          <span className="notice-symbol domain">
            <Icon name="globe" size={15} />
          </span>
          <div>
            <strong>Domain verification complete</strong>
            <p>www.northfield.edu is active and secure.</p>
            <small>2 hours ago</small>
          </div>
          <i />
        </button>

        <button
          type="button"
          onClick={() => {
            onClose()
            setView('analytics')
          }}
        >
          <span className="notice-symbol report">
            <Icon name="chart" size={15} />
          </span>
          <div>
            <strong>Weekly report is available</strong>
            <p>Website visits increased by 18.4% this week.</p>
            <small>Yesterday</small>
          </div>
        </button>
      </div>

      <div className="popover-foot">
        <button
          type="button"
          onClick={() => {
            onClose()
            setView('overview')
          }}
        >
          View notification center <Icon name="arrow" size={13} />
        </button>
      </div>
    </div>
  )
}
