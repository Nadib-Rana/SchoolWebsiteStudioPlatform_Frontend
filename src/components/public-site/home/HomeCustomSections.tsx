'use client'

interface CustomSectionItem {
  id?: string
  label?: string
  title?: string
  subtitle?: string
  type?: string
  items?: Array<{ title?: string; text?: string }>
  buttonText?: string
}

interface HomeCustomSectionsProps {
  customSections: any[]
  sectionStyles: Record<string, { bg?: string; align?: string }>
  setPage?: (p: string) => void
}

export function HomeCustomSections({
  customSections,
  sectionStyles,
  setPage,
}: HomeCustomSectionsProps) {
  return (
    <>
      {customSections.map((cs: any) => (
        <section
          key={cs.id || cs.label}
          style={{
            padding: '70px 10vw',
            background: sectionStyles[cs.label]?.bg || '#f8fafc',
            textAlign: (sectionStyles[cs.label]?.align as any) || 'left',
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <span
              className="section-kicker"
              style={{
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1.2px',
              }}
            >
              CUSTOM SECTION
            </span>
            <h2
              style={{
                fontSize: '28px',
                margin: '6px 0 12px',
                fontWeight: 700,
              }}
            >
              {cs.title}
            </h2>
            {cs.subtitle && (
              <p
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  marginBottom: '30px',
                  lineHeight: 1.6,
                }}
              >
                {cs.subtitle}
              </p>
            )}

            {cs.items && cs.items.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    cs.type === 'testimonials'
                      ? '1fr 1fr'
                      : cs.type === 'facilities'
                      ? 'repeat(3, 1fr)'
                      : '1fr',
                  gap: '16px',
                  marginTop: '16px',
                }}
              >
                {cs.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        color: '#0f172a',
                        marginBottom: '8px',
                      }}
                    >
                      {cs.type === 'faq' ? `Q: ${item.title}` : item.title}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#475569',
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
                <button
                  type="button"
                  style={{
                    background: '#e3ad3f',
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
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  )
}
