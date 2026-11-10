'use client'

import { SettingGroup } from '@/components/common/SettingGroup'
import type { SectionStyle } from '../builder.types'

interface SectionStyleInspectorProps {
  activeTab: 'style' | 'advanced'
  activeStyle: SectionStyle
  updateActiveStyle: (patch: Partial<SectionStyle>) => void
}

const COLOR_PRESETS = [
  { label: 'White', color: '#ffffff' }, { label: 'Light', color: '#f8fafc' },
  { label: 'Slate', color: '#f1f5f9' }, { label: 'Navy', color: '#091a30' }, { label: 'Brand', color: '#163d72' },
]

const PADDING_PRESETS = [
  { id: 'compact' as const, label: 'Compact' },
  { id: 'normal' as const, label: 'Normal' },
  { id: 'spacious' as const, label: 'Spacious' },
]

export function SectionStyleInspector({ activeTab, activeStyle, updateActiveStyle }: SectionStyleInspectorProps) {
  if (activeTab === 'style') {
    return (
      <>
        <SettingGroup title="Section Colors">
          <label>
            Custom background color
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <input
                type="color"
                value={activeStyle.bg.startsWith('#') ? activeStyle.bg : '#ffffff'}
                onChange={(e) => updateActiveStyle({ bg: e.target.value })}
                style={{ width: '38px', height: '38px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '6px' }}
              />
              <input value={activeStyle.bg} onChange={(e) => updateActiveStyle({ bg: e.target.value })} style={{ flex: 1 }} />
            </div>
          </label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => updateActiveStyle({ bg: c.color })}
                style={{
                  flex: 1, padding: '6px 2px', fontSize: '11px', borderRadius: '6px', cursor: 'pointer',
                  border: activeStyle.bg === c.color ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: c.color,
                  color: c.color === '#091a30' || c.color === '#163d72' ? '#fff' : '#0f172a',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </SettingGroup>

        <SettingGroup title="Alignment & Spacing">
          <label>
            Text alignment
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateActiveStyle({ align: a })}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer', textTransform: 'capitalize',
                    border: activeStyle.align === a ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: activeStyle.align === a ? '#eff6ff' : '#fff',
                    color: activeStyle.align === a ? '#2563eb' : '#475569',
                    fontWeight: activeStyle.align === a ? 700 : 500,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </label>

          <label style={{ marginTop: '12px', display: 'block' }}>
            Vertical padding (Spacing)
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {PADDING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateActiveStyle({ padding: p.id })}
                  style={{
                    flex: 1, padding: '8px 4px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
                    border: activeStyle.padding === p.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: activeStyle.padding === p.id ? '#eff6ff' : '#fff',
                    color: activeStyle.padding === p.id ? '#2563eb' : '#475569',
                    fontWeight: activeStyle.padding === p.id ? 700 : 500,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>
        </SettingGroup>

        <SettingGroup title="Borders & Shadows">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={activeStyle.border}
              onChange={(e) => updateActiveStyle({ border: e.target.checked })}
              style={{ width: 'auto', margin: 0 }}
            />
            <span>Section divider border (Top & Bottom)</span>
          </label>

          <label>
            Card elevation shadow
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              {(['none', 'subtle', 'card'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateActiveStyle({ shadow: s })}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer', textTransform: 'capitalize',
                    border: activeStyle.shadow === s ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: activeStyle.shadow === s ? '#eff6ff' : '#fff',
                    color: activeStyle.shadow === s ? '#2563eb' : '#475569',
                    fontWeight: activeStyle.shadow === s ? 700 : 500,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
        </SettingGroup>
      </>
    )
  }

  return (
    <>
      <SettingGroup title="Device Visibility">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={activeStyle.hideOnMobile}
            onChange={(e) => updateActiveStyle({ hideOnMobile: e.target.checked })}
            style={{ width: 'auto', margin: 0 }}
          />
          <span>Hide this section on mobile devices</span>
        </label>
        <small style={{ color: '#64748b', fontSize: '12px' }}>
          When checked, this section will automatically be hidden on phone screens.
        </small>
      </SettingGroup>

      <SettingGroup title="Scroll Animation">
        <label>
          Entrance effect
          <select
            value={activeStyle.animation}
            onChange={(e) => updateActiveStyle({ animation: e.target.value })}
            style={{ marginTop: '6px' }}
          >
            <option value="none">None (Immediate)</option>
            <option value="fade-in">Fade in on scroll</option>
            <option value="slide-up">Slide up smoothly</option>
            <option value="zoom-in">Subtle zoom in</option>
          </select>
        </label>
      </SettingGroup>

      <SettingGroup title="Developer Attributes">
        <label>
          Custom HTML ID (Anchor navigation)
          <input
            value={activeStyle.customId}
            onChange={(e) => updateActiveStyle({ customId: e.target.value })}
            placeholder="e.g. upcoming-events"
          />
        </label>
        <label style={{ marginTop: '10px', display: 'block' }}>
          Custom CSS Class names
          <input
            value={activeStyle.customClass}
            onChange={(e) => updateActiveStyle({ customClass: e.target.value })}
            placeholder="e.g. shadow-lg rounded-2xl"
          />
        </label>
      </SettingGroup>
    </>
  )
}
