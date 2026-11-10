'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface ThemeControlsSidebarProps {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  secondaryColor: string
  setSecondaryColor: (color: string) => void
  fontHeading: string
  setFontHeading: (font: string) => void
  fontBody: string
  setFontBody: (font: string) => void
  style: string
  setStyle: (style: string) => void
  header: string
  setHeader: (header: string) => void
}

export function ThemeControlsSidebar({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  fontHeading,
  setFontHeading,
  fontBody,
  setFontBody,
  style,
  setStyle,
  header,
  setHeader,
}: ThemeControlsSidebarProps) {
  return (
    <aside className="theme-controls">
      <SettingGroup title="Brand colors">
        <div className="theme-colors">
          <label>
            <span>Primary Color</span>
            <div>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border-0 cursor-pointer p-0"
              />
              <input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
          </label>

          <label>
            <span>Accent Color</span>
            <div>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-8 h-8 rounded border-0 cursor-pointer p-0"
              />
              <input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </div>
          </label>
        </div>
      </SettingGroup>

      <SettingGroup title="Typography">
        <label>
          Heading font
          <select
            value={fontHeading}
            onChange={(e) => setFontHeading(e.target.value)}
          >
            <option value="DM Serif Display">DM Serif Display</option>
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
          </select>
        </label>
        <label>
          Body font
          <select
            value={fontBody}
            onChange={(e) => setFontBody(e.target.value)}
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="system-ui">System Default</option>
          </select>
        </label>
        <div className="font-preview">
          <span>Aa</span>
          <div>
            <strong>{fontHeading}</strong>
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
      </SettingGroup>

      <SettingGroup title="Header & navigation">
        <label>
          Header layout
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
      </SettingGroup>
    </aside>
  )
}
