import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicFooter } from '@/components/public-site/PublicFooter'
import { PublicNoticeTicker } from '@/components/public-site/PublicNoticeTicker'
import { PublicFloatingContact } from '@/components/public-site/PublicFloatingContact'
import { PublicAnalyticsTracker } from '@/components/public-site/PublicAnalyticsTracker'
import { getPublicSiteData } from '@/lib/public-site'
import { parseHomepageSections } from '@/lib/homepage-sections-parser'
import { THEME_CONFIGS } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ schoolSlug: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>
}): Promise<Metadata> {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    return {
      title: 'School Not Found',
    }
  }

  const title =
    siteData.seo?.siteTitle ||
    siteData.seo?.metaTitle ||
    `${siteData.school.name} — Official Website`
  const description =
    siteData.seo?.metaDescription ||
    siteData.seo?.tagline ||
    siteData.profile?.shortBio ||
    siteData.profile?.motto ||
    'Welcome to our school portal'

  const iconUrl = siteData.school.faviconUrl || siteData.school.logoUrl || '/icon.svg'
  const ogImg = siteData.seo?.ogImageUrl || siteData.seo?.ogImage || siteData.school.logoUrl

  return {
    title,
    description,
    keywords: siteData.seo?.metaKeywords || siteData.seo?.keywords,
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    openGraph: {
      title,
      description,
      images: ogImg ? [{ url: ogImg }] : [],
    },
  }
}

export default async function SchoolPublicLayout({
  children,
  params,
}: LayoutProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData || !siteData.school?.isPublished) {
    notFound()
  }

  const rawTheme = siteData.theme?.activeTheme || 'classic'
  const cleanTheme = (
    rawTheme.startsWith('theme-') ? rawTheme.replace(/^theme-/, '') : rawTheme
  ) as SchoolTheme
  const themeClass = `theme-${cleanTheme}`
  const themeCfg = THEME_CONFIGS[cleanTheme] || THEME_CONFIGS.modern

  const primaryColor = siteData.theme?.primaryColor || themeCfg.primaryColor || '#102f58'
  const accentColor = siteData.theme?.secondaryColor || themeCfg.secondaryColor || '#e3ad3f'
  const fontHeading = siteData.theme?.fontHeading || themeCfg.fontHeading || "'DM Serif Display', serif"
  const fontBody = siteData.theme?.fontBody || 'Inter'

  if (siteData.settings?.maintenanceMode) {
    const initial = (siteData.school.name || 'S').charAt(0).toUpperCase()
    return (
      <div
        className={`public-site ${themeClass} min-h-screen flex items-center justify-center p-6`}
        style={
          {
            '--navy': primaryColor,
            '--accent': accentColor,
            '--font-heading': fontHeading,
            fontFamily: `${fontBody}, sans-serif`,
            background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)`,
          } as React.CSSProperties
        }
      >
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center">
          {siteData.school.logoUrl ? (
            <img
              src={siteData.school.logoUrl}
              alt={siteData.school.name}
              className="w-16 h-16 mx-auto mb-5 rounded-2xl object-contain border border-slate-100 bg-slate-50 p-1.5"
            />
          ) : (
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ background: primaryColor }}
            >
              {initial}
            </div>
          )}
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3"
            style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#b45309' }}
          >
            Scheduled Maintenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {siteData.school.name}
          </h1>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Our official school website is currently undergoing scheduled maintenance and updates. We will be back online shortly.
          </p>
          {(siteData.profile?.email || siteData.profile?.phone) && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Need urgent assistance?</p>
              <p>
                {siteData.profile?.phone && <span>{siteData.profile.phone}</span>}
                {siteData.profile?.phone && siteData.profile?.email && <span> · </span>}
                {siteData.profile?.email && (
                  <a
                    href={`mailto:${siteData.profile.email}`}
                    className="underline text-slate-700"
                  >
                    {siteData.profile.email}
                  </a>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const dbSections = parseHomepageSections(siteData)
  const headerBg =
    dbSections.sectionStyles?.['Header']?.bg ||
    siteData.theme?.primaryColor ||
    themeCfg.headerBg ||
    primaryColor
  const showAnnouncement =
    dbSections.showAnnouncement !== undefined
      ? dbSections.showAnnouncement && Boolean(dbSections.announcementText)
      : false
  const announcementBg =
    dbSections.sectionStyles?.['Announcement bar']?.bg || primaryColor
  const footerBg = dbSections.sectionStyles?.['Footer']?.bg || primaryColor
  const allowPublicAdmission = siteData.settings?.allowPublicAdmission ?? true
  const showNoticeTicker = siteData.settings?.showNoticeTicker ?? true
  const showFloatingContact = siteData.settings?.showFloatingContact ?? true
  const floatingCfg = siteData.settings?.notificationPreferences?._floatingContact
  const showWhatsappButton =
    typeof floatingCfg?.showWhatsappButton === 'boolean'
      ? floatingCfg.showWhatsappButton
      : showFloatingContact
  const showCallButton =
    typeof floatingCfg?.showCallButton === 'boolean'
      ? floatingCfg.showCallButton
      : showFloatingContact
  const effectiveCallPhone =
    floatingCfg?.callNumber ||
    siteData.settings?.supportPhone ||
    siteData.profile?.phone ||
    dbSections.footerPhone
  const effectiveWhatsappPhone =
    floatingCfg?.whatsappNumber ||
    siteData.profile?.socialLinks?.whatsapp ||
    effectiveCallPhone

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteData.school.name,
    description: siteData.seo?.metaDescription || siteData.profile?.shortBio,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nadib.ashyshop.com'}/${schoolSlug}`,
    logo: siteData.school.logoUrl || undefined,
    telephone: siteData.profile?.phone || undefined,
    email: siteData.profile?.email || undefined,
    address: siteData.profile?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: siteData.profile.address,
        }
      : undefined,
  }

  return (
    <div
      className={`public-site ${themeClass} min-h-screen flex flex-col`}
      style={
        {
          '--navy': primaryColor,
          '--accent': accentColor,
          '--font-heading': fontHeading,
          '--header-bg': headerBg,
          fontFamily: `${fontBody}, sans-serif`,
        } as React.CSSProperties
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaOrg).replace(/</g, '\\u003c'),
        }}
      />
      <PublicAnalyticsTracker schoolSlug={schoolSlug} />
      {showAnnouncement && dbSections.announcementText && (
        <div
          style={{
            background: announcementBg,
            color: dbSections.sectionStyles?.['Announcement bar']?.textColor || '#f8fafc',
            padding: '10px 20px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>{dbSections.announcementText}</span>
          {allowPublicAdmission && dbSections.announcementLink && (
            <Link
              href={`/${schoolSlug}/admissions`}
              style={{
                color: '#facc15',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              {dbSections.announcementLink} →
            </Link>
          )}
        </div>
      )}
      <PublicHeader
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        motto={siteData.profile?.motto || themeCfg.eyebrow}
        logoUrl={siteData.school.logoUrl || undefined}
        applyButtonText={dbSections.applyButtonText || 'Apply now'}
        showAdmissions={allowPublicAdmission}
        navigation={siteData.navigation}
        headerStyle={{
          ...(dbSections.sectionStyles?.['Header'] || {}),
          bg: headerBg,
        }}
      />
      {showNoticeTicker && (
        <PublicNoticeTicker
          schoolSlug={schoolSlug}
          notices={siteData.notices || []}
        />
      )}
      <div className="flex-1">{children}</div>
      {(showWhatsappButton || showCallButton) && (
        <PublicFloatingContact
          schoolName={siteData.school.name}
          phone={effectiveCallPhone}
          whatsapp={effectiveWhatsappPhone}
          showWhatsapp={showWhatsappButton}
          showCall={showCallButton}
        />
      )}
      <PublicFooter
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        motto={siteData.profile?.motto || themeCfg.eyebrow}
        address={siteData.profile?.address || dbSections.footerAddress}
        phone={siteData.profile?.phone || dbSections.footerPhone}
        email={siteData.profile?.email || dbSections.footerEmail}
        copyright={dbSections.footerCopyright}
        showAdmissions={allowPublicAdmission}
        footerStyle={{
          ...(dbSections.sectionStyles?.['Footer'] || {}),
          bg: footerBg,
        }}
      />
    </div>
  )
}
