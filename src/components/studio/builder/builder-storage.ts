'use client'

export const BUILDER_STORAGE_KEY = 'studio_builder_homepage_data'

export function persistBuilderStateToLocal(state: Record<string, any>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.debug('Failed to cache builder state to localStorage:', e)
  }
}

export function loadBuilderStateFromLocal(): Record<string, any> | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(BUILDER_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (err) {
    console.debug('Failed to load local builder state:', err)
    return null
  }
}
