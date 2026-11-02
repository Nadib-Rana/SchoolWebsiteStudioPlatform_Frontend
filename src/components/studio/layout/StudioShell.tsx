'use client'

import { Toast } from '@/components/common/Toast'
import { StudioSidebar } from '@/components/studio/layout/StudioSidebar'
import { StudioTopbar } from '@/components/studio/layout/StudioTopbar'
import { useStudio } from '@/context/StudioContext'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'

export function StudioShell({ children }: { children: ReactNode }) {
  const { view, setView, sidebarOpen, setSidebarOpen, toast } = useStudio()

  const isPublicOrAuth = ['public', 'login'].includes(view)

  const handleContainerClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const button = (event.target as HTMLElement).closest('button')
    if (!button || button.disabled) return

    // If button has toggle class, toggle it
    if (button.classList.contains('toggle')) {
      button.classList.toggle('on')
    }

    // Tab buttons active states
    if (
      button.closest(
        '.panel-tabs,.settings-tabs,.sub-tabs,.settings-nav,.system-index,.analytics-filter'
      )
    ) {
      button.parentElement
        ?.querySelectorAll('button')
        .forEach((item) => item.classList.remove('active'))
      button.classList.add('active')
    }

    const label = (
      button.getAttribute('aria-label') ||
      button.getAttribute('title') ||
      button.textContent ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim()

    if (label.toLowerCase() === 'preview' && view !== 'public') {
      setView('public')
    }
  }

  return (
    <div className="app-shell" onClickCapture={handleContainerClick}>
      {!isPublicOrAuth && <StudioSidebar />}
      {sidebarOpen && !isPublicOrAuth && (
        <div
          className="sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <main className={isPublicOrAuth ? 'public-main' : 'studio-main'}>
        {!isPublicOrAuth && <StudioTopbar />}
        {children}
      </main>
      <Toast message={toast} />
    </div>
  )
}
