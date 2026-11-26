import { MetadataRoute } from 'next'

function resolveSitemapApiUrl(): string {
  const envUrl =
    process.env.INTERNAL_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL
  if (envUrl && !envUrl.includes('localhost:4000') && !envUrl.includes('localhost:3000')) {
    return envUrl.replace(/\/+$/, '')
  }
  return 'https://profilebackendapi.ashyshop.com/api/v1'
}

const API_BASE_URL = resolveSitemapApiUrl()
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://nadib.ashyshop.com'

interface SchoolRecord {
  id: string
  name: string
  slug: string
  updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  try {
    const res = await fetch(`${API_BASE_URL}/public/schools`, {
      next: { revalidate: 3600 },
    })

    if (res.ok) {
      const json = await res.json()
      const schools: SchoolRecord[] = json.data || []

      const subroutes = [
        '',
        '/about',
        '/academics',
        '/admissions',
        '/alumni-verify',
        '/contact',
        '/downloads',
        '/events',
        '/gallery',
        '/governing-body',
        '/notices',
        '/teachers',
      ]

      for (const s of schools) {
        for (const sub of subroutes) {
          entries.push({
            url: `${BASE_URL}/${s.slug}${sub}`,
            lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
            changeFrequency: sub === '' || sub === '/notices' ? 'daily' : 'weekly',
            priority: sub === '' ? 0.9 : 0.7,
          })
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch published schools:', err)
  }

  return entries
}
