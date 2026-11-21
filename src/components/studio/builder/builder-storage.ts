'use client'

export const BUILDER_STORAGE_KEY = 'studio_builder_homepage_data'

export function getBuilderStorageKey(schoolId?: string | null): string {
  if (schoolId) return `${BUILDER_STORAGE_KEY}_${schoolId}`
  if (typeof window !== 'undefined') {
    const activeId = localStorage.getItem('studio_school_id')
    if (activeId) return `${BUILDER_STORAGE_KEY}_${activeId}`
  }
  return BUILDER_STORAGE_KEY
}

export function persistBuilderStateToLocal(
  state: Record<string, any>,
  schoolId?: string | null,
) {
  if (typeof window === 'undefined') return
  try {
    const key = getBuilderStorageKey(schoolId)
    localStorage.setItem(key, JSON.stringify(state))
  } catch (e) {
    console.debug('Failed to cache builder state to localStorage:', e)
  }
}

export function loadBuilderStateFromLocal(
  schoolId?: string | null,
): Record<string, any> | null {
  if (typeof window === 'undefined') return null
  try {
    const key = getBuilderStorageKey(schoolId)
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (err) {
    console.debug('Failed to load local builder state:', err)
    return null
  }
}
