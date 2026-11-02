import { Icon } from '@/components/common/Icon'
import type { IconName } from '@/types/studio'

export interface QuickActionProps {
  icon: IconName
  label: string
  tone: string
  onClick?: () => void
}

export function QuickAction({ icon, label, tone, onClick }: QuickActionProps) {
  return (
    <button type="button" className="quick-action" onClick={onClick}>
      <span className={tone}>
        <Icon name={icon} />
      </span>
      <strong>{label}</strong>
      <Icon name="chevron" size={14} />
    </button>
  )
}
