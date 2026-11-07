import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { EventsDirectory } from '@/components/public-site/EventsDirectory'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function EventsPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const events = siteData.events || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>CAMPUS CALENDAR</span>
        <h1>Upcoming Events & Activities</h1>
        <p>
          Discover what is happening across our community — academic symposiums, arts performances, sports fixtures, and family gatherings.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Events Calendar
        </div>
      </section>

      <EventsDirectory
        events={events}
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
      />
    </main>
  )
}
