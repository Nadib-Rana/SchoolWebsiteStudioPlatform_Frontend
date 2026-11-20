'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import {
  HELP_CATEGORIES,
  HELP_GUIDES,
  QUICK_START_CHECKLIST,
  normalizeSchoolRole,
  type HelpCategory,
  type HelpLang,
} from '@/config/help-guides'
import { useStudio } from '@/context/StudioContext'
import { useEffect, useMemo, useState } from 'react'

interface HelpCenterProps {
  lang: HelpLang
  setLang: (lang: HelpLang) => void
}

export function HelpCenter({ lang, setLang }: HelpCenterProps) {
  const { setView, currentSchool } = useStudio()
  const userRole = normalizeSchoolRole(currentSchool?.role)
  const schoolKey = `studio_quickstart_done_${currentSchool?.id || 'default'}`

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<HelpCategory | 'all'>('all')
  const [onlyMyRole, setOnlyMyRole] = useState(true)
  const [selectedGuideId, setSelectedGuideId] = useState<string>(HELP_GUIDES[0].id)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(schoolKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setCompletedSteps(parsed)
      } else {
        setCompletedSteps([])
      }
    } catch {
      setCompletedSteps([])
    }
  }, [schoolKey])

  const toggleChecklistItem = (id: string) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      if (typeof window !== 'undefined') {
        localStorage.setItem(schoolKey, JSON.stringify(next))
      }
      return next
    })
  }

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase()
    return HELP_GUIDES.filter((g) => {
      if (onlyMyRole && !g.roles.includes(userRole)) return false
      if (activeCategory !== 'all' && g.category !== activeCategory) return false
      if (!q) return true
      const haystack = [
        g.title.en,
        g.title.bn,
        g.summary.en,
        g.summary.bn,
        ...g.steps.flatMap((s) => [s.title.en, s.title.bn, s.detail.en, s.detail.bn]),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [search, activeCategory, onlyMyRole, userRole])

  const activeGuide =
    filteredGuides.find((g) => g.id === selectedGuideId) ||
    filteredGuides[0] ||
    null

  const progressPct = Math.round(
    (completedSteps.length / QUICK_START_CHECKLIST.length) * 100,
  )

  return (
    <div className="page-content space-y-6">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">
              {lang === 'bn' ? 'হেল্প সেন্টার ও ইউজার গাইড' : 'HELP CENTER & USER GUIDE'}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Shift + ?
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {lang === 'bn' ? `রোল: ${userRole}` : `Role: ${userRole}`}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {lang === 'bn'
              ? 'প্রতিটি ফিচারের ধাপে ধাপে ব্যবহার গাইড'
              : 'Step-by-step workflows for every feature'}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'bn'
              ? 'আপনার রোলের জন্য প্রযোজ্য সব ফিচারের নির্দেশিকা এখানে পাবেন। অ্যাপের যেকোনো পেজে Shift + ? চাপলেই তাৎক্ষণিক পেজ হেল্প খুলে যাবে।'
              : 'Step-by-step workflows tailored to your role. Press Shift + ? anywhere in the studio for instant page-specific help.'}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                lang === 'en'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                lang === 'bn'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyMyRole}
              onChange={(e) => setOnlyMyRole(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>
              {lang === 'bn'
                ? `শুধু আমার রোল (${userRole})-এর গাইড দেখাও`
                : `Show guides for my role (${userRole}) only`}
            </span>
          </label>
        </div>
      </div>

      {/* Quick-Start Checklist */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'bn'
                ? 'কুইক-স্টার্ট সেটআপ চেকলিস্ট'
                : 'Quick-Start Launch Checklist'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'নতুন স্কুল ওয়েবসাইট লাইভ করতে এই ৫টি ধাপ অনুসরণ করুন।'
                : 'Follow these 5 steps to launch your school website smoothly.'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
            {completedSteps.length}/{QUICK_START_CHECKLIST.length} ({progressPct}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {QUICK_START_CHECKLIST.map((item) => {
            const done = completedSteps.includes(item.id)
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-3 ${
                  done
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="mt-1 rounded border-slate-300"
                    />
                    <span
                      className={`text-xs font-bold ${
                        done ? 'line-through text-emerald-800' : 'text-slate-900'
                      }`}
                    >
                      {item.title[lang]}
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                    {item.detail[lang]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView(item.targetView)}
                  className="text-[11px] font-semibold text-indigo-700 hover:underline self-start pl-5"
                >
                  {lang === 'bn' ? 'পেজে যান →' : 'Open page →'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {HELP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>

        <div className="search-field min-w-[260px]">
          <Icon name="search" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'ফিচার, ERP, Publish সার্চ করুন...'
                : 'Search features, ERP, Publish...'
            }
          />
        </div>
      </div>

      {/* Split Guide Explorer */}
      {filteredGuides.length === 0 ? (
        <div className="card p-10 text-center space-y-2">
          <strong className="text-slate-900">
            {lang === 'bn' ? 'কোনো গাইড পাওয়া যায়নি' : 'No matching guides found'}
          </strong>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার ক্লিয়ার করুন।'
              : 'Try another keyword or clear your category/role filter.'}
          </p>
          <div className="pt-2">
            <Button
              onClick={() => {
                setSearch('')
                setActiveCategory('all')
                setOnlyMyRole(false)
              }}
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset filters'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left list */}
          <div className="lg:col-span-4 space-y-2">
            {filteredGuides.map((g) => {
              const selected = activeGuide?.id === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGuideId(g.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm">{g.title[lang]}</strong>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        selected
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {g.estimatedTime}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      selected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {g.summary[lang]}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Right detail panel */}
          {activeGuide && (
            <div className="lg:col-span-8 card p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeGuide.roles.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeGuide.title[lang]}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {activeGuide.summary[lang]}
                  </p>
                </div>

                <Button
                  kind="primary"
                  onClick={() => setView(activeGuide.view)}
                >
                  {lang === 'bn' ? 'এই ফিচারে যান →' : 'Open Feature →'}
                </Button>
              </div>

              <ol className="space-y-4">
                {activeGuide.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <strong className="text-sm text-slate-900 block">
                          {step.title[lang]}
                        </strong>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.detail[lang]}
                        </p>
                        {step.tip && (
                          <div className="mt-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                            <strong>{lang === 'bn' ? 'প্রো টিপ: ' : 'Pro Tip: '}</strong>
                            {step.tip[lang]}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {activeGuide.troubleshooting &&
                activeGuide.troubleshooting.length > 0 && (
                  <div className="pt-2 space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {lang === 'bn' ? 'সচরাচর জিজ্ঞাসা ও সমাধান' : 'Troubleshooting'}
                    </h3>
                    {activeGuide.troubleshooting.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-sm"
                      >
                        <strong className="text-slate-900 block mb-1">
                          {item.q[lang]}
                        </strong>
                        <p className="text-slate-700 text-xs leading-relaxed">
                          {item.a[lang]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

