'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { GoverningBodyConfig } from '@/lib/public-site-types'
import { revalidatePublicSite } from '@/lib/revalidate-client'

const DEFAULT_CONFIG: Required<GoverningBodyConfig> = {
  enabled: true,
  showOnHome: true,
  showOnAbout: true,
  showSpotlight: true,
  showContact: true,
  kicker: '',
  title: '',
  subtitle: '',
  columns: 3,
  compactLimit: 6,
}

export function GoverningBodySettingsPanel() {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [config, setConfig] = useState<Required<GoverningBodyConfig>>(DEFAULT_CONFIG)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadSettings = async () => {
      setLoading(true)
      try {
        const res = await api.settings.get()
        const settings = (res as any)?.data || res
        const saved = settings?.notificationPreferences?._governingBody as
          | GoverningBodyConfig
          | undefined
        if (mounted && saved && typeof saved === 'object') {
          setConfig({
            enabled: typeof saved.enabled === 'boolean' ? saved.enabled : true,
            showOnHome:
              typeof saved.showOnHome === 'boolean' ? saved.showOnHome : true,
            showOnAbout:
              typeof saved.showOnAbout === 'boolean' ? saved.showOnAbout : true,
            showSpotlight:
              typeof saved.showSpotlight === 'boolean' ? saved.showSpotlight : true,
            showContact:
              typeof saved.showContact === 'boolean' ? saved.showContact : true,
            kicker: typeof saved.kicker === 'string' ? saved.kicker : '',
            title: typeof saved.title === 'string' ? saved.title : '',
            subtitle: typeof saved.subtitle === 'string' ? saved.subtitle : '',
            columns:
              saved.columns === 2 || saved.columns === 4 ? saved.columns : 3,
            compactLimit:
              typeof saved.compactLimit === 'number' ? saved.compactLimit : 6,
          })
        } else if (mounted) {
          setConfig(DEFAULT_CONFIG)
        }
      } catch {
        // Ignore load errors; defaults apply
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadSettings()
    return () => {
      mounted = false
    }
  }, [currentSchool?.id, schoolSwitchKey])

  const persistConfig = async (
    nextConfig: Required<GoverningBodyConfig>,
    toastMessage: string,
  ) => {
    setSaving(true)
    try {
      await api.settings.update({
        notificationPreferences: {
          _governingBody: {
            enabled: nextConfig.enabled,
            showOnHome: nextConfig.showOnHome,
            showOnAbout: nextConfig.showOnAbout,
            showSpotlight: nextConfig.showSpotlight,
            showContact: nextConfig.showContact,
            kicker: nextConfig.kicker.trim(),
            title: nextConfig.title.trim(),
            subtitle: nextConfig.subtitle.trim(),
            columns: nextConfig.columns,
            compactLimit: Number(nextConfig.compactLimit),
          },
        },
      })
      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      notify(toastMessage)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings.'
      notify(`Error: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleQuickToggleEnabled = async () => {
    const nextEnabled = !config.enabled
    const nextConfig = { ...config, enabled: nextEnabled }
    setConfig(nextConfig)
    await persistConfig(
      nextConfig,
      nextEnabled
        ? 'Governing Body page & sections enabled live!'
        : 'Governing Body page & sections turned off.',
    )
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
  }

  return (
    <div className="card" style={{ marginBottom: '18px', padding: '18px 20px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span
            className={`state-badge ${config.enabled ? 'published' : 'draft'}`}
          >
            <i />
            {config.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <div>
            <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
              Page &amp; Section Visibility / Customization
            </strong>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {loading
                ? 'Loading preferences...'
                : `Homepage: ${config.showOnHome && config.enabled ? 'On' : 'Off'} · About Page: ${
                    config.showOnAbout && config.enabled ? 'On' : 'Off'
                  } · Columns: ${config.columns}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            disabled={saving || loading}
            className={config.enabled ? 'toggle on' : 'toggle'}
            onClick={handleQuickToggleEnabled}
            aria-label="Toggle Governing Body public visibility"
            title={
              config.enabled
                ? 'Disable Governing Body page & sections'
                : 'Enable Governing Body page & sections'
            }
          >
            <i />
          </button>
          <Button
            icon="settings"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Hide Settings' : 'Customize & Visibility'}
          </Button>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: '18px',
            paddingTop: '18px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="toggle-row" style={{ margin: 0 }}>
              <div>
                <strong>Enable Governing Body Page</strong>
                <small>Show /governing-body route to public visitors</small>
              </div>
              <button
                type="button"
                className={config.enabled ? 'toggle on' : 'toggle'}
                onClick={() =>
                  setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
                }
                aria-label="Toggle Governing Body page"
              >
                <i />
              </button>
            </div>

            <div className="toggle-row" style={{ margin: 0 }}>
              <div>
                <strong>Show on Homepage</strong>
                <small>Display committee overview below Principal message</small>
              </div>
              <button
                type="button"
                className={config.showOnHome ? 'toggle on' : 'toggle'}
                onClick={() =>
                  setConfig((prev) => ({ ...prev, showOnHome: !prev.showOnHome }))
                }
                aria-label="Toggle Show on Homepage"
              >
                <i />
              </button>
            </div>

            <div className="toggle-row" style={{ margin: 0 }}>
              <div>
                <strong>Show on About Page</strong>
                <small>Display committee section on About School page</small>
              </div>
              <button
                type="button"
                className={config.showOnAbout ? 'toggle on' : 'toggle'}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    showOnAbout: !prev.showOnAbout,
                  }))
                }
                aria-label="Toggle Show on About Page"
              >
                <i />
              </button>
            </div>

            <div className="toggle-row" style={{ margin: 0 }}>
              <div>
                <strong>Show Chairman Spotlight</strong>
                <small>Highlight the featured Chairman/President card on top</small>
              </div>
              <button
                type="button"
                className={config.showSpotlight ? 'toggle on' : 'toggle'}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    showSpotlight: !prev.showSpotlight,
                  }))
                }
                aria-label="Toggle Show Chairman Spotlight"
              >
                <i />
              </button>
            </div>

            <div className="toggle-row" style={{ margin: 0 }}>
              <div>
                <strong>Show Public Phone &amp; Email</strong>
                <small>Display member public phone/email in spotlight card</small>
              </div>
              <button
                type="button"
                className={config.showContact ? 'toggle on' : 'toggle'}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    showContact: !prev.showContact,
                  }))
                }
                aria-label="Toggle Show Public Phone and Email"
              >
                <i />
              </button>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Eyebrow / Kicker Text
              <input
                placeholder="LEADERSHIP & GOVERNANCE"
                value={config.kicker}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, kicker: e.target.value }))
                }
              />
            </label>

            <label>
              Custom Section &amp; Page Title
              <input
                placeholder="e.g. Governing Body / Managing Committee (SMC)"
                value={config.title}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </label>

            <label>
              Grid Columns
              <select
                value={config.columns}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    columns: Number(e.target.value) as 2 | 3 | 4,
                  }))
                }
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns (Default)</option>
                <option value={4}>4 Columns</option>
              </select>
            </label>

            <label>
              Homepage &amp; About Member Limit
              <select
                value={config.compactLimit}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    compactLimit: Number(e.target.value),
                  }))
                }
              >
                <option value={3}>3 Members</option>
                <option value={6}>6 Members (Default)</option>
                <option value={9}>9 Members</option>
                <option value={0}>Show All Members</option>
              </select>
            </label>

            <label className="full">
              Custom Subtitle / Description
              <textarea
                rows={2}
                placeholder="Committed trustees, guardians, and academic leaders guiding policy, transparency, and institutional excellence."
                value={config.subtitle}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, subtitle: e.target.value }))
                }
              />
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <Button onClick={handleReset} disabled={saving}>
              Reset to Defaults
            </Button>
            <Button
              kind="primary"
              icon="check"
              onClick={() =>
                persistConfig(
                  config,
                  'Governing Body visibility & customization settings saved!',
                )
              }
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

