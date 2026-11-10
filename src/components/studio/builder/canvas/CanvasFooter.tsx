'use client'

import type { DeviceType } from '@/types/theme'
import type { SectionStyle } from '../builder.types'

interface CanvasFooterProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  schoolName: string
  footerAddress: string
  footerPhone: string
  footerEmail: string
  footerCopyright: string
}

export function CanvasFooter({
  sectionStyles,
  selected,
  setSelected,
  device,
  schoolName,
  footerAddress,
  footerPhone,
  footerEmail,
  footerCopyright,
}: CanvasFooterProps) {
  const footerStyle = sectionStyles['Footer']

  return (
    <div
      id={footerStyle?.customId || 'canvas-footer'}
      onClick={() => setSelected('Footer')}
      className={footerStyle?.customClass || ''}
      style={{
        padding:
          footerStyle?.padding === 'compact'
            ? '18px 25px'
            : footerStyle?.padding === 'spacious'
            ? '60px 25px'
            : '30px 25px',
        background: footerStyle?.bg || '#091a30',
        color: '#d4deea',
        textAlign: footerStyle?.align || 'left',
        cursor: 'pointer',
        position: 'relative',
        display:
          footerStyle?.hideOnMobile && device === 'mobile' ? 'none' : 'block',
        outline: selected === 'Footer' ? '2px solid #2563eb' : 'none',
        outlineOffset: '-2px',
        ...(footerStyle?.border
          ? {
              borderTop: '2px solid #2563eb',
              borderBottom: '2px solid #2563eb',
            }
          : {}),
        ...(footerStyle?.shadow === 'subtle'
          ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
          : footerStyle?.shadow === 'card'
          ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      {selected === 'Footer' && (
        <div className="selection-label">Footer</div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: '18px',
          fontSize: '12px',
          marginBottom: '18px',
        }}
      >
        <div>
          <strong
            style={{
              display: 'block',
              fontSize: '14px',
              color: '#fff',
              marginBottom: '6px',
            }}
          >
            {schoolName}
          </strong>
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
            {footerAddress}
          </p>
        </div>
        <div>
          <strong
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#fff',
              marginBottom: '6px',
            }}
          >
            Contact
          </strong>
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
            📞 {footerPhone}
            <br />
            ✉️ {footerEmail}
          </p>
        </div>
        <div>
          <strong
            style={{
              display: 'block',
              fontSize: '13px',
              color: '#fff',
              marginBottom: '6px',
            }}
          >
            Admissions
          </strong>
          <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>
            Office hours: Mon – Fri
            <br />
            8:00 AM – 4:00 PM
          </p>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b',
        }}
      >
        <span>{footerCopyright}</span>
        <span>Powered by SchoolCanvas Studio</span>
      </div>
    </div>
  )
}
