import { Icon } from '@/components/common/Icon'
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
  return (
    <div className="card metric">
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
      <button type="button" aria-label={`Options for ${label}`}>
        <Icon name="more" />
      </button>
    </div>
  )
}
