import type { ReactNode } from 'react'

export interface StateBadgeProps {
  status: string
  children?: ReactNode
  className?: string
}

export function StateBadge({ status, children, className = '' }: StateBadgeProps) {
  const norm = status.toLowerCase()
  return (
    <span className={`state-badge ${norm} ${className}`}>
      <i />
      {children || status}
    </span>
  )
}
