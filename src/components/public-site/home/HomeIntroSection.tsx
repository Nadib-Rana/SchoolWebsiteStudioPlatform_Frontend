'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage } from '@/config/templates'

interface HomeIntroSectionProps {
  sectionStyle?: {
    bg?: string
    padding?: string
    textColor?: string
    align?: string
    photoPosition?: 'left' | 'right'
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    isHidden?: boolean
    customId?: string
    customClass?: string
  }
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
  if (sectionStyle?.isHidden) {
    return null
  }

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
      id={sectionStyle?.customId || undefined}
      className={`public-intro ${sectionStyle?.hideOnMobile ? 'hidden sm:grid' : ''} ${sectionStyle?.customClass || ''}`}
      style={{
        background: sectionStyle?.bg || undefined,
        color: sectionStyle?.textColor || undefined,
        paddingTop: pad,
        paddingBottom: pad,
        ...(sectionStyle?.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
        ...(sectionStyle?.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : sectionStyle?.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
      }}
    >
      <div
        className="intro-image"
        style={{ order: sectionStyle?.photoPosition === 'right' ? 2 : 1 }}
      >
        <img src={resolvedImage} alt={`${schoolName} campus`} />
        <span>
          <strong>{resolvedBadgeTitle}</strong>
          <small>{resolvedBadgeSubtitle}</small>
        </span>
      </div>
      <div
        style={{
          textAlign: (sectionStyle?.align as any) || 'left',
          order: sectionStyle?.photoPosition === 'right' ? 1 : 2,
        }}
      >
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
