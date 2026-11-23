'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface HomeGallerySectionProps {
  sectionStyle?: {
    bg?: string
    padding?: string
    textColor?: string
    align?: string
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    isHidden?: boolean
    customId?: string
    customClass?: string
  }
  schoolName: string
  galleryHeading: string
  gallerySub: string
  schoolSlug?: string
  setPage?: (p: string) => void
  galleryPhoto1: string
  galleryPhoto2: string
}

export function HomeGallerySection({
  sectionStyle,
  schoolName,
  galleryHeading,
  gallerySub,
  schoolSlug,
  setPage,
  galleryPhoto1,
  galleryPhoto2,
}: HomeGallerySectionProps) {
  if (sectionStyle?.isHidden) {
    return null
  }

  const customBg =
    sectionStyle?.bg && sectionStyle.bg !== '#ffffff' ? sectionStyle.bg : undefined

  return (
    <section
      id={sectionStyle?.customId || undefined}
      className={`home-gallery ${sectionStyle?.hideOnMobile ? 'hidden sm:grid' : ''} ${sectionStyle?.customClass || ''}`}
      style={{
        background: customBg,
        color: sectionStyle?.textColor || undefined,
        ...(sectionStyle?.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
        ...(sectionStyle?.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : sectionStyle?.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
      }}
    >
      <div
        className="gallery-copy"
        style={{ textAlign: (sectionStyle?.align as any) || undefined }}
      >
        <span className="section-kicker">LIFE AT {schoolName.toUpperCase()}</span>
        <h2 style={{ color: sectionStyle?.textColor || undefined }}>{galleryHeading}</h2>
        <p style={{ color: sectionStyle?.textColor || undefined }}>{gallerySub}</p>
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
