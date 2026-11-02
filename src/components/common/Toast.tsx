import { Icon } from '@/components/common/Icon'

export interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="toast">
      <span className="toast-check">
        <Icon name="check" size={14} />
      </span>
      {message}
    </div>
  )
}
