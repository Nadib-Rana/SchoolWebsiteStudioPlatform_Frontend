import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function SchoolAcademicsPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const schoolName = siteData.school.name
  const profileAcademics = (siteData.profile?.academics as Record<string, string>) || {}

  const curriculum =
    profileAcademics.curriculum ||
    'National Standard Curriculum complemented by international STEM and inquiry-based learning modules.'
  const gradesOffered =
    profileAcademics.gradesOffered || 'Kindergarten through Grade 12'
  const subjectsSummary =
    profileAcademics.subjectsSummary ||
    'Core disciplines in Mathematics, Natural Sciences, Computing & Robotics, Language Arts, Social Sciences, Visual Arts, and Physical Education.'
  const facilitiesOverview =
    profileAcademics.facilitiesOverview ||
    'State-of-the-art physics, chemistry, and biology laboratories, high-speed digital computing center, multimedia library, indoor sports pavilion, and creative arts studio.'
  const achievements =
    profileAcademics.achievementsText ||
    'Consistently ranked in the top academic tier for college readiness, national Olympiad honors, and regional robotics championships.'

  const academicTiers = [
    {
      level: 'Primary Years (Grades 1–5)',
      desc: 'Building fundamental literacy, numerical fluency, scientific curiosity, and emotional intelligence in a collaborative environment.',
      icon: 'sparkle',
    },
    {
      level: 'Middle School (Grades 6–8)',
      desc: 'Developing critical inquiry, analytical writing, laboratory experimentation, and independent research skills.',
      icon: 'layers',
    },
    {
      level: 'Senior Secondary (Grades 9–12)',
      desc: 'Rigorous preparation for university entrance, career pathways, advanced electives, and community leadership initiatives.',
      icon: 'file',
    },
  ]

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>CURRICULUM & SCHOLARSHIP</span>
        <h1>Academic Programs at {schoolName}</h1>
        <p>
          Inspiring students toward intellectual curiosity, critical thinking, and character-driven leadership.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Academics
        </div>
      </section>

      {/* Program Milestones Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <span className="section-kicker">LEARNING FRAMEWORK</span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
          A structured continuum of excellence.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {academicTiers.map((tier) => (
            <div
              key={tier.level}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center mb-4"
                style={{ background: 'var(--navy, #0f172a)' }}
              >
                <Icon name={tier.icon as any} size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{tier.level}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Academic Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Curriculum & Instruction
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Core Educational Standard</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">{curriculum}</p>
            <div className="pt-4 border-t border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Levels Offered
              </span>
              <span className="font-semibold text-slate-900 text-sm">{gradesOffered}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Course Offerings
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Subjects & Specializations</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">{subjectsSummary}</p>
            <div className="pt-4 border-t border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Learning Facilities
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{facilitiesOverview}</p>
            </div>
          </div>
        </div>

        {/* Honors and Accreditations */}
        <div className="mt-8 bg-amber-50/70 border border-amber-200 p-8 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Icon name="sparkle" size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                Recognitions & Accreditations
              </span>
              <h4 className="text-lg font-bold text-slate-900 mb-1">Academic Honors & Distinctions</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{achievements}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="public-cta">
        <span>APPLY TODAY</span>
        <h2>Ready to join the {schoolName} community?</h2>
        <p>
          Online admissions for the upcoming academic year are now open. Start your application in minutes.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link href={`/${schoolSlug}/admissions`} className="hero-primary">
            Apply for Admission <Icon name="arrow" size={15} />
          </Link>
          <Link href={`/${schoolSlug}/contact`} className="hero-secondary">
            Inquire with Admissions <Icon name="arrow" size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}
