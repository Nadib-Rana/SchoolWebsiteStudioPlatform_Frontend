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
    siteData.seo?.metaTitle ||
    `${siteData.school.name} — Official Website`
  const description =
    siteData.seo?.metaDescription ||
    siteData.profile?.shortBio ||
    siteData.profile?.motto ||
    'Welcome to our school portal'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: siteData.seo?.ogImage ? [{ url: siteData.seo.ogImage }] : [],
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
