'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { StateBadge } from '@/components/common/StateBadge'
import { useStudio } from '@/context/StudioContext'

function SystemSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="card system-section">
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  )
}

export function DesignSystem() {
  const { notify, setView } = useStudio()

  const categories = [
    'Foundations',
    'Colors',
    'Typography',
    'Buttons',
    'Form controls',
    'Badges',
    'Cards',
    'Tables',
    'Feedback',
    'States',
  ]

  const [activeCategory, setActiveCategory] = useState(categories[0])

  const colorTokens = [
    ['Primary', 'Brand Blue', '#2563EB', 'blue'],
    ['Ink', 'Slate 900', '#0F172A', 'ink'],
    ['Success', 'Green 600', '#16A34A', 'green'],
    ['Warning', 'Amber 500', '#F59E0B', 'amber'],
    ['Danger', 'Red 600', '#DC2626', 'red'],
    ['Surface', 'White', '#FFFFFF', 'surface'],
  ] as const

  const handleCopyDocs = () => {
    const docText = `# SchoolCanvas Design System Tokens
Primary: #2563EB
Ink: #0F172A
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
Typography: Inter (UI) / DM Serif Display (Editorial)
`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(docText)
      notify('Component documentation copied to clipboard!')
    } else {
      notify('Component documentation ready in clipboard')
    }
  }

  return (
    <div className="page-content system-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FOUNDATIONS & COMPONENTS</span>
          <h1>SchoolCanvas design system</h1>
          <p>Reusable patterns for a consistent, accessible product experience.</p>
        </div>
        <Button
          kind="primary"
          onClick={handleCopyDocs}
        >
          Copy documentation
        </Button>
      </div>

      <div className="system-layout">
        <aside className="system-index">
          {categories.map((x) => (
            <button
              type="button"
              className={activeCategory === x ? 'active' : ''}
              key={x}
              onClick={() => setActiveCategory(x)}
            >
              {x}
              <Icon name="chevron" size={12} />
            </button>
          ))}
        </aside>

        <main>
          <SystemSection
            title="Color tokens"
            description="Semantic colors provide consistent meaning and accessible contrast."
          >
            <div className="token-grid">
              {colorTokens.map((x) => (
                <div className="color-token" key={x[0]}>
                  <i className={x[3]} />
                  <strong>{x[0]}</strong>
                  <span>{x[1]}</span>
                  <code>{x[2]}</code>
                </div>
              ))}
            </div>
          </SystemSection>

          <SystemSection
            title="Typography"
            description="Inter supports product UI while DM Serif Display adds editorial character."
          >
            <div className="type-samples">
              <div>
                <span>Display / 48</span>
                <h2>Build trust at first sight.</h2>
              </div>
              <div>
                <span>Heading / 28</span>
                <h3>Website performance</h3>
              </div>
              <div>
                <span>Body / 14</span>
                <p>
                  Clear content and predictable hierarchy help school teams work with
                  confidence.
                </p>
              </div>
              <div>
                <span>Label / 11</span>
                <small>PUBLISHED WEBSITE</small>
              </div>
            </div>
          </SystemSection>

          <SystemSection
            title="Actions & inputs"
            description="Consistent interaction patterns across creation and management workflows."
          >
            <div className="component-row">
              <Button kind="primary" onClick={() => notify('Primary action button sample')}>
                Primary action
              </Button>
              <Button onClick={() => notify('Secondary action button sample')}>
                Secondary action
              </Button>
              <Button kind="ghost" onClick={() => notify('Ghost action button sample')}>
                Ghost action
              </Button>
              <Button kind="dark" onClick={() => notify('Dark action button sample')}>
                Dark action
              </Button>
              <button
                type="button"
                className="icon-button sample"
                aria-label="More options sample"
                onClick={() => notify('Icon action button sample')}
              >
                <Icon name="more" />
              </button>
            </div>
            <div className="input-showcase">
              <label>
                Default input
                <input placeholder="School name" />
              </label>
              <label>
                Focused input
                <input defaultValue="Northfield High School" />
              </label>
              <label>
                Select menu
                <select defaultValue="secondary">
                  <option value="secondary">Secondary education</option>
                  <option value="primary">Primary education</option>
                </select>
              </label>
              <label>
                Disabled input
                <input disabled defaultValue="System generated" />
              </label>
            </div>
          </SystemSection>

          <SystemSection
            title="Badges & status"
            description="Quick visual indicators for publishing, connection, and sync states."
          >
            <div className="badge-row">
              <StateBadge status="published">Live website</StateBadge>
              <StateBadge status="draft">Unpublished changes</StateBadge>
              <StateBadge status="synced">Sync healthy</StateBadge>
              <StateBadge status="pending">Awaiting DNS</StateBadge>
              <StateBadge status="failed">Domain expired</StateBadge>
            </div>
          </SystemSection>

          <SystemSection
            title="Cards & containers"
            description="Consistent surfaces structure related information and actions."
          >
            <div className="card-sample-grid">
              <div className="sample-card">
                <span className="sample-pill">ANALYTICS</span>
                <h4>Weekly audience reach</h4>
                <p>Track unique visitors, inquiry starts, and document downloads.</p>
                <b>12,842 visits</b>
              </div>
              <div className="sample-card">
                <span className="sample-pill">ADMISSIONS</span>
                <h4>Application round 2026</h4>
                <p>Manage admissions notice publishing, open dates, and requirements.</p>
                <b>48 days remaining</b>
              </div>
            </div>
          </SystemSection>

          <SystemSection
            title="Product states"
            description="Purpose-built empty, loading, error, and confirmation patterns."
          >
            <div className="state-grid">
              <div className="empty-state">
                <span>
                  <Icon name="image" />
                </span>
                <strong>No albums yet</strong>
                <p>Create an album to start sharing school moments.</p>
                <Button kind="primary" icon="plus" onClick={() => setView('gallery')}>
                  Create album
                </Button>
              </div>
              <div className="loading-state">
                <i />
                <i />
                <i />
                <span />
                <span />
                <span />
              </div>
              <div className="error-state">
                <span>
                  <Icon name="help" />
                </span>
                <strong>We couldn’t load this content</strong>
                <p>Check your connection and try once more.</p>
                <Button onClick={() => notify('Connection re-established and content reloaded')}>
                  Try again
                </Button>
              </div>
            </div>
          </SystemSection>
        </main>
      </div>
    </div>
  )
}
