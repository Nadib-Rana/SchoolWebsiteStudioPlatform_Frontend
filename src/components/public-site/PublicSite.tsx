'use client'

import { PublicFooter } from '@/components/public-site/PublicFooter'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicHome } from '@/components/public-site/PublicHome'
import { PublicInnerPage } from '@/components/public-site/PublicInnerPage'
import { PublicPreviewBar } from '@/components/public-site/PublicPreviewBar'
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
        const base =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(
          `${base}/public/site?slug=${encodeURIComponent(slug)}`,
        )
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

  const handleThemeChange = (newTheme: SchoolTheme) => {
    setTheme(newTheme)
    setPreviewTheme(newTheme)
  }

  const effectiveSchoolName =
    builderData?.schoolName || siteData?.school?.name || 'Northfield High School'
  const effectiveMotto =
    builderData?.eyebrow || siteData?.profile?.motto || 'LEARN · LEAD · MAKE A DIFFERENCE'

  const showAnnouncement =
    builderData?.showAnnouncement !== undefined
      ? builderData.showAnnouncement
      : true
  const announcementText =
    builderData?.announcementText ||
    '📢 Admissions open for the 2026–2027 Academic Year · Limited seats available!'
  const announcementLink = builderData?.announcementLink || 'Apply now'
  const announcementStyle = builderData?.sectionStyles?.['Announcement bar']

  return (
    <div className={`public-site theme-${theme}`}>
      <PublicPreviewBar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={handleThemeChange}
      />
      {showAnnouncement && (
        <div
          style={{
            background: announcementStyle?.bg || '#0e2447',
            color: '#f8fafc',
            padding:
              announcementStyle?.padding === 'compact'
                ? '8px 20px'
                : announcementStyle?.padding === 'spacious'
                ? '16px 20px'
                : '11px 20px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            ...(announcementStyle?.border
              ? { borderBottom: '2px solid #2563eb' }
              : {}),
            ...(announcementStyle?.shadow === 'subtle'
              ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
              : announcementStyle?.shadow === 'card'
              ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
              : {}),
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
        logoUrl={siteData?.school?.logoUrl || undefined}
        logoLetter={builderData?.logoLetter}
        applyButtonText={builderData?.applyButtonText}
        navigation={siteData?.navigation}
        headerStyle={builderData?.sectionStyles?.['Header']}
      />
      {page === 'Home' ? (
        <PublicHome
          theme={theme}
          setPage={setPage}
          schoolData={siteData}
          schoolSlug={siteData?.school?.slug || 'northfield-high'}
        />
      ) : (
        <PublicInnerPage page={page} setPage={setPage} />
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
        footerStyle={builderData?.sectionStyles?.['Footer']}
      />
    </div>
  )
}
