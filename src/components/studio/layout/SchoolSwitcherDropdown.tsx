'use client'

import { useState, useRef, useEffect } from 'react'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'
import { SchoolSwitcherMenu } from './SchoolSwitcherMenu'

interface SchoolSwitcherDropdownProps {
  onNavigate: (id: View) => void
}

export function SchoolSwitcherDropdown({ onNavigate }: SchoolSwitcherDropdownProps) {
  const { currentSchool, userSchools, switchSchool } = useStudio()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    if (switcherOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [switcherOpen])

  const schoolName = currentSchool?.name || 'School Studio'
  const initials = schoolName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SC'

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        className="school-switcher"
        onClick={() => setSwitcherOpen(!switcherOpen)}
        aria-expanded={switcherOpen}
        aria-label={`Switch school workspace, currently ${schoolName}`}
        style={{ cursor: 'pointer', width: 'calc(100% - 24px)' }}
      >
        <div className="school-avatar" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden', textAlign: 'left', flex: 1 }}>
          <strong
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {schoolName}
          </strong>
          <small style={{ fontSize: '11px', display: 'block' }}>
            {currentSchool?.plan ? `${currentSchool.plan} · ` : ''}
            {currentSchool?.isPublished ? '● Live' : '○ Draft'}
          </small>
        </div>
        <span
          style={{
            display: 'inline-flex',
            transform: switcherOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <Icon name="chevron" size={14} />
        </span>
      </button>

      {switcherOpen && (
        <SchoolSwitcherMenu
          userSchools={userSchools}
          currentSchoolId={currentSchool?.id}
          onSwitchSchool={switchSchool}
          onNavigate={onNavigate}
          onClose={() => setSwitcherOpen(false)}
        />
      )}
    </div>
  )
}
