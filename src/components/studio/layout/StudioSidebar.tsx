'use client'

import { Icon } from '@/components/common/Icon'
import { manageNav, optimizeNav, workspaceNav } from '@/config/navigation'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'
import { SchoolSwitcherDropdown } from './SchoolSwitcherDropdown'
import { SidebarHelpBox } from './SidebarHelpBox'

export function StudioSidebar() {
  const {
    view,
    setView,
    sidebarOpen,
    setSidebarOpen,
  } = useStudio()

  const navigate = (id: View) => {
    setView(id)
    setSidebarOpen(false)
  }

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

      <SchoolSwitcherDropdown onNavigate={navigate} />

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

      <SidebarHelpBox onNavigate={navigate} />
    </aside>
  )
}
