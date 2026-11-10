import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicFooter } from '@/components/public-site/PublicFooter'
import { getPublicSiteData } from '@/lib/public-site'

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

  const themeName = siteData.theme?.activeTheme || 'theme-classic'
  const primaryColor = siteData.theme?.primaryColor || '#102f58'
  const accentColor = siteData.theme?.secondaryColor || '#e3ad3f'

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteData.school.name,
    description: siteData.seo?.metaDescription || siteData.profile?.shortBio,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${schoolSlug}`,
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
      className={`public-site ${themeName} min-h-screen flex flex-col`}
      style={
        {
          '--navy': primaryColor,
          '--accent': accentColor,
        } as React.CSSProperties
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <PublicHeader
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        motto={siteData.profile?.motto}
        logoUrl={siteData.school.logoUrl || undefined}
        navigation={siteData.navigation}
      />
      <div className="flex-1">{children}</div>
      <PublicFooter
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        motto={siteData.profile?.motto}
        address={siteData.profile?.address}
        phone={siteData.profile?.phone}
        email={siteData.profile?.email}
      />
    </div>
  )
}
