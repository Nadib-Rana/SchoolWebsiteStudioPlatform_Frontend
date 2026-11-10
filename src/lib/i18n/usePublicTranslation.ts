'use client'

import { useCallback, useEffect, useState } from 'react'
import { DICTIONARIES } from './dictionaries'
import { getLanguageMeta, isRtlLanguage, SUPPORTED_LANGUAGES } from './languages'

export function usePublicTranslation(initialLang = 'en') {
  const [lang, setLangState] = useState<string>(initialLang)

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const urlLang = urlParams.get('lang')
      const stored = localStorage.getItem('school_public_lang')
      const active = urlLang || stored || initialLang || 'en'
      setLangState(active)
      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRtlLanguage(active) ? 'rtl' : 'ltr'
        document.documentElement.lang = active
      }
    } catch {
      // Safe fallback for SSR
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        setLangState(customEvent.detail)
      }
    }

    window.addEventListener('school_lang_change', handleLangChange)
    return () => window.removeEventListener('school_lang_change', handleLangChange)
  }, [initialLang])

  const setLanguage = useCallback((newLang: string) => {
    setLangState(newLang)
    try {
      localStorage.setItem('school_public_lang', newLang)
      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRtlLanguage(newLang) ? 'rtl' : 'ltr'
        document.documentElement.lang = newLang
      }
      window.dispatchEvent(
        new CustomEvent('school_lang_change', { detail: newLang })
      )
    } catch {
      // Ignore storage errors
    }
  }, [])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = DICTIONARIES[lang] || DICTIONARIES.en
      if (dict && dict[key]) {
        return dict[key]
      }
      if (DICTIONARIES.en[key]) {
        return DICTIONARIES.en[key]
      }
      return fallback || key
    },
    [lang]
  )

  return {
    lang,
    setLanguage,
    t,
    isRtl: isRtlLanguage(lang),
    meta: getLanguageMeta(lang),
    supportedLanguages: SUPPORTED_LANGUAGES,
  }
}
