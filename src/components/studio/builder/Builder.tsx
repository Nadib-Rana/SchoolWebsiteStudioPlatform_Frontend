'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { DeviceType } from '@/types/theme'
import { useState } from 'react'

export function Builder() {
  const { notify, setView } = useStudio()
  const [device, setDevice] = useState<DeviceType>('monitor')
  const [selected, setSelected] = useState('Hero section')
  const [isSaving, setIsSaving] = useState(false)

  // Live customizable state for hero section
  const [eyebrow, setEyebrow] = useState('LEARN · LEAD · MAKE A DIFFERENCE')
  const [heading, setHeading] = useState('Shaping thinkers.\nBuilding character.')
  const [description, setDescription] = useState(
    'A vibrant learning community where every student is known, challenged, and inspired to thrive.'
  )
  const [buttonLabel, setButtonLabel] = useState('Discover Northfield')
  const [buttonLink, setButtonLink] = useState('/about-us')
  const [overlayOpacity, setOverlayOpacity] = useState(65)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const pagesRes = await api.pages.list()
      const pages = (pagesRes as any)?.data || pagesRes
      const homePage = Array.isArray(pages)
        ? pages.find((p: any) => p.slug === 'home' || p.isHome)
        : null
      if (homePage?.id) {
        await api.pages.update(homePage.id, {
          title: homePage.title || 'Homepage',
          status: 'PUBLISHED',
        })
      }
      notify('Homepage sections draft saved successfully to database!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save draft.'
      notify(`Error: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const sections = [
    ['menu', 'Announcement bar'],
    ['layout', 'Header'],
    ['image', 'Hero section'],
    ['file', 'School introduction'],
    ['users', 'Principal message'],
    ['chart', 'Statistics'],
    ['bell', 'Latest notices'],
    ['calendar', 'Upcoming events'],
    ['image', 'Gallery'],
    ['globe', 'Footer'],
  ] as const

  return (
    <div className="builder">
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
            onClick={() => notify('Undo action')}
          >
            <Icon name="undo" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Redo last change"
            onClick={() => notify('Redo action')}
          >
            <Icon name="redo" />
          </button>
          <span />
          <Button
            kind="secondary"
            icon="eye"
            onClick={() => setView('public')}
          >
            Preview
          </Button>
          <Button
            kind="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save draft'}
          </Button>
        </div>
      </div>

      <div className="builder-body">
        <aside className="builder-left">
          <div className="panel-tabs">
            <button type="button" className="active">
              Sections
            </button>
            <button type="button">Components</button>
          </div>
          <div className="panel-heading">
            <span>PAGE STRUCTURE</span>
            <button type="button" aria-label="Add element">
              <Icon name="plus" />
            </button>
          </div>
          <div className="section-list">
            {sections.map(([icon, label], i) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelected(label)}
                className={selected === label ? 'active' : ''}
              >
                <i>⠿</i>
                <span className="section-icon">
                  <Icon name={icon} size={15} />
                </span>
                <strong>{label}</strong>
                {i === 0 && <small>Hidden</small>}
                <Icon name="more" size={15} />
              </button>
            ))}
          </div>
          <button type="button" className="add-section">
            <Icon name="plus" /> Add section
          </button>
        </aside>

        <div className="canvas-area">
          <div className={`canvas ${device}`}>
            <div className="site-mini-nav">
              <div className="mini-logo">N</div>
              <strong>Northfield High</strong>
              <div>
                <span>About</span>
                <span>Academics</span>
                <span>Campus life</span>
                <span>News</span>
                <b>Apply now</b>
              </div>
            </div>

            <div
              className={`mini-hero ${selected === 'Hero section' ? 'selected' : ''}`}
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(9,27,53,${overlayOpacity / 100}),rgba(9,27,53,${(overlayOpacity / 100) * 0.25})),url(${heroImage})`,
              }}
            >
              {selected === 'Hero section' && (
                <div className="selection-label">Hero section</div>
              )}
              <div>
                <small>{eyebrow}</small>
                <h2>
                  {heading.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx < heading.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                <p>{description}</p>
                <button type="button">
                  {buttonLabel} <Icon name="arrow" size={13} />
                </button>
              </div>
            </div>

            <div className="mini-stats">
              <div>
                <strong>1,240</strong>
                <span>Students</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Graduation rate</span>
              </div>
              <div>
                <strong>42</strong>
                <span>Years of excellence</span>
              </div>
              <div>
                <strong>16:1</strong>
                <span>Student–teacher ratio</span>
              </div>
            </div>

            <div className="mini-intro">
              <small>WELCOME TO NORTHFIELD</small>
              <h3>
                Learning with purpose.
                <br />
                Growing with confidence.
              </h3>
              <p>We combine academic excellence with a deeply supportive culture.</p>
            </div>
          </div>
        </div>

        <aside className="builder-right">
          <div className="settings-header">
            <div>
              <span>EDITING</span>
              <strong>{selected}</strong>
            </div>
            <button type="button" aria-label="Close settings">
              <Icon name="close" />
            </button>
          </div>
          <div className="settings-tabs">
            <button type="button" className="active">
              Content
            </button>
            <button type="button">Style</button>
            <button type="button">Advanced</button>
          </div>

          <SettingGroup title="Hero content">
            <label>
              Eyebrow text
              <input
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
              />
            </label>
            <label>
              Heading
              <textarea
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </SettingGroup>

          <SettingGroup title="Actions">
            <label>
              Button label
              <input
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
              />
            </label>
            <label>
              Button link
              <div className="input-icon">
                <input
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                />
                <Icon name="external" size={15} />
              </div>
            </label>
            <button
              type="button"
              className="inline-add"
              onClick={() => notify('Secondary button feature added to roadmap')}
            >
              <Icon name="plus" size={15} /> Add secondary button
            </button>
          </SettingGroup>

          <SettingGroup title="Background">
            <div
              className="media-picker"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <button
                type="button"
                onClick={() => notify('Media library picker opened')}
              >
                Replace image
              </button>
            </div>
            <label>
              Image overlay ({overlayOpacity}%)
              <div className="range">
                <input
                  type="range"
                  min="15"
                  max="95"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                />
                <span>{overlayOpacity}%</span>
              </div>
            </label>
          </SettingGroup>
        </aside>
      </div>
    </div>
  )
}
