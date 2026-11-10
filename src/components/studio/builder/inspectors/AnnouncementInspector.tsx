'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface AnnouncementInspectorProps {
  showAnnouncement: boolean
  setShowAnnouncement: (s: boolean) => void
  announcementText: string
  setAnnouncementText: (s: string) => void
  announcementLink: string
  setAnnouncementLink: (s: string) => void
}

export function AnnouncementInspector({
  showAnnouncement,
  setShowAnnouncement,
  announcementText,
  setAnnouncementText,
  announcementLink,
  setAnnouncementLink,
}: AnnouncementInspectorProps) {
  return (
    <SettingGroup title="Announcement settings">
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={showAnnouncement}
          onChange={(e) => setShowAnnouncement(e.target.checked)}
          style={{ width: 'auto', margin: 0 }}
        />
        <span>Show announcement banner on top</span>
      </label>
      <label>
        Banner message
        <input
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
        />
      </label>
      <label>
        Action link text
        <input
          value={announcementLink}
          onChange={(e) => setAnnouncementLink(e.target.value)}
        />
      </label>
    </SettingGroup>
  )
}
