'use client'

import { Icon } from '@/components/common/Icon'
import { manageNav, optimizeNav, workspaceNav } from '@/config/navigation'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'
import { useState, useRef, useEffect } from 'react'

export function StudioSidebar() {
  const {
    view,
    setView,
    sidebarOpen,
    setSidebarOpen,
    currentSchool,
    userSchools,
    switchSchool,
  } = useStudio()

  const [switcherOpen, setSwitcherOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navigate = (id: View) => {
    setView(id)
    setSidebarOpen(false)
    setSwitcherOpen(false)
  }

  // Close dropdown on outside click
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
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <Icon name="layers" size={20} />
        </div>
        <div>
          <strong>SchoolCanvas</strong>
          <small>Website Studio</small>
        </div>
        <button
          type="button"
          className="mobile-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <Icon name="close" />
        </button>
      </div>

      {/* School Switcher Trigger */}
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

        {/* Dropdown Menu */}
        {switcherOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: '12px',
              right: '12px',
              background: '#1a273f',
              border: '1px solid #2d3f5e',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
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
                  const isActive = school.id === currentSchool?.id
                  const sInitials =
                    school.name
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'SC'

                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => {
                        switchSchool(school.id)
                        setSwitcherOpen(false)
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
                        <div style={{ fontSize: '11px', color: '#64748b' }}>/{school.slug}</div>
                      </div>
                      {isActive && (
                        <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}>
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
                onClick={() => navigate('onboarding')}
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
        )}
      </div>

      <nav className="side-nav">
        <p className="nav-label">Workspace</p>
        {workspaceNav.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={view === id ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate(id)}
          >
            <Icon name={icon} />
            <span>{label}</span>
            {label === 'Templates' && <em>New</em>}
          </button>
        ))}

        <p className="nav-label">Manage</p>
        {manageNav.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={view === id ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate(id)}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}

        <p className="nav-label">Optimize</p>
        {optimizeNav.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={view === id ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate(id)}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-help">
        <div className="help-icon">
          <Icon name="help" />
        </div>
        <strong>Need a hand?</strong>
        <span>Visit our setup guide</span>
        <button type="button" onClick={() => navigate('settings')}>
          Open help center <Icon name="arrow" size={14} />
        </button>
      </div>
    </aside>
  )
}
