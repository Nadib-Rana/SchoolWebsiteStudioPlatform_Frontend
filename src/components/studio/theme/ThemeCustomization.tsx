'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function ThemeCustomization() {
  const { notify } = useStudio()
  const [style, setStyle] = useState('Rounded')
  const [header, setHeader] = useState('Centered')

  const brandColors = [
    ['Primary', '#163D72', 'navy'],
    ['Secondary', '#E3AD3F', 'gold'],
    ['Background', '#FFFFFF', 'white'],
    ['Text', '#172033', 'ink'],
  ] as const

  return (
    <div className="theme-studio">
      <div className="theme-toolbar">
        <div>
          <span className="eyebrow">GLOBAL STYLES</span>
          <h1>Theme customization</h1>
          <p>Shape a consistent visual identity across every page.</p>
        </div>
        <div>
          <Button onClick={() => notify('Theme reset to Aster defaults')}>
            Reset to default
          </Button>
          <Button onClick={() => notify('Theme saved as draft')}>
            Save theme
          </Button>
          <Button
            kind="primary"
            onClick={() => notify('Theme changes published')}
          >
            Publish changes
          </Button>
        </div>
      </div>

      <div className="theme-body">
        <aside className="theme-controls">
          <SettingGroup title="Brand colors">
            <div className="theme-colors">
              {brandColors.map(([name, defaultVal, tone]) => (
                <label key={name}>
                  <span>{name}</span>
                  <div>
                    <i className={tone} />
                    <input defaultValue={defaultVal} />
                  </div>
                </label>
              ))}
            </div>
          </SettingGroup>

          <SettingGroup title="Typography">
            <label>
              Heading font
              <select defaultValue="DM Serif Display">
                <option>DM Serif Display</option>
                <option>Inter</option>
                <option>Georgia</option>
              </select>
            </label>
            <label>
              Body font
              <select defaultValue="Inter">
                <option>Inter</option>
                <option>Arial</option>
              </select>
            </label>
            <div className="font-preview">
              <span>Aa</span>
              <div>
                <strong>DM Serif Display</strong>
                <small>Headings and editorial moments</small>
              </div>
            </div>
          </SettingGroup>

          <SettingGroup title="Buttons & corners">
            <label>
              Button style
              <div className="choice-row">
                {['Square', 'Rounded', 'Pill'].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={style === x ? 'active' : ''}
                    onClick={() => setStyle(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Border radius
              <input type="range" defaultValue="12" />
            </label>
          </SettingGroup>

          <SettingGroup title="Header & navigation">
            <label>
              Header style
              <div className="choice-row">
                {['Compact', 'Centered', 'Overlay'].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={header === x ? 'active' : ''}
                    onClick={() => setHeader(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Navigation style
              <select defaultValue="Horizontal links">
                <option>Horizontal links</option>
                <option>Mega menu</option>
                <option>Split navigation</option>
              </select>
            </label>
          </SettingGroup>

          <SettingGroup title="Footer style">
            <div className="footer-options">
              <button type="button" className="active">
                Editorial
              </button>
              <button type="button">Compact</button>
              <button type="button">Centered</button>
            </div>
          </SettingGroup>
        </aside>

        <div className="theme-preview-area">
          <div className="theme-preview-label">
            <span>
              <i />
              Live preview
            </span>
            <div className="device-switch">
              <button type="button" className="active" aria-label="Desktop preview">
                <Icon name="monitor" />
              </button>
              <button type="button" aria-label="Tablet preview">
                <Icon name="tablet" />
              </button>
              <button type="button" aria-label="Mobile preview">
                <Icon name="mobile" />
              </button>
            </div>
            <span>Homepage</span>
          </div>

          <div className="theme-browser">
            <div className="site-mini-nav">
              <div className="mini-logo">N</div>
              <strong>Northfield High</strong>
              <div>
                <span>About</span>
                <span>Academics</span>
                <span>Community</span>
                <span>News</span>
                <b className={style.toLowerCase()}>Apply now</b>
              </div>
            </div>

            <div
              className="theme-hero"
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(9,27,53,.9),rgba(9,27,53,.12)),url(${heroImage})`,
              }}
            >
              <div>
                <small>LEARN · LEAD · MAKE A DIFFERENCE</small>
                <h2>
                  Shaping thinkers.
                  <br />
                  Building character.
                </h2>
                <p>
                  A vibrant learning community where every student is known, challenged,
                  and inspired.
                </p>
                <button type="button" className={style.toLowerCase()}>
                  Discover Northfield <Icon name="arrow" size={13} />
                </button>
              </div>
            </div>

            <div className="theme-preview-content">
              <span>WELCOME TO NORTHFIELD</span>
              <h3>
                Learning with purpose.
                <br />
                Growing with confidence.
              </h3>
              <p>Education at Northfield goes beyond strong results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
