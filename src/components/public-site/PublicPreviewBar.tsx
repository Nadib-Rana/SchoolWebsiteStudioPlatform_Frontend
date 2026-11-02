'use client'

import { Button } from '@/components/common/Button'
import { publicPages } from '@/config/navigation'
import { themeLabels } from '@/config/themes'
import { useStudio } from '@/context/StudioContext'
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
  const { setView } = useStudio()

  return (
    <div className="preview-bar">
      <div>
        <Button
          kind="ghost"
          icon="arrow"
          onClick={() => setView('templates')}
        >
          Back to Studio
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

      <Button kind="primary" onClick={() => setView('builder')}>
        Edit this page
      </Button>
    </div>
  )
}
