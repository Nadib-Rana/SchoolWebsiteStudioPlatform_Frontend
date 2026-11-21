import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { PublicAdmissionForm } from '@/components/public-site/PublicAdmissionForm'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function AdmissionsPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const schoolName = siteData.school.name
  const allowPublicAdmission = siteData.settings?.allowPublicAdmission ?? true

  if (!allowPublicAdmission) {
    return (
      <main className="inner-page">
        <section className="inner-hero">
          <span>ENROLLMENT & ADMISSIONS</span>
          <h1>Admissions are currently closed.</h1>
          <p>
            Online student admissions for {schoolName} are temporarily closed and will reopen for the upcoming academic session.
          </p>
          <div className="breadcrumb">
            <Link href={`/${schoolSlug}`} className="hover:underline">
              Home
            </Link>{' '}
            <Icon name="chevron" size={11} /> Admissions
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-8 sm:p-10 text-center">
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ background: 'var(--navy, #102f58)' }}
            >
              <Icon name="calendar" size={26} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Admission Portal Temporarily Unavailable
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Thank you for your interest in {schoolName}. The admissions window is currently closed by the school administration. Please check back later or reach out to our office for upcoming admission dates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              <Link
                href={`/${schoolSlug}`}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--navy, #102f58)' }}
              >
                Back to Home
              </Link>
              <Link
                href={`/${schoolSlug}/contact`}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Contact Admissions Office
              </Link>
            </div>
            {siteData.profile?.email && (
              <p className="text-xs text-slate-500 mt-6">
                Admissions Desk:{' '}
                <a
                  href={`mailto:${siteData.profile.email}`}
                  className="font-semibold text-slate-700 underline"
                >
                  {siteData.profile.email}
                </a>
                {siteData.profile?.phone ? ` · ${siteData.profile.phone}` : ''}
              </p>
            )}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>ENROLLMENT & ADMISSIONS</span>
        <h1>Your journey at {schoolName} starts here.</h1>
        <p>
          We welcome applications from curious, motivated students eager to participate in a challenging and supportive learning environment.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Admissions
        </div>
      </section>

      <section className="admission-content max-w-6xl mx-auto px-6 py-12">
        <div>
          <span className="section-kicker">APPLICATION PROCESS</span>
          <h2>Four clear steps to apply.</h2>
          {[
            [
              '01',
              'Review eligibility and grade requirements',
              'Check age criteria, grade placement milestones, and curriculum prerequisites for incoming students.',
            ],
            [
              '02',
              'Prepare required documents',
              'Gather past academic records, birth certificate/identification, recommendation letters, and applicant photographs.',
            ],
            [
              '03',
              'Submit your application securely',
              'Complete the digital admissions registration form and submit necessary supporting documentation.',
            ],
            [
              '04',
              'Interview and status tracking',
              'Participate in a campus interaction or interview session, and track your application progress with your unique reference code.',
            ],
          ].map((x) => (
            <article key={x[0]}>
              <b>{x[0]}</b>
              <div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
            </article>
          ))}
        </div>

        <aside>
          <span>ADMISSIONS ENROLLMENT</span>
          <strong>Academic Year {new Date().getFullYear()}–{new Date().getFullYear() + 1}</strong>
          <p>
            Applications are currently open across primary, middle, and senior grades, subject to available classroom capacity.
          </p>

          <Link href={`/${schoolSlug}/contact`} className="hero-primary w-full text-center justify-center">
            Inquire with Admissions <Icon name="arrow" size={15} />
          </Link>
          <small className="block text-center mt-3 text-slate-500">
            Or contact the admissions desk directly at{' '}
            <a href={`mailto:${siteData.profile?.email || 'admissions@school.edu'}`} className="underline">
              {siteData.profile?.email || 'admissions@school.edu'}
            </a>
          </small>
        </aside>
      </section>

      {/* Online Application & Application Status Portal */}
      <section className="px-6 py-4 max-w-6xl mx-auto">
        <PublicAdmissionForm
          schoolSlug={schoolSlug}
          schoolName={schoolName}
          logoUrl={siteData.school.logoUrl || undefined}
          address={siteData.profile?.address || undefined}
          phone={siteData.profile?.phone || undefined}
          email={siteData.profile?.email || undefined}
          allowAdmissions={allowPublicAdmission}
        />
      </section>

      <section className="public-cta">
        <span>CAMPUS VISITS</span>
        <h2>Come see learning in action.</h2>
        <p>
          Nothing compares to experiencing the energy and community of {schoolName} firsthand. Book an in-person campus tour today.
        </p>
        <Link href={`/${schoolSlug}/contact`} className="hero-secondary mt-4">
          Book a Campus Tour <Icon name="arrow" size={15} />
        </Link>
        <div className="mt-4">
          <Link
            href={`/${schoolSlug}/alumni-verify`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 underline"
          >
            Looking to verify an Alumni record? Visit the Alumni Verification Portal
          </Link>
        </div>
      </section>
    </main>
  )
}
