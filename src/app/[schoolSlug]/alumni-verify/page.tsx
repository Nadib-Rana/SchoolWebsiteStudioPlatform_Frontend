import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { PublicAlumniVerify } from '@/components/public-site/PublicAlumniVerify'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function AlumniVerifyPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const schoolName = siteData.school.name

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>ALUMNI VERIFICATION</span>
        <h1>Official Alumni Verification Portal</h1>
        <p>
          Verify academic credentials and graduation records for alumni of {schoolName} directly through the school registry.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Alumni Verification
        </div>
      </section>

      <section className="px-6 py-8 max-w-6xl mx-auto">
        <PublicAlumniVerify schoolSlug={schoolSlug} schoolName={schoolName} />
      </section>
    </main>
  )
}

