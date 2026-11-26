export interface SchoolSocialLinks {
  erpLoginUrl?: string
  erpLoginLabel?: string
  facebook?: string
  youtube?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  website?: string
  whatsapp?: string
  [key: string]: string | undefined
}

export function normalizeExternalUrl(raw?: string | null): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}

export function sanitizeSocialLinks(
  links: SchoolSocialLinks,
): Record<string, string> {
  const urlKeys = [
    'erpLoginUrl',
    'facebook',
    'youtube',
    'instagram',
    'linkedin',
    'twitter',
    'website',
  ] as const

  const result: Record<string, string> = {}

  Object.entries(links).forEach(([key, val]) => {
    if (typeof val !== 'string') return
    const trimmed = val.trim()
    if (!trimmed) return
    if (urlKeys.includes(key as any)) {
      const normalized = normalizeExternalUrl(trimmed)
      if (normalized) result[key] = normalized
    } else {
      result[key] = trimmed
    }
  })

  return result
}
