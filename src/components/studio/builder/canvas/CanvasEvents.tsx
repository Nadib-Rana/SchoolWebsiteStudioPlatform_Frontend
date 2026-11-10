'use client'

import type { DeviceType } from '@/types/theme'
import type { SectionStyle } from '../builder.types'

interface CanvasEventsProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  eventsHeading: string
  event1Date: string
  event1Venue: string
  event1Title: string
  event2Date: string
  event2Venue: string
  event2Title: string
}

export function CanvasEvents({
  sectionStyles,
  selected,
  setSelected,
  device,
  eventsHeading,
  event1Date,
  event1Venue,
  event1Title,
  event2Date,
  event2Venue,
  event2Title,
}: CanvasEventsProps) {
  const eventsStyle = sectionStyles['Upcoming events']

  return (
    <div
      id={eventsStyle?.customId || 'canvas-upcoming-events'}
      onClick={() => setSelected('Upcoming events')}
      className={eventsStyle?.customClass || ''}
      style={{
        padding:
          eventsStyle?.padding === 'compact'
            ? '16px 25px'
            : eventsStyle?.padding === 'spacious'
            ? '55px 30px'
            : '30px',
        background: eventsStyle?.bg || '#f1f5f9',
        textAlign: eventsStyle?.align || 'left',
        cursor: 'pointer',
        position: 'relative',
        display:
          eventsStyle?.hideOnMobile && device === 'mobile'
            ? 'none'
            : 'block',
        outline:
          selected === 'Upcoming events' ? '2px solid #2563eb' : 'none',
        outlineOffset: '-2px',
        ...(eventsStyle?.border
          ? {
              borderTop: '2px solid #2563eb',
              borderBottom: '2px solid #2563eb',
            }
          : {}),
        ...(eventsStyle?.shadow === 'subtle'
          ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
          : eventsStyle?.shadow === 'card'
          ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      {selected === 'Upcoming events' && (
        <div className="selection-label">Upcoming events</div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <small
            style={{
              fontSize: '11px',
              color: '#d97706',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            CAMPUS HAPPENINGS
          </small>
          <h3
            style={{
              margin: '4px 0 0',
              fontSize: '18px',
              color: '#0f172a',
            }}
          >
            {eventsHeading}
          </h3>
        </div>
        <span
          style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}
        >
          Full calendar →
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
        }}
      >
        {[
          { date: event1Date, title: event1Title, venue: event1Venue },
          { date: event2Date, title: event2Title, venue: event2Venue },
        ].map((ev, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '45px',
                height: '45px',
                background: '#fef3c7',
                color: '#b45309',
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '12px',
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              {ev.date}
            </div>
            <div>
              <strong
                style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#0f172a',
                }}
              >
                {ev.title}
              </strong>
              <small style={{ color: '#64748b', fontSize: '11px' }}>
                📍 {ev.venue}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
