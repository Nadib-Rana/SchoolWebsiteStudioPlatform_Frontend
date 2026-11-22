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
    <main className="inner-page bg-slate-50">
      <section
        className="inner-hero relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--navy, #0b2545) 0%, #0f3d5e 58%, #0d6e6e 100%)',
          color: '#ffffff',
        }}
      >
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
          style={{
            background: 'rgba(20, 184, 166, 0.2)',
            color: '#5eead4',
            border: '1px solid rgba(94, 234, 212, 0.3)',
          }}
        >
          GET IN TOUCH
        </span>
        <h1 className="text-white">We would love to hear from you.</h1>
        <p className="text-slate-200 max-w-2xl">
          Reach out to our admissions department, schedule a campus visit, or contact our administrative office with any questions.
        </p>
        <div className="breadcrumb text-slate-300">
          <Link href={`/${schoolSlug}`} className="text-white hover:underline">
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
