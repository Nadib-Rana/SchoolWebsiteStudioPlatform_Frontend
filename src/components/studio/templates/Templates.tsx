'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { templates } from '@/config/templates'
import { THEME_CONFIGS } from '@/config/themes'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { SchoolTheme } from '@/types/theme'
import { useState } from 'react'
import { TemplateHeroBanner } from './TemplateHeroBanner'
import { TemplateGridCard } from './TemplateGridCard'

export function Templates() {
  const { setView, previewTheme, setPreviewTheme, notify } = useStudio()
  const [filter, setFilter] = useState('All templates')
  const [device, setDevice] = useState<'monitor' | 'mobile'>('monitor')
  const [query, setQuery] = useState('')

  const categories = [
    'All templates',
    'Modern',
    'Traditional',
    'International',
    'College',
    'High School',
    'Primary',
    'Religious',
    'Minimal',
    'Premium',
  ]

  const handleApplyTemplate = async (templateTheme: SchoolTheme, templateName: string) => {
    setPreviewTheme(templateTheme)
    const cfg = THEME_CONFIGS[templateTheme]
    if (cfg && typeof window !== 'undefined') {
      try {
        let builderData: any = {}
        const saved = localStorage.getItem('studio_builder_homepage_data')
        if (saved) {
          try {
            builderData = JSON.parse(saved)
          } catch {}
        }

        const updated = {
          ...builderData,
          schoolName: cfg.schoolName,
          logoLetter: cfg.schoolName.charAt(0),
          eyebrow: cfg.eyebrow,
          heading: cfg.headline,
          description: cfg.description,
          buttonLabel: cfg.buttonLabel,
          announcementText: cfg.announcementText,
          appliedTheme: templateTheme,
          sectionStyles: {
            ...(builderData.sectionStyles || {}),
            Header: {
              ...(builderData.sectionStyles?.Header || {}),
              bg: cfg.headerBg,
            },
            'Announcement bar': {
              ...(builderData.sectionStyles?.['Announcement bar'] || {}),
              bg: cfg.primaryColor,
            },
          },
        }

        localStorage.setItem('studio_builder_homepage_data', JSON.stringify(updated))
        localStorage.setItem('studio_selected_theme', templateTheme)
      } catch (e) {
        console.debug('Failed to update builder data with template:', e)
      }
    }

    try {
      if (cfg) {
        await api.theme.saveDraft({
          primaryColor: cfg.primaryColor,
          secondaryColor: cfg.secondaryColor,
          fontHeading: cfg.fontHeading,
          fontBody: 'Inter',
        })
      }
    } catch (e) {
      console.debug('Backend theme sync notice:', e)
    }

    notify(`"${templateName}" template applied! Builder & Preview now match ${templateName}.`)
  }

  const handlePreviewTemplate = (theme: SchoolTheme, name: string) => {
    handleApplyTemplate(theme, name)
    setView('public')
  }

  const visibleTemplates = templates.filter(
    (t) =>
      (filter === 'All templates' || t.category.includes(filter)) &&
      (t.name + ' ' + t.category + ' ' + t.desc)
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  return (
    <div className="page-content templates-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DESIGN LIBRARY</span>
          <h1>Find your school’s perfect look</h1>
          <p>Switch designs anytime. Your content always stays safely in place.</p>
        </div>
        <Button
          kind="secondary"
          icon="layout"
          onClick={() => setView('builder')}
        >
          Customize current template
        </Button>
      </div>

      <TemplateHeroBanner />

      <div className="template-controls">
        <div className="category-tabs">
          {categories.map((x) => (
            <button
              type="button"
              className={filter === x ? 'active' : ''}
              onClick={() => setFilter(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="search-field">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
          />
        </div>
      </div>

      {visibleTemplates.length ? (
        <div className="template-grid">
          {visibleTemplates.map((t) => (
            <TemplateGridCard
              key={t.name}
              template={t}
              isCurrent={previewTheme === t.theme}
              device={device}
              onDeviceChange={setDevice}
              onApply={handleApplyTemplate}
              onPreview={handlePreviewTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state template-empty">
          <span>
            <Icon name="search" />
          </span>
          <strong>No matching templates</strong>
          <p>Try another name or clear the selected category.</p>
          <Button
            onClick={() => {
              setQuery('')
              setFilter('All templates')
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
