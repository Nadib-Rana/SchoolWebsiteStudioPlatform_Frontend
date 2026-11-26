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

  const governingBodyConfig =
    siteData.settings?.notificationPreferences?._governingBody

  if (governingBodyConfig?.enabled === false) {
    notFound()
  }

  const members = siteData.governingMembers || []
  const heroKicker =
    governingBodyConfig?.kicker?.trim() || 'LEADERSHIP & GOVERNANCE'
  const heroTitle =
    governingBodyConfig?.title?.trim() || 'Governing Body & Managing Committee'
  const heroSubtitle =
    governingBodyConfig?.subtitle?.trim() ||
    `Meet the Chairman, trustees, guardian representatives, and committee members guiding ${siteData.school.name}.`

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>{heroKicker}</span>
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
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
        config={governingBodyConfig}
      />
    </main>
  )
}
