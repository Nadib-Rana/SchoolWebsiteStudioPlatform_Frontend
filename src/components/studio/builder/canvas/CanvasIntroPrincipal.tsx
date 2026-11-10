'use client'

import type { DeviceType } from '@/types/theme'
import type { SectionStyle } from '../builder.types'

interface CanvasIntroPrincipalProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  introKicker: string
  introTitle: string
  introDesc: string
  principalPhoto: string
  principalName: string
  principalQuote: string
  principalTitle: string
}

export function CanvasIntroPrincipal({
  sectionStyles,
  selected,
  setSelected,
  device,
  introKicker,
  introTitle,
  introDesc,
  principalPhoto,
  principalName,
  principalQuote,
  principalTitle,
}: CanvasIntroPrincipalProps) {
  const introStyle = sectionStyles['School introduction']
  const principalStyle = sectionStyles['Principal message']

  return (
    <>
      {/* 5. School Introduction */}
      <div
        id={introStyle?.customId || 'canvas-school-introduction'}
        onClick={() => setSelected('School introduction')}
        className={`mini-intro ${selected === 'School introduction' ? 'selected' : ''} ${introStyle?.customClass || ''}`}
        style={{
          cursor: 'pointer',
          position: 'relative',
          background: introStyle?.bg || '#ffffff',
          textAlign: introStyle?.align || 'center',
          paddingTop:
            introStyle?.padding === 'compact'
              ? '18px'
              : introStyle?.padding === 'spacious'
              ? '65px'
              : '36px',
          paddingBottom:
            introStyle?.padding === 'compact'
              ? '18px'
              : introStyle?.padding === 'spacious'
              ? '65px'
              : '36px',
          display:
            introStyle?.hideOnMobile && device === 'mobile' ? 'none' : 'block',
          outline:
            selected === 'School introduction' ? '2px solid #2563eb' : 'none',
          outlineOffset: '-2px',
          ...(introStyle?.border
            ? {
                borderTop: '2px solid #2563eb',
                borderBottom: '2px solid #2563eb',
              }
            : {}),
          ...(introStyle?.shadow === 'subtle'
            ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
            : introStyle?.shadow === 'card'
            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
            : {}),
        }}
      >
        {selected === 'School introduction' && (
          <div className="selection-label">School introduction</div>
        )}
        <small>{introKicker}</small>
        <h3>
          {introTitle.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < introTitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h3>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {introDesc}
        </p>
      </div>

      {/* 6. Principal Message */}
      <div
        id={principalStyle?.customId || 'canvas-principal-message'}
        onClick={() => setSelected('Principal message')}
        className={principalStyle?.customClass || ''}
        style={{
          padding:
            principalStyle?.padding === 'compact'
              ? '16px 25px'
              : principalStyle?.padding === 'spacious'
              ? '55px 30px'
              : '30px',
          background: principalStyle?.bg || '#f8fafc',
          textAlign: principalStyle?.align || 'left',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          display:
            principalStyle?.hideOnMobile && device === 'mobile'
              ? 'none'
              : 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '24px',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          outline:
            selected === 'Principal message' ? '2px solid #2563eb' : 'none',
          outlineOffset: '-2px',
          ...(principalStyle?.border
            ? {
                borderTop: '2px solid #2563eb',
                borderBottom: '2px solid #2563eb',
              }
            : {}),
          ...(principalStyle?.shadow === 'subtle'
            ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
            : principalStyle?.shadow === 'card'
            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
            : {}),
        }}
      >
        {selected === 'Principal message' && (
          <div className="selection-label">Principal message</div>
        )}
        <img
          src={principalPhoto}
          alt={principalName}
          style={{
            width: '120px',
            height: '135px',
            objectFit: 'cover',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(15,23,42,0.1)',
          }}
        />
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              color: '#b45309',
              textTransform: 'uppercase',
            }}
          >
            Principal&apos;s Message
          </span>
          <p
            style={{
              fontFamily: 'serif',
              fontSize: '15px',
              fontStyle: 'italic',
              color: '#334155',
              margin: '8px 0 12px',
              lineHeight: 1.5,
            }}
          >
            {principalQuote}
          </p>
          <strong
            style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}
          >
            {principalName}
          </strong>
          <small style={{ color: '#64748b', fontSize: '12px' }}>
            {principalTitle}
          </small>
        </div>
      </div>
    </>
  )
}
