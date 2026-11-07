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
          allowAdmissions={siteData.settings?.allowPublicAdmission ?? true}
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
      </section>
    </main>
  )
}
