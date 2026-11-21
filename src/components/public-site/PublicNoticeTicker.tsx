'use client'

import Link from 'next/link'
import type { NoticeData } from '@/lib/public-site-types'

interface PublicNoticeTickerProps {
  schoolSlug: string
  notices: NoticeData[]
}

export function PublicNoticeTicker({
  schoolSlug,
  notices,
}: PublicNoticeTickerProps) {
  if (!notices || notices.length === 0) return null

  const sorted = [...notices]
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return (
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      )
    })
    .slice(0, 8)

  const durationSec = Math.max(22, sorted.length * 7)

  return (
    <div
      className="public-notice-ticker print:hidden"
      style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        height: '40px',
        fontSize: '13px',
      }}
    >
      <Link
        href={`/${schoolSlug}/notices`}
        style={{
          background: 'var(--navy, #102f58)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0 14px',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          textDecoration: 'none',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '999px',
            background: 'var(--accent, #e3ad3f)',
            display: 'inline-block',
          }}
        />
        Latest Notices
      </Link>

      <div
        className="notice-ticker-viewport"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="notice-ticker-track"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '32px',
            whiteSpace: 'nowrap',
            paddingLeft: '100%',
            animation: `notice-marquee ${durationSec}s linear infinite`,
          }}
        >
          {sorted.map((notice) => (
            <Link
              key={notice.id}
              href={`/${schoolSlug}/notices/${notice.id}`}
              style={{
                color: '#1e293b',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {notice.isPinned && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    background: '#fef3c7',
                    color: '#92400e',
                  }}
                >
                  Pinned
                </span>
              )}
              <span>{notice.title}</span>
              <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '12px' }}>
                ({new Date(notice.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})
              </span>
              <span style={{ color: '#cbd5e1', marginLeft: '12px' }}>•</span>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href={`/${schoolSlug}/downloads`}
        className="hidden sm:inline-flex"
        style={{
          padding: '0 14px',
          height: '100%',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--navy, #102f58)',
          borderLeft: '1px solid #e2e8f0',
          background: '#ffffff',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        Downloads →
      </Link>
    </div>
  )
}

