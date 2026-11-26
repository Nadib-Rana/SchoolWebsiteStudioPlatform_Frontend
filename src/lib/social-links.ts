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

function stripControlChars(value: string): string {
  let out = ''
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    if (code > 31 && code !== 127) {
      out += value[i]
    }
  }
  return out
}

const DANGEROUS_SCHEME_REGEX = /^(javascript|data|vbscript|file|blob):/i

export function normalizeExternalUrl(raw?: string | null): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined
  const trimmed = stripControlChars(raw).trim()
  if (!trimmed) return undefined
  if (DANGEROUS_SCHEME_REGEX.test(trimmed)) return undefined

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.includes(':') && /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
      ? ''
      : `https://${trimmed.replace(/^\/+/, '')}`

  if (!candidate) return undefined

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined
    }
    return parsed.toString()
  } catch {
    return undefined
  }
}

export function safePublicHref(raw?: string | null): string | undefined {
  if (!raw || typeof raw !== 'string') return undefined
  const trimmed = stripControlChars(raw).trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }
  return normalizeExternalUrl(trimmed)
}

export function sanitizeSocialLinks(
  links: SchoolSocialLinks,
): Record<string, string> {
  const urlKeys = new Set([
    'erpLoginUrl',
    'facebook',
    'youtube',
    'instagram',
    'linkedin',
    'twitter',
    'website',
  ])

  const result: Record<string, string> = {}

  Object.entries(links).forEach(([key, val]) => {
    if (typeof val !== 'string') return
    const trimmed = val.trim()
    if (!trimmed) return
    if (urlKeys.has(key)) {
      const normalized = normalizeExternalUrl(trimmed)
      if (normalized) result[key] = normalized
    } else {
      result[key] = trimmed
    }
  })

  return result
}
