export interface CustomThemeConfig {
  primaryColor?: string
  secondaryColor?: string
  fontHeading?: string
  fontBody?: string
  buttonRadius?: string
  style?: string
  headerLayout?: string
}

const THEME_SYNC_KEY = 'studio_custom_theme'
const THEME_SYNC_EVENT = 'studio:theme-changed'

export function saveCustomThemeLocally(cfg: CustomThemeConfig) {
  if (typeof window === 'undefined') return
  try {
    const existing = loadCustomThemeLocally() || {}
    const merged = { ...existing, ...cfg }
    localStorage.setItem(THEME_SYNC_KEY, JSON.stringify(merged))
    window.dispatchEvent(new CustomEvent(THEME_SYNC_EVENT, { detail: merged }))
  } catch {}
}

export function loadCustomThemeLocally(): CustomThemeConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(THEME_SYNC_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function subscribeToThemeChanges(callback: (cfg: CustomThemeConfig) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => {
    const custom = (e as CustomEvent).detail || loadCustomThemeLocally()
    if (custom) callback(custom)
  }
  window.addEventListener(THEME_SYNC_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(THEME_SYNC_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}
