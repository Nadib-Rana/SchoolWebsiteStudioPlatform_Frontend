'use client'

interface HomePrincipalSectionProps {
  sectionStyle?: { bg?: string; padding?: string }
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
  const pad =
    sectionStyle?.padding === 'compact'
      ? '40px'
      : sectionStyle?.padding === 'spacious'
      ? '110px'
      : '75px'

  return (
    <section
      className="principal-home"
      style={{
        background: sectionStyle?.bg || undefined,
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      <div>
        <span className="section-kicker">A MESSAGE FROM OUR PRINCIPAL</span>
        <blockquote>{principalQuote}</blockquote>
        <strong
          style={{
            display: 'block',
            fontSize: '18px',
            color: '#0f172a',
            marginTop: '16px',
          }}
        >
          {principalName}
        </strong>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          {principalTitle}
        </span>
      </div>
      <aside>
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
