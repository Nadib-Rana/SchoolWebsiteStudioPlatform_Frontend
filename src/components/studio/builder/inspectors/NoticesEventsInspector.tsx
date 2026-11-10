'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface NoticesEventsInspectorProps {
  selected: string
  noticesHeading: string
  setNoticesHeading: (s: string) => void
  notice1Date: string
  setNotice1Date: (s: string) => void
  notice1Title: string
  setNotice1Title: (s: string) => void
  notice2Date: string
  setNotice2Date: (s: string) => void
  notice2Title: string
  setNotice2Title: (s: string) => void
  eventsHeading: string
  setEventsHeading: (s: string) => void
  event1Date: string
  setEvent1Date: (s: string) => void
  event1Venue: string
  setEvent1Venue: (s: string) => void
  event1Title: string
  setEvent1Title: (s: string) => void
  event2Date: string
  setEvent2Date: (s: string) => void
  event2Venue: string
  setEvent2Venue: (s: string) => void
  event2Title: string
  setEvent2Title: (s: string) => void
}

export function NoticesEventsInspector({
  selected,
  noticesHeading,
  setNoticesHeading,
  notice1Date,
  setNotice1Date,
  notice1Title,
  setNotice1Title,
  notice2Date,
  setNotice2Date,
  notice2Title,
  setNotice2Title,
  eventsHeading,
  setEventsHeading,
  event1Date,
  setEvent1Date,
  event1Venue,
  setEvent1Venue,
  event1Title,
  setEvent1Title,
  event2Date,
  setEvent2Date,
  event2Venue,
  setEvent2Venue,
  event2Title,
  setEvent2Title,
}: NoticesEventsInspectorProps) {
  if (selected === 'Latest notices') {
    return (
      <SettingGroup title="Notices section">
        <label>
          Section heading
          <input
            value={noticesHeading}
            onChange={(e) => setNoticesHeading(e.target.value)}
          />
        </label>
        <label>
          Notice 1 (Date / Title)
          <input
            value={notice1Date}
            onChange={(e) => setNotice1Date(e.target.value)}
            placeholder="Date"
            style={{ marginBottom: '6px' }}
          />
          <input
            value={notice1Title}
            onChange={(e) => setNotice1Title(e.target.value)}
            placeholder="Notice title"
          />
        </label>
        <label>
          Notice 2 (Date / Title)
          <input
            value={notice2Date}
            onChange={(e) => setNotice2Date(e.target.value)}
            placeholder="Date"
            style={{ marginBottom: '6px' }}
          />
          <input
            value={notice2Title}
            onChange={(e) => setNotice2Title(e.target.value)}
            placeholder="Notice title"
          />
        </label>
      </SettingGroup>
    )
  }

  return (
    <SettingGroup title="Events calendar">
      <label>
        Section title
        <input
          value={eventsHeading}
          onChange={(e) => setEventsHeading(e.target.value)}
        />
      </label>
      <label>
        Event 1 (Date badge / Title / Venue)
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input
            value={event1Date}
            onChange={(e) => setEvent1Date(e.target.value)}
            style={{ width: '30%' }}
            placeholder="Date"
          />
          <input
            value={event1Venue}
            onChange={(e) => setEvent1Venue(e.target.value)}
            style={{ width: '70%' }}
            placeholder="Venue"
          />
        </div>
        <input
          value={event1Title}
          onChange={(e) => setEvent1Title(e.target.value)}
          placeholder="Event title"
        />
      </label>

      <label>
        Event 2 (Date badge / Title / Venue)
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input
            value={event2Date}
            onChange={(e) => setEvent2Date(e.target.value)}
            style={{ width: '30%' }}
            placeholder="Date"
          />
          <input
            value={event2Venue}
            onChange={(e) => setEvent2Venue(e.target.value)}
            style={{ width: '70%' }}
            placeholder="Venue"
          />
        </div>
        <input
          value={event2Title}
          onChange={(e) => setEvent2Title(e.target.value)}
          placeholder="Event title"
        />
      </label>
    </SettingGroup>
  )
}
