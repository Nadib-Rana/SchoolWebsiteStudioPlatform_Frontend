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
      <div>
        {hasDbEvents
          ? publishedEvents.slice(0, 2).map((ev) => {
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
              [event1Date, 'NOV', event1Title, event1Venue],
              [event2Date, 'NOV', event2Title, event2Venue],
            ].map((x) => (
              <article key={x[2]}>
                <span>
                  <strong>{x[0]}</strong>
                  <small>{x[1]}</small>
                </span>
                <div>
                  <h3>{x[2]}</h3>
                  <p>{x[3]}</p>
                </div>
                <Icon name="arrow" />
              </article>
            ))}
      </div>
    </section>
  )
}
