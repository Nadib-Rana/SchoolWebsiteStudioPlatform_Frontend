import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { TeachersDirectory } from '@/components/public-site/TeachersDirectory'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function TeachersPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const teachers = siteData.teachers || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>OUR DISTINGUISHED FACULTY</span>
        <h1>Educators who inspire and see the whole child.</h1>
        <p>
          Experienced teachers, mentors, and scholars working together to help every student feel known, supported, and challenged.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Faculty Directory
        </div>
      </section>

      <TeachersDirectory
        teachers={teachers}
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
      />
    </main>
  )
}
