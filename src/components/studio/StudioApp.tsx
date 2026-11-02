'use client'

import { PublicSite } from '@/components/public-site/PublicSite'
import { Login } from '@/components/studio/auth/Login'
import { Builder } from '@/components/studio/builder/Builder'
import { DesignSystem } from '@/components/studio/design-system/DesignSystem'
import { StudioShell } from '@/components/studio/layout/StudioShell'
import { ManagementScreen } from '@/components/studio/management/ManagementScreen'
import { Onboarding } from '@/components/studio/onboarding/Onboarding'
import { Overview } from '@/components/studio/overview/Overview'
import { Templates } from '@/components/studio/templates/Templates'
import { ThemeCustomization } from '@/components/studio/theme/ThemeCustomization'
import { useStudio } from '@/context/StudioContext'

export function StudioApp() {
  const { view } = useStudio()

  if (view === 'public') {
    return <PublicSite />
  }

  if (view === 'login') {
    return <Login />
  }

  if (view === 'onboarding') {
    return <Onboarding />
  }

  return (
    <StudioShell>
      {view === 'overview' && <Overview />}
      {view === 'templates' && <Templates />}
      {view === 'builder' && <Builder />}
      {view === 'theme' && <ThemeCustomization />}
      {view === 'design-system' && <DesignSystem />}
      {![
        'overview',
        'templates',
        'builder',
        'theme',
        'design-system',
        'public',
        'login',
        'onboarding',
      ].includes(view) && <ManagementScreen view={view} />}
    </StudioShell>
  )
}
