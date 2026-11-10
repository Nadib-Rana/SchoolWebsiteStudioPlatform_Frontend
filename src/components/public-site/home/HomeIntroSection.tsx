'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage } from '@/config/templates'

interface HomeIntroSectionProps {
  sectionStyle?: { bg?: string; padding?: string }
  schoolName: string
  establishedYear: number | string
  introKicker: string
  introTitle: string
  introDesc: string
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
  schoolSlug,
  setPage,
}: HomeIntroSectionProps) {
  const pad =
    sectionStyle?.padding === 'compact'
      ? '40px'
      : sectionStyle?.padding === 'spacious'
      ? '100px'
      : '70px'

  return (
    <section
      className="public-intro"
      style={{
        background: sectionStyle?.bg || undefined,
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      <div className="intro-image">
        <img src={campusImage} alt={`${schoolName} campus`} />
        <span>
          <strong>Since {establishedYear}</strong>
          <small>Growing together</small>
        </span>
      </div>
      <div>
        <span className="section-kicker">{introKicker}</span>
        <h2 style={{ whiteSpace: 'pre-line' }}>{introTitle}</h2>
        <p>{introDesc}</p>
        <blockquote>
          “Every child deserves to be truly known, deeply supported, and meaningfully challenged.”
        </blockquote>
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
