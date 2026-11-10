'use client'

import { SettingGroup } from '@/components/common/SettingGroup'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages'

interface I18nPhrasesOverrideProps {
  enabledLangs: string[]
  activeOverrideLang: string
  setActiveOverrideLang: (lang: string) => void
  mottoOverride: string
  setMottoOverride: (motto: string) => void
  applyButtonOverride: string
  setApplyButtonOverride: (btn: string) => void
  allOverrides: Record<string, Record<string, string>>
}

export function I18nPhrasesOverride({
  enabledLangs,
  activeOverrideLang,
  setActiveOverrideLang,
  mottoOverride,
  setMottoOverride,
  applyButtonOverride,
  setApplyButtonOverride,
  allOverrides,
}: I18nPhrasesOverrideProps) {
  return (
    <SettingGroup title="Custom Localized Phrases">
      <p className="text-xs text-slate-500 mb-3">
        Customize school branding phrases for each enabled language.
      </p>
      <div className="space-y-3 max-w-lg">
        <div className="flex gap-2 mb-2">
          {enabledLangs.map((c) => {
            const langMeta = SUPPORTED_LANGUAGES.find((x) => x.code === c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setActiveOverrideLang(c)
                  const over = allOverrides[c] || {}
                  setMottoOverride(over.motto || '')
                  setApplyButtonOverride(over.applyButtonText || '')
                }}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  activeOverrideLang === c
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {langMeta?.flag} {langMeta?.name}
              </button>
            )
          })}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Translated School Motto
          </label>
          <input
            type="text"
            placeholder="e.g. শিখুন · নেতৃত্ব দিন · সেবা করুন"
            value={mottoOverride}
            onChange={(e) => setMottoOverride(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Admission CTA Button Text
          </label>
          <input
            type="text"
            placeholder="e.g. ভর্তি আবেদন / Postula ahora"
            value={applyButtonOverride}
            onChange={(e) => setApplyButtonOverride(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </SettingGroup>
  )
}
