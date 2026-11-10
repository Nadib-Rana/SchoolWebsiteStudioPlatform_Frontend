'use client'

interface StatItem {
  value: string
  label: string
}

interface HomeStatsSectionProps {
  sectionStyle?: { bg?: string; padding?: string }
  statsList: StatItem[]
}

export function HomeStatsSection({ sectionStyle, statsList }: HomeStatsSectionProps) {
  const pad =
    sectionStyle?.padding === 'compact'
      ? '20px'
      : sectionStyle?.padding === 'spacious'
      ? '50px'
      : '32px'

  return (
    <section
      className="public-stats"
      style={{
        background: sectionStyle?.bg || undefined,
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      {statsList.slice(0, 4).map((stat, idx) => (
        <div key={idx}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  )
}
