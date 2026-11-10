'use client'

import { Button } from '@/components/common/Button'
import { publicPages } from '@/config/navigation'
import { themeLabels, THEME_CONFIGS } from '@/config/themes'
import { useStudio } from '@/context/StudioContext'
import { applyTemplateToBuilder } from '@/components/studio/templates/template-apply-helper'
import type { SchoolTheme } from '@/types/theme'

export interface PublicPreviewBarProps {
  page: string
  setPage: (p: string) => void
  theme: SchoolTheme
  setTheme: (t: SchoolTheme) => void
}

export function PublicPreviewBar({
  page,
  setPage,
  theme,
  setTheme,
}: PublicPreviewBarProps) {
  const { setView, notify, setPreviewTheme } = useStudio()

  const handleApplyCurrentTheme = async () => {
    setPreviewTheme(theme)
    const appliedName = await applyTemplateToBuilder(theme)
    notify(`"${appliedName}" template applied to Website Builder!`)
    setView('builder')
  }

  return (
    <div className="preview-bar">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button
          kind="ghost"
          icon="arrow"
          onClick={() => setView('templates')}
          title="Back to Template Gallery"
        >
          Templates
        </Button>
        <Button
          kind="ghost"
          icon="layout"
          onClick={() => setView('builder')}
          title="Open Website Builder"
        >
          Builder
        </Button>
        <label className="page-preview-select">
          Page{' '}
          <select value={page} onChange={(e) => setPage(e.target.value)}>
            {publicPages.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="preview-themes all-themes">
        {(Object.keys(themeLabels) as SchoolTheme[]).map((x) => (
          <button
            key={x}
            type="button"
            className={theme === x ? 'active' : ''}
            onClick={() => setTheme(x)}
          >
            {themeLabels[x]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button
          kind="secondary"
          onClick={() => window.open('/preview', '_blank')}
        >
          Open in new tab ↗
        </Button>
        <Button kind="primary" onClick={handleApplyCurrentTheme}>
          Use this template →
        </Button>
      </div>
    </div>
  )
}
