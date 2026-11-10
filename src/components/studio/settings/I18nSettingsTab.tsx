'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { api } from '@/lib/api-client'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages'
import { I18nPhrasesOverride } from './I18nPhrasesOverride'

interface I18nSettingsTabProps {
  notify: (msg: string) => void
}

export function I18nSettingsTab({ notify }: I18nSettingsTabProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [defaultLang, setDefaultLang] = useState('en')
  const [enabledLangs, setEnabledLangs] = useState<string[]>(['en', 'bn'])
  const [activeOverrideLang, setActiveOverrideLang] = useState('bn')
  const [mottoOverride, setMottoOverride] = useState('')
  const [applyButtonOverride, setApplyButtonOverride] = useState('')
  const [allOverrides, setAllOverrides] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    let mounted = true
    const loadI18n = async () => {
      try {
        setLoading(true)
        const res = await api.settings.getI18n()
        const data = (res as any)?.data || res
        if (mounted && data) {
          if (data.defaultLanguage) setDefaultLang(data.defaultLanguage)
          if (Array.isArray(data.supportedLanguages)) setEnabledLangs(data.supportedLanguages)
          if (data.customOverrides) {
            setAllOverrides(data.customOverrides)
            const bn = data.customOverrides.bn || {}
            setMottoOverride(bn.motto || '')
            setApplyButtonOverride(bn.applyButtonText || '')
          }
        }
      } catch {
        // Fallback default
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void loadI18n()
    return () => { mounted = false }
  }, [])

  const handleToggleLang = (code: string) => {
    if (code === defaultLang) return
    setEnabledLangs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedOverrides = {
        ...allOverrides,
        [activeOverrideLang]: {
          ...(allOverrides[activeOverrideLang] || {}),
          motto: mottoOverride.trim(),
          applyButtonText: applyButtonOverride.trim(),
        },
      }
      await api.settings.updateI18n({
        defaultLanguage: defaultLang,
        supportedLanguages: enabledLangs,
        customOverrides: updatedOverrides,
      })
      setAllOverrides(updatedOverrides)
      notify('Language & i18n settings updated successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      notify(`Error: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading localization settings...</div>
  }

  return (
    <div className="space-y-6">
      <SettingGroup title="Primary Language">
        <p className="text-xs text-slate-500 mb-3">
          The default language served to visitors when they first arrive on your school website.
        </p>
        <div className="max-w-md">
          <select
            value={defaultLang}
            onChange={(e) => {
              const val = e.target.value
              setDefaultLang(val)
              if (!enabledLangs.includes(val)) setEnabledLangs((prev) => [...prev, val])
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName}) {l.dir === 'rtl' ? '— RTL' : ''}
              </option>
            ))}
          </select>
        </div>
      </SettingGroup>

      <SettingGroup title="Enabled Public Languages">
        <p className="text-xs text-slate-500 mb-3">
          Select languages to make available in the public header language switcher.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isEnabled = enabledLangs.includes(l.code)
            const isPrimary = defaultLang === l.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleToggleLang(l.code)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs text-left transition-all ${
                  isEnabled
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-medium'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{l.flag}</span>
                  <div>
                    <strong className="block text-slate-800">{l.name}</strong>
                    <small className="text-[11px] text-slate-600">{l.nativeName}</small>
                  </div>
                </span>
                {isPrimary ? (
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                    Primary
                  </span>
                ) : (
                  <Icon
                    name={isEnabled ? 'check' : 'plus'}
                    size={14}
                    className={isEnabled ? 'text-blue-600' : 'text-slate-400'}
                  />
                )}
              </button>
            )
          })}
        </div>
      </SettingGroup>

      <I18nPhrasesOverride
        enabledLangs={enabledLangs}
        activeOverrideLang={activeOverrideLang}
        setActiveOverrideLang={setActiveOverrideLang}
        mottoOverride={mottoOverride}
        setMottoOverride={setMottoOverride}
        applyButtonOverride={applyButtonOverride}
        setApplyButtonOverride={setApplyButtonOverride}
        allOverrides={allOverrides}
      />

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <Button kind="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving i18n...' : 'Save Language Settings'}
        </Button>
      </div>
    </div>
  )
}
