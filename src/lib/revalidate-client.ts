export async function revalidatePublicSite(schoolSlug?: string | null) {
  if (typeof window === 'undefined') return
  try {
    const token = localStorage.getItem('studio_token')
    if (!token) return
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schoolSlug: schoolSlug || '' }),
    })
  } catch {
    // Non-blocking best-effort cache invalidation
  }
}
