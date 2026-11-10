'use client'

import { useState, useRef, useEffect } from 'react'
import { usePublicTranslation } from '@/lib/i18n/usePublicTranslation'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages'

interface PublicLanguageSelectorProps {
  isDark?: boolean
  enabledLanguages?: string[]
}

export function PublicLanguageSelector({
  isDark = false,
  enabledLanguages,
}: PublicLanguageSelectorProps) {
  const { lang, setLanguage, meta } = usePublicTranslation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const languages = SUPPORTED_LANGUAGES.filter((l) =>
    enabledLanguages && enabledLanguages.length > 0
      ? enabledLanguages.includes(l.code)
      : ['en', 'bn', 'es', 'ar'].includes(l.code)
  )

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
        style={{
          color: isDark ? '#f8fafc' : '#1e293b',
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
        }}
        aria-label="Change language"
      >
        <span>{meta.flag}</span>
        <span className="uppercase">{meta.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-lg bg-white shadow-xl border border-slate-200 py-1 z-50 text-xs">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                l.code === lang ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.nativeName}</span>
              </span>
              {l.code === lang && (
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
