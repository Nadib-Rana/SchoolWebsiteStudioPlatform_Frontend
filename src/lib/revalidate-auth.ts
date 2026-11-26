const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,120}$/i

export function resolveBackendApiBase(env: Record<string, string | undefined> = process.env): string {
  const raw =
    env.INTERNAL_API_URL ||
    env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:4000/api/v1'
  return raw.trim().replace(/\/+$/, '')
}

export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice('Bearer '.length).trim()
  if (token.length < 16) {
    return null
  }
  return token
}

export function sanitizeRevalidateSlug(rawSlug: unknown): string | null {
  if (typeof rawSlug !== 'string') return null
  const trimmed = rawSlug.trim()
  if (!trimmed || !SLUG_REGEX.test(trimmed)) {
    return null
  }
  return trimmed
}

export function sanitizeRevalidatePaths(
  rawPaths: unknown,
  schoolSlug: string,
): string[] {
  if (!Array.isArray(rawPaths)) return []
  const prefix = `/${schoolSlug}`
  const result: string[] = []
  for (const item of rawPaths) {
    if (typeof item !== 'string') continue
    const trimmed = item.trim()
    if (
      trimmed.startsWith(prefix) &&
      !trimmed.includes('..') &&
      !trimmed.includes('\\') &&
      (trimmed.length === prefix.length || trimmed[prefix.length] === '/')
    ) {
      result.push(trimmed)
    }
  }
  return result
}

export async function verifyBearerTokenWithBackend(
  token: string,
  fetchImpl: typeof fetch = fetch,
  apiBase: string = resolveBackendApiBase(),
): Promise<boolean> {
  try {
    const res = await fetchImpl(`${apiBase}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

