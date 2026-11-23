'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface NoticeItem {
  id: string
  title: string
  category?: string
  publishDate: string
  slug?: string | null
}

interface HomeNoticesSectionProps {
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
  noticesHeading: string
  schoolSlug?: string
  setPage?: (p: string) => void
  hasDbNotices: boolean
  publishedNotices: NoticeItem[]
  notice1Date: string
  notice1Title: string
  notice2Date: string
  notice2Title: string
}

export function HomeNoticesSection({
  sectionStyle,
  noticesHeading,
  schoolSlug,
  setPage,
  hasDbNotices,
  publishedNotices,
  notice1Date,
  notice1Title,
  notice2Date,
  notice2Title,
}: HomeNoticesSectionProps) {
  if (sectionStyle?.isHidden) {
    return null
  }

  const pad =
    sectionStyle?.padding === 'compact'
      ? '45px'
      : sectionStyle?.padding === 'spacious'
      ? '120px'
      : undefined
  const customBg =
    sectionStyle?.bg && sectionStyle.bg !== '#ffffff' ? sectionStyle.bg : undefined

  return (
    <section
      id={sectionStyle?.customId || undefined}
      className={`home-news ${sectionStyle?.hideOnMobile ? 'hidden sm:grid' : ''} ${sectionStyle?.customClass || ''}`}
      style={{
        background: customBg,
        color: sectionStyle?.textColor || undefined,
        textAlign: (sectionStyle?.align as any) || undefined,
        paddingTop: pad,
        paddingBottom: pad,
        ...(sectionStyle?.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
        ...(sectionStyle?.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : sectionStyle?.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
      }}
    >
      <div>
        <span className="section-kicker">LATEST UPDATES</span>
        <h2 style={{ color: sectionStyle?.textColor || undefined }}>{noticesHeading}</h2>
        <p style={{ color: sectionStyle?.textColor || undefined }}>
          Stay connected with important announcements and circulars across our community.
        </p>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/notices`}>
            View all notices <Icon name="arrow" size={14} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPage && setPage('Notices')}
          >
            View all notices <Icon name="arrow" size={14} />
          </button>
        )}
      </div>
      <div>
        {hasDbNotices
          ? publishedNotices.slice(0, 3).map((n) => {
              const formattedDate = new Date(n.publishDate).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                },
              )
              const articleContent = (
                <article key={n.id} style={{ cursor: 'pointer' }}>
                  <span>{formattedDate}</span>
                  <div>
                    <small>{n.category?.toUpperCase() || 'ANNOUNCEMENT'}</small>
                    <h3>{n.title}</h3>
                  </div>
                  <Icon name="arrow" />
                </article>
              )
              return schoolSlug ? (
                <Link
                  key={n.id}
                  href={`/${schoolSlug}/notices/${n.slug || n.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {articleContent}
                </Link>
              ) : (
                <div
                  key={n.id}
                  onClick={() => setPage && setPage('Notices')}
                >
                  {articleContent}
                </div>
              )
            })
          : [
              [notice1Date, notice1Title, 'ACADEMIC'],
              [notice2Date, notice2Title, 'CIRCULAR'],
            ].map((x) => (
              <article key={x[1]}>
                <span>{x[0]}</span>
                <div>
                  <small>{x[2]}</small>
                  <h3>{x[1]}</h3>
                </div>
                <Icon name="arrow" />
              </article>
            ))}
      </div>
    </section>
  )
}
