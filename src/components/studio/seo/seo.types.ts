export interface SeoConfigData {
  siteTitle: string
  tagline: string
  metaDescription: string
  metaKeywords: string[]
  ogImageUrl: string
  googleAnalyticsId: string
  searchConsoleTag: string
  canonicalUrl: string
  sitemapEnabled: boolean
  isIndexed: boolean
  schoolName?: string
  schoolLogo?: string | null
  schoolFavicon?: string | null
}

export interface SeoAuditCheck {
  id: string
  label: string
  status: 'passed' | 'warning' | 'failed'
  score: number
  maxScore: number
  tip: string
}
