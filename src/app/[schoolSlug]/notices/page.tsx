import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { NoticesDirectory } from '@/components/public-site/NoticesDirectory'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function NoticesPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const notices = siteData.notices || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>OFFICIAL ANNOUNCEMENTS</span>
        <h1>School Notices & Updates</h1>
        <p>
          Important announcements, circulars, schedules, and official notices for students, parents, and community members.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Notices Archive
        </div>
      </section>

      <NoticesDirectory
        notices={notices}
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
      />
    </main>
  )
}
