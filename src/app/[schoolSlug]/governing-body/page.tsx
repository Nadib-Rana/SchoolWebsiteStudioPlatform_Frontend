import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { GoverningBodySection } from '@/components/public-site/GoverningBodySection'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function GoverningBodyPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const members = siteData.governingMembers || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>LEADERSHIP &amp; GOVERNANCE</span>
        <h1>Governing Body &amp; Managing Committee</h1>
        <p>
          Meet the Chairman, trustees, guardian representatives, and committee members guiding {siteData.school.name}.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Governing Body
        </div>
      </section>

      <GoverningBodySection
        members={members}
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        mode="full"
      />
    </main>
  )
}

