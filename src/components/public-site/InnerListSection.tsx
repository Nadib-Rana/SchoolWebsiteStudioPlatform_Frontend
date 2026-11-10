'use client'

import { Icon } from '@/components/common/Icon'

interface InnerListSectionProps {
  page: string
  onSelectDetail: (detailPage: string) => void
}

export function InnerListSection({ page, onSelectDetail }: InnerListSectionProps) {
  const items = [
    [
      'Summer schedule and office hours',
      '12 MAY 2025',
      'Essential dates and office arrangements for the summer period.',
    ],
    [
      'Science Fair registration',
      '10 MAY 2025',
      'Registration details, eligibility, and participant guidance.',
    ],
    [
      'Parent–teacher meetings',
      '08 MAY 2025',
      'Booking information for this term’s family conferences.',
    ],
    [
      'Annual sports day',
      '02 MAY 2025',
      'Schedule, house information, and visitor guidance.',
    ],
  ]

  return (
    <section className="public-list">
      {items.map((x) => (
        <article key={x[0]}>
          <span>{x[1]}</span>
          <div>
            <small>{page === 'Events' ? 'SCHOOL EVENT' : 'GENERAL UPDATE'}</small>
            <h2>{x[0]}</h2>
            <p>{x[2]}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onSelectDetail(page === 'Events' ? 'Event Details' : 'Notice Details')
            }
            aria-label={`View ${x[0]}`}
          >
            <Icon name="arrow" />
          </button>
        </article>
      ))}
    </section>
  )
}
