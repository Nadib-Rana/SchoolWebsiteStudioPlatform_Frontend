'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import type { DeviceType } from '@/types/theme'
import { useState } from 'react'

export function Builder() {
  const { notify, setView } = useStudio()
  const [device, setDevice] = useState<DeviceType>('monitor')
  const [selected, setSelected] = useState('Hero section')

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
            onClick={() => notify('Draft saved successfully')}
          >
            Save draft
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
                backgroundImage: `linear-gradient(90deg,rgba(9,27,53,.9),rgba(9,27,53,.18)),url(${heroImage})`,
              }}
            >
              {selected === 'Hero section' && (
                <div className="selection-label">Hero section</div>
              )}
              <div>
                <small>LEARN · LEAD · MAKE A DIFFERENCE</small>
                <h2>
                  Shaping thinkers.
                  <br />
                  Building character.
                </h2>
                <p>
                  A vibrant learning community where every student is known, challenged,
                  and inspired to thrive.
                </p>
                <button type="button">
                  Discover Northfield <Icon name="arrow" size={13} />
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
              <input defaultValue="LEARN · LEAD · MAKE A DIFFERENCE" />
            </label>
            <label>
              Heading
              <textarea defaultValue={'Shaping thinkers.\nBuilding character.'} />
            </label>
            <label>
              Description
              <textarea
                defaultValue="A vibrant learning community where every student is known, challenged, and inspired to thrive."
              />
            </label>
          </SettingGroup>

          <SettingGroup title="Actions">
            <label>
              Button label
              <input defaultValue="Discover Northfield" />
            </label>
            <label>
              Button link
              <div className="input-icon">
                <input defaultValue="/about-us" />
                <Icon name="external" size={15} />
              </div>
            </label>
            <button type="button" className="inline-add">
              <Icon name="plus" size={15} /> Add secondary button
            </button>
          </SettingGroup>

          <SettingGroup title="Background">
            <div
              className="media-picker"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <button type="button">Replace image</button>
            </div>
            <label>
              Image overlay
              <div className="range">
                <input type="range" defaultValue="65" />
                <span>65%</span>
              </div>
            </label>
          </SettingGroup>
        </aside>
      </div>
    </div>
  )
}
