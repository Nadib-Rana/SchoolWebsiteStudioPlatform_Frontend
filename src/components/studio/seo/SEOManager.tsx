'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { SeoConfigData } from './seo.types'
import { SeoFormTab } from './SeoFormTab'
import { SeoSearchPreviewCard } from './SeoSearchPreviewCard'
import { SeoAuditScoreCard } from './SeoAuditScoreCard'

const INITIAL_SEO: SeoConfigData = {
  siteTitle: 'Northfield High School | Inspiring Excellence Since 1984',
  tagline: 'A premier public secondary institution offering AP courses and STEM programs.',
  metaDescription: 'Welcome to Northfield High School. Discover academic opportunities, athletic programs, and our community.',
  metaKeywords: ['Northfield High', 'High School NY', 'AP Program', 'STEM Education', 'Admissions'],
  ogImageUrl: '',
  googleAnalyticsId: '',
  searchConsoleTag: '',
  canonicalUrl: '',
  sitemapEnabled: true,
  isIndexed: true,
}

export function SEOManager() {
  const { notify } = useStudio()
  const [seo, setSeo] = useState<SeoConfigData>(INITIAL_SEO)
  const [isSaving, setIsSaving] = useState(false)

  const loadSEO = useCallback(async () => {
    try {
      const res = await api.seo.get()
      const data = res?.data || res
      if (data) {
        setSeo((prev) => ({
          ...prev,
          siteTitle: data.siteTitle || data.metaTitle || prev.siteTitle,
          tagline: data.tagline || prev.tagline,
          metaDescription: data.metaDescription || prev.metaDescription,
          metaKeywords: Array.isArray(data.metaKeywords) ? data.metaKeywords : prev.metaKeywords,
          ogImageUrl: data.ogImageUrl || data.ogImage || prev.ogImageUrl,
          googleAnalyticsId: data.googleAnalyticsId || prev.googleAnalyticsId,
          searchConsoleTag: data.searchConsoleTag || prev.searchConsoleTag,
          canonicalUrl: data.canonicalUrl || prev.canonicalUrl,
          sitemapEnabled: typeof data.sitemapEnabled === 'boolean' ? data.sitemapEnabled : prev.sitemapEnabled,
          isIndexed: typeof data.isIndexed === 'boolean' ? data.isIndexed : prev.isIndexed,
          schoolName: data.schoolName,
          schoolLogo: data.schoolLogo,
          schoolFavicon: data.schoolFavicon,
        }))
      }
    } catch (err) {
      console.warn('Failed to load SEO configuration:', err)
    }
  }, [])

  useEffect(() => {
    void loadSEO()
  }, [loadSEO])

  const handleUpdateSeo = (updates: Partial<SeoConfigData>) => {
    setSeo((prev) => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.seo.update({
        siteTitle: seo.siteTitle,
        tagline: seo.tagline,
        metaDescription: seo.metaDescription,
        metaKeywords: seo.metaKeywords,
        ogImageUrl: seo.ogImageUrl,
        googleAnalyticsId: seo.googleAnalyticsId,
        searchConsoleTag: seo.searchConsoleTag,
        sitemapEnabled: seo.sitemapEnabled,
      })
      notify('Search engine optimization & social card settings saved successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save SEO settings'
      notify(`Error: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <SeoFormTab
          seo={seo}
          onChange={handleUpdateSeo}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>

      <div className="lg:col-span-5 space-y-6">
        <SeoSearchPreviewCard seo={seo} />
        <SeoAuditScoreCard seo={seo} />
      </div>
    </div>
  )
}
