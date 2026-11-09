'use client'

import { Button } from '@/components/common/Button'
import { Academics } from '@/components/studio/academics/Academics'
import { AdmissionsManager } from '@/components/studio/admissions/AdmissionsManager'
import { Analytics } from '@/components/studio/analytics/Analytics'
import { ContentManager } from '@/components/studio/content/ContentManager'
import { DataManager } from '@/components/studio/data-manager/DataManager'
import { EditorModal } from '@/components/studio/data-manager/EditorModal'
import { DomainManager } from '@/components/studio/domains/DomainManager'
import { Gallery } from '@/components/studio/gallery/Gallery'
import { Integrations } from '@/components/studio/integrations/Integrations'
import { MediaLibrary } from '@/components/studio/media/MediaLibrary'
import { NavigationManager } from '@/components/studio/navigation/NavigationManager'
import { Publishing } from '@/components/studio/publishing/Publishing'
import { SEOManager } from '@/components/studio/seo/SEOManager'
import { Settings } from '@/components/studio/settings/Settings'
import { screenMeta } from '@/constants/screen-meta'
import { useStudio } from '@/context/StudioContext'
import type { View } from '@/types/studio'
import { useState } from 'react'

export interface ManagementScreenProps {
  view: View
}

export function ManagementScreen({ view }: ManagementScreenProps) {
  const { notify, setView } = useStudio()
  const meta = screenMeta[view] || screenMeta.pages
  const [modal, setModal] = useState(false)
  const [navAddModal, setNavAddModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const doAction = () => {
    if (view === 'navigation') {
      setNavAddModal(true)
    } else if (['pages', 'teachers', 'notices', 'events', 'gallery', 'media'].includes(view)) {
      setModal(true)
    } else {
      notify(
        view === 'publishing'
          ? 'Website version published successfully'
          : 'Changes saved successfully'
      )
    }
  }

  return (
    <div className="page-content management-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        <div className="heading-actions">
          {view === 'publishing' && (
            <Button icon="eye" onClick={() => setView('public')}>
              Preview draft
            </Button>
          )}
          {!['analytics', 'integrations'].includes(view) && (
            <Button
              kind="primary"
              icon={meta.action?.includes('Save') ? 'check' : 'plus'}
              onClick={doAction}
            >
              {meta.action}
            </Button>
          )}
        </div>
      </div>

      {['pages', 'teachers', 'notices', 'events'].includes(view) && (
        <DataManager type={view} refreshKey={refreshKey} />
      )}
      {view === 'content' && <ContentManager />}
      {view === 'academics' && <Academics />}
      {view === 'admissions' && <AdmissionsManager />}
      {view === 'gallery' && <Gallery />}
      {view === 'navigation' && (
        <NavigationManager
          openAddModal={navAddModal}
          onCloseAddModal={() => setNavAddModal(false)}
        />
      )}
      {view === 'media' && <MediaLibrary />}
      {view === 'seo' && <SEOManager />}
      {view === 'domains' && <DomainManager />}
      {view === 'integrations' && <Integrations />}
      {view === 'analytics' && <Analytics />}
      {view === 'settings' && <Settings />}
      {view === 'publishing' && <Publishing />}

      {modal && (
        <EditorModal
          type={view}
          close={() => setModal(false)}
          save={() => {
            setModal(false)
            setRefreshKey((k) => k + 1)
            notify(
              `New ${view === 'media' ? 'asset' : view.slice(0, -1)} saved successfully`
            )
          }}
        />
      )}
    </div>
  )
}
