'use client'

import { PublicFooter } from '@/components/public-site/PublicFooter'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicHome } from '@/components/public-site/PublicHome'
import { PublicInnerPage } from '@/components/public-site/PublicInnerPage'
import { PublicPreviewBar } from '@/components/public-site/PublicPreviewBar'
import { THEME_CONFIGS } from '@/config/themes'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { PublicSiteData } from '@/lib/public-site'
import type { SchoolTheme } from '@/types/theme'
import { useState, useEffect } from 'react'

export interface PublicSiteProps {
  initialTheme?: SchoolTheme
}

export function PublicSite({ initialTheme }: PublicSiteProps) {
  const { previewTheme, setPreviewTheme } = useStudio()
  const [theme, setTheme] = useState<SchoolTheme>(initialTheme || previewTheme)
  const [page, setPage] = useState('Home')
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null)
  const [builderData, setBuilderData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('studio_builder_homepage_data')
        return cached ? JSON.parse(cached) : null
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    let isMounted = true
    const loadPreviewData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('studio_builder_homepage_data')
          if (cached && isMounted) {
            setBuilderData(JSON.parse(cached))
          }
        }

        const slug = api.getActiveSchoolSlug() || 'northfield-high'
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
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
  }, [])

  useEffect(() => {
    if (previewTheme && previewTheme !== theme) {
      setTheme(previewTheme)
    }
  }, [previewTheme])

  const handleThemeChange = (newTheme: SchoolTheme) => {
    setTheme(newTheme)
    setPreviewTheme(newTheme)
  }

  const activeCfg = THEME_CONFIGS[theme] || THEME_CONFIGS.modern
  const isCustomizedForTheme =
    !builderData?.appliedTheme || builderData?.appliedTheme === theme

  const effectiveSchoolName =
    isCustomizedForTheme && builderData?.schoolName
      ? builderData.schoolName
      : activeCfg.schoolName
  const effectiveMotto =
    isCustomizedForTheme && builderData?.eyebrow
      ? builderData.eyebrow
      : activeCfg.eyebrow

  const showAnnouncement =
    builderData?.showAnnouncement !== undefined
      ? builderData.showAnnouncement
      : true
  const announcementText =
    isCustomizedForTheme && builderData?.announcementText
      ? builderData.announcementText
      : activeCfg.announcementText
  const announcementLink = builderData?.announcementLink || 'Apply now'
  const effectiveAnnouncementBg =
    isCustomizedForTheme && builderData?.sectionStyles?.['Announcement bar']?.bg
      ? builderData.sectionStyles['Announcement bar'].bg
      : activeCfg.primaryColor
  const effectiveHeaderBg =
    isCustomizedForTheme && builderData?.sectionStyles?.['Header']?.bg
      ? builderData.sectionStyles['Header'].bg
      : activeCfg.headerBg

  return (
    <div
      className={`public-site theme-${theme}`}
      style={
        {
          '--navy': activeCfg.primaryColor,
          '--accent': activeCfg.secondaryColor,
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
            color: '#f8fafc',
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
        logoUrl={isCustomizedForTheme ? siteData?.school?.logoUrl || undefined : undefined}
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
          schoolSlug={siteData?.school?.slug || 'northfield-high'}
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
          ...(isCustomizedForTheme ? builderData?.sectionStyles?.['Footer'] : {}),
          bg:
            isCustomizedForTheme && builderData?.sectionStyles?.['Footer']?.bg
              ? builderData.sectionStyles['Footer'].bg
              : activeCfg.primaryColor,
        }}
      />
    </div>
  )
}
