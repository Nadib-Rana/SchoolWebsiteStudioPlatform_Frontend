'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage, templates } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function Templates() {
  const { setView, setPreviewTheme, notify } = useStudio()
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

      <div className="template-feature">
        <div>
          <span className="feature-pill">
            <Icon name="sparkle" size={14} /> CURATED FOR YOU
          </span>
          <h2>
            Designed to make your school
            <br />
            stand out with confidence.
          </h2>
          <p>
            Every template is responsive, accessible, and purpose-built for school
            communities.
          </p>
          <div>
            <Button
              kind="dark"
              icon="eye"
              onClick={() => setView('public')}
            >
              Preview your website
            </Button>
            <button type="button" className="text-link">
              How templates work <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
        <div className="browser-mock">
          <div className="browser-top">
            <i />
            <i />
            <i />
          </div>
          <div
            className="browser-image"
            style={{
              backgroundImage: `linear-gradient(90deg,rgba(10,25,45,.82),rgba(10,25,45,.05)),url(${heroImage})`,
            }}
          >
            <span>NORTHFIELD</span>
            <strong>
              Where curiosity
              <br />
              becomes character.
            </strong>
            <small>Explore our school →</small>
          </div>
        </div>
      </div>

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
          {visibleTemplates.map((t, i) => (
            <div className="template-card" key={t.name}>
              <div
                className={`template-image ${device === 'mobile' ? 'mobile-shot' : ''}`}
                style={{ backgroundImage: `url(${t.image})` }}
              >
                {t.tag && <span>{t.tag}</span>}
                <div className="template-devices">
                  <button
                    type="button"
                    className={device === 'monitor' ? 'active' : ''}
                    onClick={() => setDevice('monitor')}
                    title="Desktop preview"
                  >
                    <Icon name="monitor" size={14} />
                  </button>
                  <button
                    type="button"
                    className={device === 'mobile' ? 'active' : ''}
                    onClick={() => setDevice('mobile')}
                    title="Mobile preview"
                  >
                    <Icon name="mobile" size={14} />
                  </button>
                </div>
                <div className="template-overlay">
                  <Button
                    kind="secondary"
                    icon="eye"
                    onClick={() => {
                      setPreviewTheme(t.theme)
                      setView('public')
                    }}
                  >
                    Live preview
                  </Button>
                </div>
              </div>
              <div className="template-info">
                <div>
                  <div className="template-title">
                    <h3>{t.name}</h3>
                    <span className="swatches">
                      {t.colors.map((c) => (
                        <i key={c} style={{ backgroundColor: c }} />
                      ))}
                    </span>
                  </div>
                  <p>{t.desc}</p>
                  <small>{t.category}</small>
                </div>
                <Button
                  kind={i === 0 ? 'primary' : 'secondary'}
                  onClick={() => {
                    setPreviewTheme(t.theme)
                    notify(`${t.name} template selected! Switched live preview theme to ${t.name}.`)
                  }}
                >
                  {i === 0 ? 'Current template' : 'Select'}
                </Button>
              </div>
            </div>
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
