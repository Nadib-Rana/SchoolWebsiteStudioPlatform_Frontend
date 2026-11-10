'use client'

import { Icon } from '@/components/common/Icon'
import type { CurrentSchool } from '@/context/studio-context-types'
import type { View } from '@/types/studio'

interface SchoolSwitcherMenuProps {
  userSchools: CurrentSchool[]
  currentSchoolId?: string
  onSwitchSchool: (id: string) => void
  onNavigate: (id: View) => void
  onClose: () => void
}

export function SchoolSwitcherMenu({
  userSchools,
  currentSchoolId,
  onSwitchSchool,
  onNavigate,
  onClose,
}: SchoolSwitcherMenuProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: '12px',
        right: '12px',
        background: '#1a273f',
        border: '1px solid #2d3f5e',
        borderRadius: '8px',
        boxShadow:
          '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        zIndex: 100,
        padding: '6px',
        color: '#f8fafc',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#94a3b8',
          padding: '6px 8px 4px',
        }}
      >
        Your Schools ({userSchools.length})
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {userSchools.length === 0 ? (
          <div style={{ padding: '8px', fontSize: '12px', color: '#94a3b8' }}>
            No schools found.
          </div>
        ) : (
          userSchools.map((school) => {
            const isActive = school.id === currentSchoolId
            const sInitials =
              school.name
                .split(/\s+/)
                .map((w: string) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'SC'

            return (
              <button
                key={school.id}
                type="button"
                onClick={() => {
                  onSwitchSchool(school.id)
                  onClose()
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? '#2563eb22' : 'transparent',
                  color: isActive ? '#60a5fa' : '#e2e8f0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  transition: 'background 0.15s',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: isActive ? '#2563eb' : '#334155',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {sInitials}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {school.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    /{school.slug}
                  </div>
                </div>
                {isActive && (
                  <span
                    style={{
                      color: '#38bdf8',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid #2d3f5e',
          marginTop: '4px',
          paddingTop: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate('onboarding')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <Icon name="plus" size={14} />
          <span>Register New School</span>
        </button>
      </div>
    </div>
  )
}
