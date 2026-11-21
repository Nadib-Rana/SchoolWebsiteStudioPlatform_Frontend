import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { PublicDownloadsClient } from '@/components/public-site/PublicDownloadsClient'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function DownloadsPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>PUBLIC DOWNLOAD CENTER</span>
        <h1>Routines, Syllabi & Official PDFs</h1>
        <p>
          Access publicly published academic calendars, class & exam routines, syllabi, and downloadable circulars from {siteData.school.name}.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Downloads
        </div>
      </section>

      <PublicDownloadsClient
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        notices={siteData.notices || []}
      />
    </main>
  )
}

