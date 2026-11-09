'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { IconName } from '@/types/studio'

export interface MetricCardProps {
  label: string
  value: string
  change?: string
  detail?: string
  icon: IconName
  tone: string
}

export function MetricCard({
  label,
  value,
  change,
  detail,
  icon,
  tone,
}: MetricCardProps) {
  const { setView } = useStudio()

  const handleNavigate = () => {
    const l = label.toLowerCase()
    if (l.includes('visitor') || l.includes('view')) {
      setView('analytics')
    } else if (l.includes('page')) {
      setView('pages')
    } else if (l.includes('event')) {
      setView('events')
    } else {
      setView('analytics')
    }
  }

  return (
    <div
      className="card metric cursor-pointer hover:border-slate-300 transition-colors"
      onClick={handleNavigate}
      title={`Click to view details for ${label}`}
    >
      <div className={`metric-icon ${tone}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <div>
          {change && <span className="positive">{change}</span>}
          <small>{detail || ' from last month'}</small>
        </div>
      </div>
      <button
        type="button"
        aria-label={`View details for ${label}`}
        onClick={(e) => {
          e.stopPropagation()
          handleNavigate()
        }}
      >
        <Icon name="more" />
      </button>
    </div>
  )
}
