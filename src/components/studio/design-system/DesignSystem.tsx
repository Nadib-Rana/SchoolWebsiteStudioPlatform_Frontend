'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { StateBadge } from '@/components/common/StateBadge'
import { useStudio } from '@/context/StudioContext'
import type { ReactNode } from 'react'

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
  const { notify } = useStudio()

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

  const colorTokens = [
    ['Primary', 'Brand Blue', '#2563EB', 'blue'],
    ['Ink', 'Slate 900', '#0F172A', 'ink'],
    ['Success', 'Green 600', '#16A34A', 'green'],
    ['Warning', 'Amber 500', '#F59E0B', 'amber'],
    ['Danger', 'Red 600', '#DC2626', 'red'],
    ['Surface', 'White', '#FFFFFF', 'surface'],
  ] as const

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
          onClick={() => notify('Component documentation copied')}
        >
          Copy documentation
        </Button>
      </div>

      <div className="system-layout">
        <aside className="system-index">
          {categories.map((x, i) => (
            <button
              type="button"
              className={i === 0 ? 'active' : ''}
              key={x}
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
              <Button kind="primary">Primary action</Button>
              <Button>Secondary action</Button>
              <Button kind="ghost">Ghost action</Button>
              <Button kind="dark">Dark action</Button>
              <button
                type="button"
                className="icon-button sample"
                aria-label="More options sample"
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
                With value
                <input defaultValue="Northfield High School" />
              </label>
              <label className="error">
                Validation error
                <input defaultValue="northfield high" />
                <small>Use title case for the school name.</small>
              </label>
              <label>
                Dropdown
                <select defaultValue="Published">
                  <option>Published</option>
                </select>
              </label>
            </div>
          </SystemSection>

          <SystemSection
            title="Status & feedback"
            description="States communicate progress, outcomes, and required attention."
          >
            <div className="badge-row">
              <StateBadge status="published">Published</StateBadge>
              <StateBadge status="draft">Draft</StateBadge>
              <StateBadge status="pending">Pending verification</StateBadge>
              <StateBadge status="expired">Sync failed</StateBadge>
            </div>
            <div className="feedback-grid">
              <div className="feedback success">
                <Icon name="check" />
                <div>
                  <strong>Changes published</strong>
                  <p>Your latest website version is now live.</p>
                </div>
              </div>
              <div className="feedback warning">
                <Icon name="clock" />
                <div>
                  <strong>Verification pending</strong>
                  <p>DNS updates can take up to 48 hours.</p>
                </div>
              </div>
              <div className="feedback danger">
                <Icon name="help" />
                <div>
                  <strong>Synchronization failed</strong>
                  <p>Review the ERP connection and try again.</p>
                </div>
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
                <Button kind="primary" icon="plus">
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
                <Button>Try again</Button>
              </div>
            </div>
          </SystemSection>
        </main>
      </div>
    </div>
  )
}
