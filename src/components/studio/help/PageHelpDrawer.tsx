'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import {
  getGuideForView,
  normalizeSchoolRole,
  type HelpLang,
} from '@/config/help-guides'
import { useStudio } from '@/context/StudioContext'

interface PageHelpDrawerProps {
  isOpen: boolean
  onClose: () => void
  lang: HelpLang
  setLang: (lang: HelpLang) => void
}

export function PageHelpDrawer({
  isOpen,
  onClose,
  lang,
  setLang,
}: PageHelpDrawerProps) {
  const { view, setView, currentSchool } = useStudio()

  if (!isOpen) return null

  const guide = getGuideForView(view)
  const userRole = normalizeSchoolRole(currentSchool?.role)
  const hasAccess = guide.roles.includes(userRole)

  const handleOpenFullHelp = () => {
    onClose()
    setView('help')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Instant Page Help"
    >
      <aside
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                {lang === 'bn' ? 'পেজ হেল্প' : 'Page Help'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                Shift + ?
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1.5">
              {guide.title[lang]}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {guide.summary[lang]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help drawer"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Language & Role Bar */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">
              {lang === 'bn' ? 'আপনার রোল:' : 'Your Role:'}
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full border ${
                hasAccess
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {userRole}
              {!hasAccess
                ? lang === 'bn'
                  ? ' (শুধু দেখার অনুমতি)'
                  : ' (Read-only)'
                : ''}
            </span>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md text-xs font-semibold transition ${
                lang === 'en'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-2 py-0.5 rounded-md text-xs font-semibold transition ${
                lang === 'bn'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Steps Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {lang === 'bn'
                ? `ধাপে ধাপে কাজের নিয়ম (${guide.estimatedTime})`
                : `Step-by-Step Workflow (${guide.estimatedTime})`}
            </h3>
            <ol className="space-y-3.5">
              {guide.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <strong className="text-sm text-slate-900 block">
                        {step.title[lang]}
                      </strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.detail[lang]}
                      </p>
                      {step.tip && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
                          <strong>{lang === 'bn' ? 'টিপস: ' : 'Tip: '}</strong>
                          {step.tip[lang]}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {guide.troubleshooting && guide.troubleshooting.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                {lang === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Troubleshooting'}
              </h3>
              <div className="space-y-2.5">
                {guide.troubleshooting.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs"
                  >
                    <strong className="text-slate-900 block mb-1">
                      {item.q[lang]}
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {item.a[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <strong className="text-slate-800 block">
              {lang === 'bn' ? 'কিবোর্ড শর্টকাট' : 'Keyboard Shortcuts'}
            </strong>
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'এই পেজের হেল্প খুলুন/বন্ধ করুন' : 'Toggle page help'}</span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]">
                Shift + ?
              </kbd>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'হেল্প প্যানেল বন্ধ করুন' : 'Close help drawer'}</span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]">
                Esc
              </kbd>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <Button kind="primary" onClick={handleOpenFullHelp}>
            {lang === 'bn' ? 'সম্পূর্ণ হেল্প সেন্টার দেখুন' : 'Open Full Help Center'}
          </Button>
          <Button onClick={onClose}>
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </Button>
        </div>
      </aside>
    </div>
  )
}

