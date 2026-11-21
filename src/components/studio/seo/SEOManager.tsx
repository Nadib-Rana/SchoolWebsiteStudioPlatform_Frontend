'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { revalidatePublicSite } from '@/lib/revalidate-client'
import type { SeoConfigData } from './seo.types'
import { SeoFormTab } from './SeoFormTab'
import { SeoSearchPreviewCard } from './SeoSearchPreviewCard'
import { SeoAuditScoreCard } from './SeoAuditScoreCard'

function buildDefaultSeo(schoolName?: string): SeoConfigData {
  const name = schoolName || 'Our School'
  return {
    siteTitle: `${name} | Official Website`,
    tagline: `Official academic portal and community hub of ${name}.`,
    metaDescription: `Welcome to ${name}. Explore academic programs, faculty, notices, events, and online admissions.`,
    metaKeywords: [name, 'School', 'Education', 'Academics', 'Admissions'],
    ogImageUrl: '',
    googleAnalyticsId: '',
    searchConsoleTag: '',
    canonicalUrl: '',
    sitemapEnabled: true,
    isIndexed: true,
  }
}

export function SEOManager() {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [seo, setSeo] = useState<SeoConfigData>(() =>
    buildDefaultSeo(currentSchool?.name),
  )
  const [isSaving, setIsSaving] = useState(false)

  const loadSEO = useCallback(async () => {
    const fallback = buildDefaultSeo(currentSchool?.name)
    try {
      const res = await api.seo.get()
      const data = res?.data || res
      if (data) {
        setSeo({
          ...fallback,
          siteTitle: data.siteTitle || data.metaTitle || fallback.siteTitle,
          tagline: data.tagline || fallback.tagline,
          metaDescription: data.metaDescription || fallback.metaDescription,
          metaKeywords: Array.isArray(data.metaKeywords) && data.metaKeywords.length > 0 ? data.metaKeywords : fallback.metaKeywords,
          ogImageUrl: data.ogImageUrl || data.ogImage || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          searchConsoleTag: data.searchConsoleTag || '',
          canonicalUrl: data.canonicalUrl || '',
          sitemapEnabled: typeof data.sitemapEnabled === 'boolean' ? data.sitemapEnabled : true,
          isIndexed: typeof data.isIndexed === 'boolean' ? data.isIndexed : true,
          schoolName: data.schoolName || currentSchool?.name,
          schoolLogo: data.schoolLogo,
          schoolFavicon: data.schoolFavicon,
        })
      } else {
        setSeo(fallback)
      }
    } catch (err) {
      console.warn('Failed to load SEO configuration:', err)
      setSeo(fallback)
    }
  }, [currentSchool?.name])

  useEffect(() => {
    void loadSEO()
  }, [loadSEO, currentSchool?.id, schoolSwitchKey])

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
      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      notify('Search engine optimization & social card settings saved and published!')
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
