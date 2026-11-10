'use client'

import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import type { DeviceType } from '@/types/theme'
import type { ThemeConfig } from '@/config/themes'
import type { SectionStyle } from '../builder.types'

interface CanvasHeroStatsProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  overlayOpacity: number
  heroBg: string | null
  eyebrow: string
  heading: string
  description: string
  buttonLabel: string
  buttonLink: string
  notify: (msg: string) => void
  stat1Val: string
  stat1Label: string
  stat2Val: string
  stat2Label: string
  stat3Val: string
  stat3Label: string
  stat4Val: string
  stat4Label: string
  activeCfg?: ThemeConfig
}

export function CanvasHeroStats({
  sectionStyles,
  selected,
  setSelected,
  device,
  overlayOpacity,
  heroBg,
  eyebrow,
  heading,
  description,
  buttonLabel,
  buttonLink,
  notify,
  stat1Val,
  stat1Label,
  stat2Val,
  stat2Label,
  stat3Val,
  stat3Label,
  stat4Val,
  stat4Label,
  activeCfg,
}: CanvasHeroStatsProps) {
  const heroStyle = sectionStyles['Hero section']
  const statsStyle = sectionStyles['Statistics']
  const heroPad =
    heroStyle?.padding === 'compact'
      ? '35px'
      : heroStyle?.padding === 'spacious'
      ? '95px'
      : '60px'
  const statsPad =
    statsStyle?.padding === 'compact'
      ? '14px'
      : statsStyle?.padding === 'spacious'
      ? '45px'
      : '26px'

  return (
    <>
      <div
        id={heroStyle?.customId || 'canvas-hero-section'}
        onClick={() => setSelected('Hero section')}
        className={`mini-hero ${selected === 'Hero section' ? 'selected' : ''} ${heroStyle?.customClass || ''}`}
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(9,27,53,${overlayOpacity / 100}),rgba(9,27,53,${(overlayOpacity / 100) * 0.25})),url(${heroBg || heroImage})`,
          textAlign: (heroStyle?.align as any) || 'left',
          paddingTop: heroPad,
          paddingBottom: heroPad,
          display:
            heroStyle?.hideOnMobile && device === 'mobile'
              ? 'none'
              : 'flex',
          cursor: 'pointer',
          position: 'relative',
          outline: selected === 'Hero section' ? '2px solid #2563eb' : 'none',
          outlineOffset: '-2px',
          ...(heroStyle?.border ? { borderBottom: '2px solid #2563eb' } : {}),
          ...(heroStyle?.shadow === 'subtle'
            ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
            : heroStyle?.shadow === 'card'
            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
            : {}),
        }}
      >
        {selected === 'Hero section' && (
          <div className="selection-label">Hero section</div>
        )}
        <div>
          <small style={{ color: activeCfg?.secondaryColor || '#f4cc70', fontWeight: 700 }}>
            {eyebrow}
          </small>
          <h2 style={{ fontFamily: activeCfg?.fontHeading }}>
            {heading.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < heading.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p>{description}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelected('Hero section')
              notify(`Hero button action: "${buttonLabel}" (links to ${buttonLink || '/admissions'})`)
            }}
            style={{
              cursor: 'pointer',
              background: activeCfg?.secondaryColor || '#e7b84e',
              color: '#ffffff',
            }}
          >
            {buttonLabel} <Icon name="arrow" size={13} />
          </button>
        </div>
      </div>

      <div
        id={statsStyle?.customId || 'canvas-statistics'}
        onClick={() => setSelected('Statistics')}
        className={`mini-stats ${selected === 'Statistics' ? 'selected' : ''} ${statsStyle?.customClass || ''}`}
        style={{
          cursor: 'pointer',
          position: 'relative',
          background: statsStyle?.bg || activeCfg?.primaryColor || '#163d72',
          textAlign: (statsStyle?.align as any) || 'center',
          paddingTop: statsPad,
          paddingBottom: statsPad,
          display:
            statsStyle?.hideOnMobile && device === 'mobile'
              ? 'none'
              : 'grid',
          outline: selected === 'Statistics' ? '2px solid #2563eb' : 'none',
          outlineOffset: '-2px',
          ...(statsStyle?.border
            ? {
                borderTop: '2px solid #2563eb',
                borderBottom: '2px solid #2563eb',
              }
            : {}),
          ...(statsStyle?.shadow === 'subtle'
            ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
            : statsStyle?.shadow === 'card'
            ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
            : {}),
        }}
      >
        {selected === 'Statistics' && (
          <div className="selection-label">Statistics</div>
        )}
        <div>
          <strong style={{ fontFamily: activeCfg?.fontHeading }}>{stat1Val}</strong>
          <span>{stat1Label}</span>
        </div>
        <div>
          <strong style={{ fontFamily: activeCfg?.fontHeading }}>{stat2Val}</strong>
          <span>{stat2Label}</span>
        </div>
        <div>
          <strong style={{ fontFamily: activeCfg?.fontHeading }}>{stat3Val}</strong>
          <span>{stat3Label}</span>
        </div>
        <div>
          <strong style={{ fontFamily: activeCfg?.fontHeading }}>{stat4Val}</strong>
          <span>{stat4Label}</span>
        </div>
      </div>
    </>
  )
}
