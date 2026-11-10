'use client'

import type { DeviceType } from '@/types/theme'
import type { SectionStyle } from '../builder.types'

interface CanvasNoticesProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  noticesHeading: string
  notice1Date: string
  notice1Title: string
  notice2Date: string
  notice2Title: string
}

export function CanvasNotices({
  sectionStyles,
  selected,
  setSelected,
  device,
  noticesHeading,
  notice1Date,
  notice1Title,
  notice2Date,
  notice2Title,
}: CanvasNoticesProps) {
  const noticesStyle = sectionStyles['Latest notices']

  return (
    <div
      id={noticesStyle?.customId || 'canvas-latest-notices'}
      onClick={() => setSelected('Latest notices')}
      className={noticesStyle?.customClass || ''}
      style={{
        padding:
          noticesStyle?.padding === 'compact'
            ? '16px 25px'
            : noticesStyle?.padding === 'spacious'
            ? '55px 30px'
            : '30px',
        background: noticesStyle?.bg || '#ffffff',
        textAlign: noticesStyle?.align || 'left',
        cursor: 'pointer',
        position: 'relative',
        display:
          noticesStyle?.hideOnMobile && device === 'mobile'
            ? 'none'
            : 'block',
        outline:
          selected === 'Latest notices' ? '2px solid #2563eb' : 'none',
        outlineOffset: '-2px',
        ...(noticesStyle?.border
          ? {
              borderTop: '2px solid #2563eb',
              borderBottom: '2px solid #2563eb',
            }
          : {}),
        ...(noticesStyle?.shadow === 'subtle'
          ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
          : noticesStyle?.shadow === 'card'
          ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      {selected === 'Latest notices' && (
        <div className="selection-label">Latest notices</div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <small
            style={{
              fontSize: '11px',
              color: '#2563eb',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            ACADEMIC NOTICES
          </small>
          <h3
            style={{
              margin: '4px 0 0',
              fontSize: '18px',
              color: '#0f172a',
            }}
          >
            {noticesHeading}
          </h3>
        </div>
        <span
          style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}
        >
          View all notices →
        </span>
      </div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {[
          { date: notice1Date, title: notice1Title },
          { date: notice2Date, title: notice2Title },
        ].map((n, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
              }}
            >
              {n.date}
            </div>
            <strong
              style={{ fontSize: '13px', color: '#1e293b', flex: 1 }}
            >
              {n.title}
            </strong>
            <span style={{ fontSize: '11px', color: '#64748b' }}>PDF</span>
          </div>
        ))}
      </div>
    </div>
  )
}
