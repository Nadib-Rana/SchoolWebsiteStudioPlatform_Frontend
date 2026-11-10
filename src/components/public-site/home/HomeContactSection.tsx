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
      <div className="map-placeholder">
        <Icon name="globe" size={30} />
        <strong>{schoolName}</strong>
        <span>Interactive map location</span>
      </div>
    </section>
  )
}
