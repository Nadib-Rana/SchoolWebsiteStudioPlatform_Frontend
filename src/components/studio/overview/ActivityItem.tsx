import { Icon } from '@/components/common/Icon'

export interface ActivityItemProps {
  initials: string
  title: string
  detail: string
  tone: string
}

export function ActivityItem({ initials, title, detail, tone }: ActivityItemProps) {
  return (
    <div className="activity">
      <div className={`activity-avatar ${tone}`}>{initials}</div>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <Icon name="more" />
    </div>
  )
}
