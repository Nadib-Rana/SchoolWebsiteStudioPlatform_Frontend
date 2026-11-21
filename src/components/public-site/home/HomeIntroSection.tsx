'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage } from '@/config/templates'

interface HomeIntroSectionProps {
  sectionStyle?: { bg?: string; padding?: string; textColor?: string; align?: string }
  schoolName: string
  establishedYear: number | string
  introKicker: string
  introTitle: string
  introDesc: string
  introImage?: string
  introQuote?: string
  introBadgeTitle?: string
  introBadgeSubtitle?: string
  schoolSlug?: string
  setPage?: (p: string) => void
}

export function HomeIntroSection({
  sectionStyle,
  schoolName,
  establishedYear,
  introKicker,
  introTitle,
  introDesc,
  introImage,
  introQuote,
  introBadgeTitle,
  introBadgeSubtitle,
  schoolSlug,
  setPage,
}: HomeIntroSectionProps) {
  const pad =
    sectionStyle?.padding === 'compact'
      ? '40px'
      : sectionStyle?.padding === 'spacious'
      ? '100px'
      : '70px'
  const resolvedImage = introImage || campusImage
  const resolvedQuote =
    introQuote ||
    '“Every child deserves to be truly known, deeply supported, and meaningfully challenged.”'
  const resolvedBadgeTitle = introBadgeTitle?.trim() || `Since ${establishedYear}`
  const resolvedBadgeSubtitle = introBadgeSubtitle?.trim() || 'Growing together'

  return (
    <section
      className="public-intro"
      style={{
        background: sectionStyle?.bg || undefined,
        color: sectionStyle?.textColor || undefined,
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      <div className="intro-image">
        <img src={resolvedImage} alt={`${schoolName} campus`} />
        <span>
          <strong>{resolvedBadgeTitle}</strong>
          <small>{resolvedBadgeSubtitle}</small>
        </span>
      </div>
      <div style={{ textAlign: (sectionStyle?.align as any) || 'left' }}>
        <span className="section-kicker">{introKicker}</span>
        <h2 style={{ whiteSpace: 'pre-line', color: sectionStyle?.textColor || undefined }}>{introTitle}</h2>
        <p style={{ color: sectionStyle?.textColor || undefined }}>{introDesc}</p>
        <blockquote style={{ color: sectionStyle?.textColor || undefined }}>{resolvedQuote}</blockquote>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/about`} className="read-link">
            Discover our story <Icon name="arrow" size={15} />
          </Link>
        ) : (
          <button
            type="button"
            className="read-link"
            onClick={() => setPage && setPage('About School')}
          >
            Discover our story <Icon name="arrow" size={15} />
          </button>
        )}
      </div>
    </section>
  )
}
