'use client'

import { Icon } from '@/components/common/Icon'
import type { CustomSectionData, SectionStyle } from './builder.types'
import { SectionStyleInspector } from './inspectors/SectionStyleInspector'
import { BuilderRightPanelContent } from './BuilderRightPanelContent'

interface BuilderRightPanelProps {
  showSettings: boolean
  setShowSettings: (s: boolean) => void
  selected: string
  activeTab: 'content' | 'style' | 'advanced'
  setActiveTab: (t: 'content' | 'style' | 'advanced') => void
  activeStyle: SectionStyle
  updateActiveStyle: (patch: Partial<SectionStyle>) => void
  customSectionsData: Record<string, CustomSectionData>
  setCustomSectionsData: React.Dispatch<React.SetStateAction<Record<string, CustomSectionData>>>
  onManageAlbumPhotos: () => void
  state: any
}

export function BuilderRightPanel({
  showSettings,
  setShowSettings,
  selected,
  activeTab,
  setActiveTab,
  activeStyle,
  updateActiveStyle,
  customSectionsData,
  setCustomSectionsData,
  onManageAlbumPhotos,
  state,
}: BuilderRightPanelProps) {
  if (!showSettings) return null

  return (
    <aside className="builder-right">
      <div className="settings-header">
        <div>
          <span>EDITING SECTION</span>
          <strong>{selected}</strong>
        </div>
        <button
          type="button"
          aria-label="Close settings"
          onClick={() => setShowSettings(false)}
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="settings-tabs">
        <button
          type="button"
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          type="button"
          className={activeTab === 'style' ? 'active' : ''}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          type="button"
          className={activeTab === 'advanced' ? 'active' : ''}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
      </div>

      {activeTab === 'content' && (
        <BuilderRightPanelContent
          selected={selected}
          customSectionsData={customSectionsData}
          setCustomSectionsData={setCustomSectionsData}
          onManageAlbumPhotos={onManageAlbumPhotos}
          state={state}
        />
      )}

      {(activeTab === 'style' || activeTab === 'advanced') && (
        <SectionStyleInspector
          activeTab={activeTab}
          activeStyle={activeStyle}
          updateActiveStyle={updateActiveStyle}
        />
      )}
    </aside>
  )
}
