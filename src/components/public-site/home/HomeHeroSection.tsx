'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface HomeHeroSectionProps {
  heroOverlay: number
  currentHeroImage: string
  sectionStyle?: { align?: string; padding?: string }
  motto: string
  heroHeading: string
  heroDesc: string
  schoolSlug?: string
  heroBtnLink: string
  heroBtnLabel: string
  setPage?: (p: string) => void
  schoolName: string
  establishedYear: number | string
}

export function HomeHeroSection({
  heroOverlay,
  currentHeroImage,
  sectionStyle,
  motto,
  heroHeading,
  heroDesc,
  schoolSlug,
  heroBtnLink,
  heroBtnLabel,
  setPage,
  schoolName,
  establishedYear,
}: HomeHeroSectionProps) {
  const pad =
    sectionStyle?.padding === 'compact'
      ? '60px'
      : sectionStyle?.padding === 'spacious'
      ? '140px'
      : '100px'

  return (
    <section
      className="public-hero"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(7,24,48,${heroOverlay / 100}),rgba(7,24,48,${(heroOverlay / 100) * 0.25})),url(${currentHeroImage})`,
        textAlign: (sectionStyle?.align as any) || 'left',
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      <div>
        <span className="public-eyebrow">{motto}</span>
        <h1 style={{ whiteSpace: 'pre-line' }}>{heroHeading}</h1>
        <p>{heroDesc}</p>
        <div>
          {schoolSlug ? (
            <Link
              href={`/${schoolSlug}${heroBtnLink.startsWith('/') ? heroBtnLink : '/' + heroBtnLink}`}
              className="hero-primary"
            >
              {heroBtnLabel} <Icon name="arrow" size={16} />
            </Link>
          ) : (
            <button
              type="button"
              className="hero-primary"
              onClick={() => setPage && setPage('About School')}
            >
              {heroBtnLabel} <Icon name="arrow" size={16} />
            </button>
          )}

          {schoolSlug ? (
            <Link href={`/${schoolSlug}/admissions`} className="hero-secondary">
              Apply for admission
            </Link>
          ) : (
            <button
              type="button"
              className="hero-secondary"
              onClick={() => setPage && setPage('Admission Information')}
            >
              Apply for admission
            </button>
          )}
        </div>
      </div>
      <span className="hero-caption">
        {schoolName} · {establishedYear}
      </span>
    </section>
  )
}
