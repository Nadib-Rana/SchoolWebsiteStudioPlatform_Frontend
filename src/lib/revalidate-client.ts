export async function revalidatePublicSite(schoolSlug?: string | null) {
  if (typeof window === 'undefined') return
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolSlug: schoolSlug || '' }),
    })
  } catch {
    // Non-blocking best-effort cache invalidation
  }
}

