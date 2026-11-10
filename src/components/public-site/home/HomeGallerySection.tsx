'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface HomeGallerySectionProps {
  schoolName: string
  galleryHeading: string
  gallerySub: string
  schoolSlug?: string
  setPage?: (p: string) => void
  galleryPhoto1: string
  galleryPhoto2: string
}

export function HomeGallerySection({
  schoolName,
  galleryHeading,
  gallerySub,
  schoolSlug,
  setPage,
  galleryPhoto1,
  galleryPhoto2,
}: HomeGallerySectionProps) {
  return (
    <section className="home-gallery">
      <div className="gallery-copy">
        <span className="section-kicker">LIFE AT {schoolName.toUpperCase()}</span>
        <h2>{galleryHeading}</h2>
        <p>{gallerySub}</p>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/gallery`}>
            Explore our gallery <Icon name="arrow" size={14} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPage && setPage('Photo Gallery')}
          >
            Explore our gallery <Icon name="arrow" size={14} />
          </button>
        )}
      </div>
      <img
        src={galleryPhoto1}
        alt={`Students around ${schoolName} campus`}
      />
      <img
        src={galleryPhoto2}
        alt={`${schoolName} learning commons`}
      />
    </section>
  )
}
