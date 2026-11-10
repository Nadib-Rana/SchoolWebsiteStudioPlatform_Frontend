'use client'

import { THEME_CONFIGS } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'
import { BuilderToolbar } from './BuilderToolbar'
import { BuilderLeftSidebar } from './BuilderLeftSidebar'
import { BuilderCanvas } from './BuilderCanvas'
import { BuilderRightPanel } from './BuilderRightPanel'
import { AddSectionModal } from './AddSectionModal'
import { useBuilderState } from './useBuilderState'

export function Builder() {
  const {
    device,
    setDevice,
    selected,
    setSelected,
    isSaving,
    showSettings,
    setShowSettings,
    activeTab,
    setActiveTab,
    leftPanelTab,
    setLeftPanelTab,
    sectionList,
    showAddModal,
    setShowAddModal,
    customSectionsData,
    setCustomSectionsData,
    sectionStyles,
    activeStyle,
    updateActiveStyle,
    handleUndo,
    handleRedo,
    handleSelectSection,
    handleAddSection,
    handleDeleteSection,
    handleSave,
    handlePreview,
    notify,
    setView,
    state,
  } = useBuilderState()

  return (
    <div className="builder">
      <BuilderToolbar
        device={device}
        setDevice={setDevice}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        handlePreview={handlePreview}
        handleSave={handleSave}
        isSaving={isSaving}
        templateName={THEME_CONFIGS[state.appliedTheme as SchoolTheme]?.templateName}
      />

      <div className="builder-body">
        <BuilderLeftSidebar
          leftPanelTab={leftPanelTab}
          setLeftPanelTab={setLeftPanelTab}
          sectionList={sectionList}
          selected={selected}
          showAnnouncement={state.showAnnouncement}
          onSelectSection={handleSelectSection}
          onDeleteSection={handleDeleteSection}
          onOpenAddModal={() => setShowAddModal(true)}
          onAddSection={handleAddSection}
        />

        <BuilderCanvas
          device={device}
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          sectionList={sectionList}
          customSectionsData={customSectionsData}
          notify={notify}
          state={state}
        />

        <BuilderRightPanel
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          selected={selected}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStyle={activeStyle}
          updateActiveStyle={updateActiveStyle}
          customSectionsData={customSectionsData}
          setCustomSectionsData={setCustomSectionsData}
          onManageAlbumPhotos={() => setView('gallery')}
          state={state}
        />
      </div>

      {showAddModal && (
        <AddSectionModal
          onClose={() => setShowAddModal(false)}
          onAddSection={handleAddSection}
        />
      )}
    </div>
  )
}
