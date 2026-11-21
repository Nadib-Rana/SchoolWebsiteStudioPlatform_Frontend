'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface HomeContactSectionProps {
  schoolName: string
  address: string
  schoolSlug?: string
  setPage?: (p: string) => void
}

export function HomeContactSection({
  schoolName,
  address,
  schoolSlug,
  setPage,
}: HomeContactSectionProps) {
  return (
    <section className="home-contact">
      <div>
        <span className="section-kicker">VISIT {schoolName.toUpperCase()}</span>
        <h2>Come and see learning in action.</h2>
        <p>{address}</p>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/contact`}>
            Plan your visit <Icon name="arrow" size={14} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPage && setPage('Contact Us')}
          >
            Plan your visit <Icon name="arrow" size={14} />
          </button>
        )}
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${schoolName} ${address}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="map-placeholder"
        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <Icon name="globe" size={30} />
        <strong>{schoolName}</strong>
        <span>Open in Google Maps →</span>
      </a>
    </section>
  )
}
