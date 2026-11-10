'use client'

import { Icon } from '@/components/common/Icon'
import type { View } from '@/types/studio'

interface SidebarHelpBoxProps {
  onNavigate: (id: View) => void
}

export function SidebarHelpBox({ onNavigate }: SidebarHelpBoxProps) {
  return (
    <div className="sidebar-help">
      <div className="help-icon">
        <Icon name="help" />
      </div>
      <strong>Need a hand?</strong>
      <span>Visit our setup guide</span>
      <button type="button" onClick={() => onNavigate('settings')}>
        Open help center <Icon name="arrow" size={14} />
      </button>
    </div>
  )
}
