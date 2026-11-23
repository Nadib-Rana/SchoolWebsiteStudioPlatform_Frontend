'use client'

import Link from 'next/link'

interface HomeCustomSectionsProps {
  customSections: any[]
  sectionStyles: Record<
    string,
    {
      bg?: string
      textColor?: string
      align?: string
      padding?: string
      border?: boolean
      shadow?: string
      hideOnMobile?: boolean
      isHidden?: boolean
      customId?: string
      customClass?: string
    }
  >
  schoolSlug?: string
  setPage?: (p: string) => void
}

export function HomeCustomSections({
  customSections,
  sectionStyles,
  schoolSlug,
  setPage,
}: HomeCustomSectionsProps) {
  return (
    <>
      {customSections.map((cs: any) => {
        const st = sectionStyles[cs.label] || {}
        if (st.isHidden) return null
        const pad =
          st.padding === 'compact'
            ? '40px 8vw'
            : st.padding === 'spacious'
            ? '110px 8vw'
            : '70px 8vw'
        const isDarkBg = st.bg === '#163d72' || st.bg === '#091a30'
        const headingColor = st.textColor || (isDarkBg ? '#ffffff' : '#0f172a')
        const subColor = st.textColor || (isDarkBg ? '#cbd5e1' : '#64748b')
        const rawLink = cs.buttonLink || '/admissions'
        const resolvedHref =
          rawLink.startsWith('http://') || rawLink.startsWith('https://')
            ? rawLink
            : schoolSlug
            ? `/${schoolSlug}${rawLink.startsWith('/') ? rawLink : '/' + rawLink}`
            : rawLink

        return (
          <section
            key={cs.id || cs.label}
            id={st.customId || undefined}
            className={`${st.hideOnMobile ? 'hidden sm:block' : ''} ${st.customClass || ''}`}
            style={{
              padding: pad,
              background: st.bg || '#f8fafc',
              color: headingColor,
              textAlign: (st.align as any) || 'left',
              ...(st.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
              ...(st.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : st.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
            }}
          >
            <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
              <span
                className="section-kicker"
                style={{
                  color: isDarkBg ? '#facc15' : 'var(--accent, #2563eb)',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1.2px',
                }}
              >
                {String(cs.label || cs.type || 'HIGHLIGHT').toUpperCase()}
              </span>
              <h2
                style={{
                  fontSize: '30px',
                  margin: '8px 0 12px',
                  fontWeight: 700,
                  color: headingColor,
                }}
              >
                {cs.title}
              </h2>
              {cs.subtitle && (
                <p
                  style={{
                    fontSize: '15px',
                    color: subColor,
                    marginBottom: '30px',
                    lineHeight: 1.6,
                  }}
                >
                  {cs.subtitle}
                </p>
              )}

              {cs.items && cs.items.length > 0 && (
                <div
                  className={`grid gap-4 mt-4 ${
                    cs.type === 'testimonials'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : cs.type === 'facilities'
                      ? 'grid-cols-1 md:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {cs.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: isDarkBg ? 'rgba(255,255,255,0.08)' : '#ffffff',
                        borderRadius: '10px',
                        padding: '22px',
                        border: isDarkBg ? '1px solid rgba(255,255,255,0.16)' : '1px solid #e2e8f0',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        textAlign: 'left',
                      }}
                    >
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '15px',
                          color: isDarkBg ? '#ffffff' : '#0f172a',
                          marginBottom: '8px',
                        }}
                      >
                        {cs.type === 'faq' ? `Q: ${item.title}` : item.title}
                      </strong>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: isDarkBg ? '#e2e8f0' : '#475569',
                          lineHeight: 1.6,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {cs.buttonText && (
                <div style={{ marginTop: '28px' }}>
                  {schoolSlug ? (
                    <Link
                      href={resolvedHref}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--accent, #e3ad3f)',
                        color: '#0f172a',
                        textDecoration: 'none',
                        fontWeight: 700,
                        padding: '12px 28px',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      {cs.buttonText} →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      style={{
                        background: 'var(--accent, #e3ad3f)',
                        color: '#0f172a',
                        border: 'none',
                        fontWeight: 700,
                        padding: '12px 28px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      onClick={() => setPage && setPage('Admission Information')}
                    >
                      {cs.buttonText} →
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}
