'use client'

interface HomePrincipalSectionProps {
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
  principalQuote: string
  principalName: string
  principalTitle: string
  principalPhoto: string
}

export function HomePrincipalSection({
  sectionStyle,
  principalQuote,
  principalName,
  principalTitle,
  principalPhoto,
}: HomePrincipalSectionProps) {
  if (sectionStyle?.isHidden) {
    return null
  }

  const pad =
    sectionStyle?.padding === 'compact'
      ? '40px'
      : sectionStyle?.padding === 'spacious'
      ? '110px'
      : '75px'
  const photoLeft = sectionStyle?.photoPosition === 'left'

  return (
    <section
      id={sectionStyle?.customId || undefined}
      className={`principal-home ${sectionStyle?.hideOnMobile ? 'hidden sm:grid' : ''} ${sectionStyle?.customClass || ''}`}
      style={{
        background: sectionStyle?.bg || undefined,
        color: sectionStyle?.textColor || undefined,
        paddingTop: pad,
        paddingBottom: pad,
        ...(sectionStyle?.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
        ...(sectionStyle?.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : sectionStyle?.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
      }}
    >
      <div style={{ textAlign: (sectionStyle?.align as any) || 'left', order: photoLeft ? 2 : 1 }}>
        <span className="section-kicker">A MESSAGE FROM OUR PRINCIPAL</span>
        <blockquote style={{ color: sectionStyle?.textColor || undefined }}>{principalQuote}</blockquote>
        <strong
          style={{
            display: 'block',
            fontSize: '18px',
            color: sectionStyle?.textColor || '#0f172a',
            marginTop: '16px',
          }}
        >
          {principalName}
        </strong>
        <span style={{ fontSize: '13px', color: sectionStyle?.textColor || '#64748b' }}>
          {principalTitle}
        </span>
      </div>
      <aside style={{ order: photoLeft ? 1 : 2 }}>
        <img
          src={principalPhoto}
          alt={principalName}
          style={{
            width: '180px',
            height: '220px',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            margin: '0 auto',
          }}
        />
      </aside>
    </section>
  )
}
