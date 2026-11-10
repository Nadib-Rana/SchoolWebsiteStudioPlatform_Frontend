export interface LanguageItem {
  code: string
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
]

export function getLanguageMeta(code: string): LanguageItem {
  const match = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === (code || '').toLowerCase()
  )
  return match || SUPPORTED_LANGUAGES[0]
}

export function isRtlLanguage(code: string): boolean {
  return getLanguageMeta(code).dir === 'rtl'
}
