'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { DeviceType } from '@/types/theme'

interface BuilderToolbarProps {
  device: DeviceType
  setDevice: (d: DeviceType) => void
  handleUndo: () => void
  handleRedo: () => void
  showSettings: boolean
  setShowSettings: (s: boolean) => void
  handlePreview: () => void
  handleSave: () => void
  isSaving: boolean
}

export function BuilderToolbar({
  device,
  setDevice,
  handleUndo,
  handleRedo,
  showSettings,
  setShowSettings,
  handlePreview,
  handleSave,
  isSaving,
}: BuilderToolbarProps) {
  return (
    <div className="builder-toolbar">
      <div className="builder-title">
        <span className="saved-dot" />
        <div>
          <strong>Homepage</strong>
          <small>All changes saved</small>
        </div>
      </div>

      <div className="device-switch">
        {(['monitor', 'tablet', 'mobile'] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={device === d ? 'active' : ''}
            onClick={() => setDevice(d)}
            aria-label={`${d} preview`}
          >
            <Icon name={d} />
          </button>
        ))}
      </div>

      <div className="builder-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="Undo last change"
          onClick={handleUndo}
        >
          <Icon name="undo" />
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Redo last change"
          onClick={handleRedo}
        >
          <Icon name="redo" />
        </button>
        <span />
        <Button
          kind={showSettings ? 'primary' : 'secondary'}
          onClick={() => setShowSettings(!showSettings)}
        >
          <Icon name="layout" size={15} />
          {showSettings ? 'Hide panel' : 'Edit section'}
        </Button>
        <Button kind="secondary" onClick={handlePreview}>
          <Icon name="eye" size={15} />
          Preview
        </Button>
        <Button kind="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save draft'}
        </Button>
      </div>
    </div>
  )
}
