'use client'

import { PublicFooter } from '@/components/public-site/PublicFooter'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicHome } from '@/components/public-site/PublicHome'
import { PublicInnerPage } from '@/components/public-site/PublicInnerPage'
import { PublicPreviewBar } from '@/components/public-site/PublicPreviewBar'
import { THEME_CONFIGS } from '@/config/themes'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { API_BASE_URL } from '@/lib/api/api-session'
import type { PublicSiteData } from '@/lib/public-site'
import type { SchoolTheme } from '@/types/theme'
import { loadCustomThemeLocally, subscribeToThemeChanges } from '@/components/studio/theme/theme-sync-helper'
import { loadBuilderStateFromLocal } from '@/components/studio/builder/builder-storage'
import { useState, useEffect } from 'react'

export interface PublicSiteProps {
  initialTheme?: SchoolTheme
}

export function PublicSite({ initialTheme }: PublicSiteProps) {
  const { previewTheme, setPreviewTheme, currentSchool } = useStudio()
  const [theme, setTheme] = useState<SchoolTheme>(initialTheme || previewTheme)
  const [page, setPage] = useState('Home')
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null)
  const [builderData, setBuilderData] = useState<any>(() =>
    loadBuilderStateFromLocal(currentSchool?.id),
  )
  const [customTheme, setCustomTheme] = useState(() => loadCustomThemeLocally())

  useEffect(() => {
    return subscribeToThemeChanges((cfg) => setCustomTheme((prev) => ({ ...prev, ...cfg })))
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadPreviewData = async () => {
      try {
        const cached = loadBuilderStateFromLocal(currentSchool?.id)
        if (cached && isMounted) {
          setBuilderData(cached)
        }

        const slug = currentSchool?.slug || api.getActiveSchoolSlug() || 'northfield-high'
        const base = API_BASE_URL
        const res = await fetch(`${base}/public/site?slug=${encodeURIComponent(slug)}`)
        if (res.ok) {
          const json = await res.json()
          if (json.data && isMounted) {
            setSiteData(json.data)
          }
        }
      } catch (err) {
        console.debug('Preview fallback to local defaults:', err)
      }
    }
    loadPreviewData()
    return () => {
      isMounted = false
    }
  }, [currentSchool?.id, currentSchool?.slug])

  useEffect(() => {
    if (previewTheme && previewTheme !== theme) {
      setTheme(previewTheme)
    }
  }, [previewTheme])

  useEffect(() => {
    const fav = siteData?.school?.faviconUrl || siteData?.school?.logoUrl
    if (fav && typeof document !== 'undefined') {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = fav
    }
  }, [siteData?.school?.faviconUrl, siteData?.school?.logoUrl])

  const handleThemeChange = (newTheme: SchoolTheme) => {
    setTheme(newTheme)
    setPreviewTheme(newTheme)
  }

  const activeCfg = THEME_CONFIGS[theme] || THEME_CONFIGS.modern
  const effectiveSchoolName =
    siteData?.school?.name || currentSchool?.name || builderData?.schoolName || activeCfg.schoolName
  const effectiveMotto = builderData?.eyebrow || siteData?.profile?.motto || activeCfg.eyebrow
  const showAnnouncement = builderData?.showAnnouncement !== undefined ? builderData.showAnnouncement : true
  const announcementText = builderData?.announcementText || activeCfg.announcementText
  const announcementLink = builderData?.announcementLink || 'Apply now'
  const effectivePrimaryColor =
    customTheme?.primaryColor || siteData?.theme?.primaryColor || activeCfg.primaryColor
  const effectiveAnnouncementBg =
    builderData?.sectionStyles?.['Announcement bar']?.bg || effectivePrimaryColor
  const effectiveHeaderBg =
    builderData?.sectionStyles?.['Header']?.bg || effectivePrimaryColor || activeCfg.headerBg

  return (
    <div
      className={`public-site theme-${theme}`}
      style={
        {
          '--navy': effectivePrimaryColor,
          '--accent': customTheme?.secondaryColor || siteData?.theme?.secondaryColor || activeCfg.secondaryColor,
          fontFamily: customTheme?.fontBody ? `${customTheme.fontBody}, sans-serif` : undefined,
        } as React.CSSProperties
      }
    >
      <PublicPreviewBar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={handleThemeChange}
      />
      {showAnnouncement && (
        <div
          style={{
            background: effectiveAnnouncementBg,
            color: builderData?.sectionStyles?.['Announcement bar']?.textColor || '#f8fafc',
            padding: '11px 20px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            transition: 'background 0.3s ease',
          }}
        >
          <span>{announcementText}</span>
          <span
            style={{
              color: '#facc15',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => setPage && setPage('Admission Information')}
          >
            {announcementLink} →
          </span>
        </div>
      )}
      <PublicHeader
        setPage={setPage}
        schoolSlug={siteData?.school?.slug || 'northfield-high'}
        schoolName={effectiveSchoolName}
        motto={effectiveMotto}
        logoUrl={siteData?.school?.logoUrl || currentSchool?.logoUrl || undefined}
        logoLetter={effectiveSchoolName.charAt(0)}
        applyButtonText={builderData?.applyButtonText || 'Apply now'}
        navigation={siteData?.navigation}
        headerStyle={{
          ...(builderData?.sectionStyles?.['Header'] || {}),
          bg: effectiveHeaderBg,
        }}
      />
      {page === 'Home' ? (
        <PublicHome
          theme={theme}
          setPage={setPage}
          schoolData={siteData}
          schoolSlug={siteData?.school?.slug || currentSchool?.slug || 'northfield-high'}
          isPreview
        />
      ) : (
        <PublicInnerPage page={page} setPage={setPage} siteData={siteData} />
      )}
      <PublicFooter
        setPage={setPage}
        schoolSlug={siteData?.school?.slug || 'northfield-high'}
        schoolName={effectiveSchoolName}
        motto={effectiveMotto}
        address={builderData?.footerAddress || siteData?.profile?.address}
        phone={builderData?.footerPhone || siteData?.profile?.phone}
        email={builderData?.footerEmail || siteData?.profile?.email}
        copyright={builderData?.footerCopyright}
        footerStyle={{
          ...(builderData?.sectionStyles?.['Footer'] || {}),
          bg:
            builderData?.sectionStyles?.['Footer']?.bg || effectivePrimaryColor,
        }}
      />
    </div>
  )
}
