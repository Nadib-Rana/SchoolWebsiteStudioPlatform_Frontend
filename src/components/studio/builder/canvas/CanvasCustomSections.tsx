'use client'

import type { DeviceType } from '@/types/theme'
import { DEFAULT_STYLES, type CustomSectionData, type SectionItem, type SectionStyle } from '../builder.types'

interface CanvasCustomSectionsProps {
  sectionList: SectionItem[]
  customSectionsData: Record<string, CustomSectionData>
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  notify: (msg: string) => void
}

export function CanvasCustomSections({
  sectionList,
  customSectionsData,
  sectionStyles,
  selected,
  setSelected,
  device,
  notify,
}: CanvasCustomSectionsProps) {
  return (
    <>
      {sectionList
        .filter((s) => s.isCustom)
        .map((sec) => {
          const data = customSectionsData[sec.label]
          if (!data) return null
          const st = sectionStyles[sec.label] || DEFAULT_STYLES['School introduction']
          const isSelected = selected === sec.label
          const customSlug = sec.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

          return (
            <div
              key={sec.id}
              id={st.customId || `canvas-${customSlug}`}
              onClick={() => setSelected(sec.label)}
              className={st.customClass || ''}
              style={{
                padding:
                  st.padding === 'compact'
                    ? '20px 25px'
                    : st.padding === 'spacious'
                    ? '65px 30px'
                    : '40px 30px',
                background: st.bg,
                textAlign: st.align,
                cursor: 'pointer',
                position: 'relative',
                color: st.bg === '#163d72' || st.bg === '#091a30' ? '#ffffff' : '#0f172a',
                outline: isSelected ? '2px solid #2563eb' : 'none',
                outlineOffset: '-2px',
                display: st.hideOnMobile && device === 'mobile' ? 'none' : 'block',
                ...(st.border ? { borderTop: '2px solid #2563eb', borderBottom: '2px solid #2563eb' } : {}),
                ...(st.shadow === 'subtle'
                  ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
                  : st.shadow === 'card'
                  ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
                  : {}),
              }}
            >
              {isSelected && <div className="selection-label">{sec.label}</div>}

              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '22px', margin: '0 0 8px', fontWeight: 700 }}>
                  {data.title}
                </h3>
                {data.subtitle && (
                  <p
                    style={{
                      fontSize: '13px',
                      color: st.bg === '#163d72' || st.bg === '#091a30' ? '#cbd5e1' : '#64748b',
                      margin: '0 0 24px',
                      lineHeight: 1.6,
                    }}
                  >
                    {data.subtitle}
                  </p>
                )}

                {data.items && data.items.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        data.type === 'testimonials'
                          ? '1fr 1fr'
                          : data.type === 'facilities'
                          ? 'repeat(3, 1fr)'
                          : '1fr',
                      gap: '14px',
                      marginTop: '12px',
                    }}
                  >
                    {data.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: st.bg === '#ffffff' ? '#f8fafc' : 'rgba(255,255,255,0.08)',
                          border: st.bg === '#ffffff' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          textAlign: 'left',
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>
                          {data.type === 'faq' ? `Q: ${item.title}` : item.title}
                        </strong>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: st.bg === '#163d72' || st.bg === '#091a30' ? '#e2e8f0' : '#64748b',
                            lineHeight: 1.5,
                          }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {data.type === 'cta' && (
                  <div style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        notify(`Clicked CTA: ${data.buttonText || 'Action'}`)
                      }}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                      }}
                    >
                      {data.buttonText || 'Learn More'} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
    </>
  )
}
