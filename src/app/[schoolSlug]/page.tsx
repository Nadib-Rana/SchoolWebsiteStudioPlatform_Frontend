import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { PublicHome } from '@/components/public-site/PublicHome'
import type { SchoolTheme } from '@/types/theme'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function SchoolHomePage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const rawTheme = siteData.theme?.activeTheme || 'classic'
  const cleanTheme = (
    rawTheme.startsWith('theme-') ? rawTheme.replace('theme-', '') : rawTheme
  ) as SchoolTheme

  return (
    <PublicHome
      schoolSlug={schoolSlug}
      schoolData={siteData}
      theme={cleanTheme}
    />
  )
}
