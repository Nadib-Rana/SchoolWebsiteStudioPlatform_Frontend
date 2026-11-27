'use client'

import { isDarkColor } from '../header-helpers'

interface StatItem {
  value: string
  label: string
}

interface HomeStatsSectionProps {
  sectionStyle?: {
    bg?: string
    padding?: string
    textColor?: string
    hideOnMobile?: boolean
    isHidden?: boolean
    border?: boolean
    shadow?: string
    align?: string
    customClass?: string
    customId?: string
  }
  statsList: StatItem[]
}

export function HomeStatsSection({ sectionStyle, statsList }: HomeStatsSectionProps) {
  if (sectionStyle?.isHidden) {
    return null
  }

  const pad =
    sectionStyle?.padding === 'compact'
      ? '20px'
      : sectionStyle?.padding === 'spacious'
      ? '50px'
      : '32px'

  const isHiddenMobile = Boolean(sectionStyle?.hideOnMobile)
  const customBg = sectionStyle?.bg?.trim() || ''
  const isHexBg = customBg.startsWith('#')
  const valueColor =
    sectionStyle?.textColor ||
    (isHexBg ? (isDarkColor(customBg) ? '#ffffff' : '#0f172a') : undefined)
  const labelColor =
    sectionStyle?.textColor ||
    (isHexBg ? (isDarkColor(customBg) ? '#cbd5e1' : '#475569') : undefined)

  return (
    <section
      id={sectionStyle?.customId || 'section-statistics'}
      className={`public-stats ${isHiddenMobile ? 'hidden sm:grid' : ''} ${sectionStyle?.customClass || ''}`}
      style={{
        background: customBg || undefined,
        color: valueColor,
        textAlign: (sectionStyle?.align as any) || undefined,
        paddingTop: pad,
        paddingBottom: pad,
        ...(sectionStyle?.border ? { borderTop: '2px solid rgba(255,255,255,0.2)', borderBottom: '2px solid rgba(255,255,255,0.2)' } : {}),
        ...(sectionStyle?.shadow === 'subtle' ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' } : sectionStyle?.shadow === 'card' ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' } : {}),
      }}
    >
      {statsList.slice(0, 4).map((stat, idx) => (
        <div key={idx}>
          <strong style={{ color: valueColor }}>{stat.value}</strong>
          <span style={{ color: labelColor }}>{stat.label}</span>
        </div>
      ))}
    </section>
  )
}
