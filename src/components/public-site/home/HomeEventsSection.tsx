'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface EventItem {
  id: string
  title: string
  venue?: string | null
  eventDate: string
}

interface HomeEventsSectionProps {
  eventsHeading: string
  schoolSlug?: string
  setPage?: (p: string) => void
  hasDbEvents: boolean
  publishedEvents: EventItem[]
  event1Date: string
  event1Title: string
  event1Venue: string
  event2Date: string
  event2Title: string
  event2Venue: string
}

function parseEventDateParts(raw: string): { day: string; month: string } {
  const trimmed = (raw || '').trim()
  const numMatch = trimmed.match(/\d+/)
  const strMatch = trimmed.match(/[A-Za-z]+/)
  if (numMatch && strMatch) {
    return {
      day: numMatch[0],
      month: strMatch[0].slice(0, 3).toUpperCase(),
    }
  }
  if (numMatch) {
    return { day: numMatch[0], month: 'NOV' }
  }
  return { day: trimmed || '15', month: '' }
}

export function HomeEventsSection({
  eventsHeading,
  schoolSlug,
  setPage,
  hasDbEvents,
  publishedEvents,
  event1Date,
  event1Title,
  event1Venue,
  event2Date,
  event2Title,
  event2Venue,
}: HomeEventsSectionProps) {
  const displayDbEvents = hasDbEvents ? publishedEvents.slice(0, 3) : []
  const itemCount = hasDbEvents ? displayDbEvents.length : 2

  return (
    <section className="home-events">
      <div className="section-heading">
        <div>
          <span className="section-kicker">SAVE THE DATE</span>
          <h2>{eventsHeading}</h2>
        </div>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/events`}>
            Full calendar <Icon name="arrow" size={14} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPage && setPage('Events')}
          >
            Full calendar <Icon name="arrow" size={14} />
          </button>
        )}
      </div>
      <div
        className={`grid gap-4 ${
          itemCount === 1
            ? 'grid-cols-1'
            : itemCount === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {hasDbEvents
          ? displayDbEvents.map((ev) => {
              const d = new Date(ev.eventDate)
              const day = d.getDate()
              const month = d
                .toLocaleDateString('en-US', { month: 'short' })
                .toUpperCase()
              const articleContent = (
                <article key={ev.id} style={{ cursor: 'pointer' }}>
                  <span>
                    <strong>{day}</strong>
                    <small>{month}</small>
                  </span>
                  <div>
                    <h3>{ev.title}</h3>
                    <p>{ev.venue || 'Main Campus'}</p>
                  </div>
                  <Icon name="arrow" />
                </article>
              )
              return schoolSlug ? (
                <Link
                  key={ev.id}
                  href={`/${schoolSlug}/events/${ev.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {articleContent}
                </Link>
              ) : (
                <div
                  key={ev.id}
                  onClick={() => setPage && setPage('Events')}
                >
                  {articleContent}
                </div>
              )
            })
          : [
              [event1Date, event1Title, event1Venue],
              [event2Date, event2Title, event2Venue],
            ].map((x) => {
              const parts = parseEventDateParts(x[0])
              return (
                <article key={x[1]}>
                  <span>
                    <strong>{parts.day}</strong>
                    {parts.month && <small>{parts.month}</small>}
                  </span>
                  <div>
                    <h3>{x[1]}</h3>
                    <p>{x[2]}</p>
                  </div>
                  <Icon name="arrow" />
                </article>
              )
            })}
      </div>
    </section>
  )
}
