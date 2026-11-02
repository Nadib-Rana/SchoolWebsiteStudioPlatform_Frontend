import { Icon } from '@/components/common/Icon'
import type { IconName } from '@/types/studio'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface StudioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  kind?: 'primary' | 'secondary' | 'ghost' | 'dark'
  icon?: IconName
  className?: string
}

export function Button({
  children,
  kind = 'secondary',
  icon,
  onClick,
  className = '',
  type = 'button',
  disabled,
  ...props
}: StudioButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`button button-${kind} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  )
}
