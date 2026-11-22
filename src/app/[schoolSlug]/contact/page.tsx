import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { PublicContactForm } from '@/components/public-site/PublicContactForm'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function ContactPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const floatingCfg = siteData.settings?.notificationPreferences?._floatingContact
  const allowAdmissions = siteData.settings?.allowPublicAdmission ?? true
  const customPhone =
    floatingCfg?.callNumber || siteData.settings?.supportPhone || siteData.profile?.phone
  const customWhatsapp =
    floatingCfg?.whatsappNumber || siteData.profile?.socialLinks?.whatsapp || customPhone

  return (
    <main className="inner-page bg-slate-50/70">
      <section className="inner-hero">
        <span>GET IN TOUCH</span>
        <h1>We would love to hear from you.</h1>
        <p>
          Reach out to our admissions department, schedule a campus visit, or contact our administrative office with any questions.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Contact Us
        </div>
      </section>

      <PublicContactForm
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
        profile={
          siteData.profile
            ? {
                ...siteData.profile,
                phone: customPhone || siteData.profile.phone,
                socialLinks: {
                  ...(siteData.profile.socialLinks || {}),
                  ...(customWhatsapp ? { whatsapp: customWhatsapp } : {}),
                },
              }
            : undefined
        }
        allowAdmissions={allowAdmissions}
      />
    </main>
  )
}
