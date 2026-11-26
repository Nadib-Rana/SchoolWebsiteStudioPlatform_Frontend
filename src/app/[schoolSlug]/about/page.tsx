import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { parseHomepageSections } from '@/lib/homepage-sections-parser'
import { Icon } from '@/components/common/Icon'
import { GoverningBodySection } from '@/components/public-site/GoverningBodySection'
import { campusImage } from '@/config/templates'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function SchoolAboutPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const dbSections = parseHomepageSections(siteData)
  const schoolName = siteData.school.name
  const establishedYear = siteData.profile?.established || 1983
  const principalName =
    siteData.profile?.principalName || dbSections.principalName || 'Dr. Farhana Noor'
  const principalTitle =
    siteData.profile?.principalTitle || dbSections.principalTitle || 'Principal & Head of School'
  const principalPhoto =
    siteData.profile?.principalPhotoUrl || dbSections.principalPhoto
  const principalQuote =
    dbSections.principalQuote ||
    '“The true measure of a school is not only what students achieve, but who they become along the way.”'
  const principalBio =
    siteData.profile?.principalBio ||
    `At ${schoolName}, we pair high expectations with genuine care. Our students learn to think deeply, act with integrity, and use their gifts in service of others.`

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>OUR STORY & VALUES</span>
        <h1>Learning with purpose. Growing with confidence.</h1>
        <p>
          {siteData.profile?.shortBio ||
            `For over ${new Date().getFullYear() - establishedYear} years, ${schoolName} has combined academic ambition with a culture of care, belonging, and purposeful growth.`}
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> About School
        </div>
      </section>

      <section className="story-content">
        <div>
          <span className="section-kicker">MISSION & VISION</span>
          <h2>
            Strong foundations.
            <br />
            Open horizons.
          </h2>
          <p>
            {siteData.profile?.missionStatement ||
              `Our educational approach is grounded in high expectations, supportive relationships, and the belief that learning becomes powerful when students understand its purpose.`}
          </p>
          <p>
            {siteData.profile?.visionStatement ||
              `From foundational literacy and numeracy through specialist programs, leadership opportunities, and preparation for life beyond school, each stage builds naturally on the one before it.`}
          </p>
          <blockquote>
            “We prepare young people not only for examinations, but for meaningful lives of curiosity, contribution, and character.”
          </blockquote>
        </div>
        <img
          src={siteData.profile?.coverUrl || siteData.albums?.[0]?.photos?.[0]?.url || campusImage}
          alt={`${schoolName} learning community`}
        />
      </section>

      <section className="principal-home bg-slate-50 border-y border-slate-200">
        <div>
          <span className="section-kicker">FROM OUR PRINCIPAL</span>
          <blockquote>{principalQuote}</blockquote>
          <p>{principalBio}</p>
        </div>
        <aside className="flex flex-col items-center text-center">
          {principalPhoto ? (
            <img
              src={principalPhoto}
              alt={principalName}
              className="principal-portrait-img w-44 h-52 sm:w-48 sm:h-56 rounded-2xl object-cover shadow-lg border-4 border-white ring-1 ring-slate-200/80 mx-auto mb-3"
            />
          ) : (
            <div className="principal-portrait">
              {principalName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
          <strong className="text-lg font-bold text-slate-900 mt-2 block">
            {principalName}
          </strong>
          <span className="text-xs font-medium text-slate-500 mt-1 block">
            {principalTitle}
          </span>
        </aside>
      </section>

      {siteData.settings?.notificationPreferences?._governingBody?.enabled !== false &&
        siteData.settings?.notificationPreferences?._governingBody?.showOnAbout !== false && (
          <GoverningBodySection
            members={siteData.governingMembers || []}
            schoolSlug={schoolSlug}
            schoolName={schoolName}
            mode="compact"
            config={siteData.settings?.notificationPreferences?._governingBody}
          />
        )}

      <section className="facilities-strip">
        {[
          ['Academic Excellence', 'Rigorous curriculum designed for deep understanding.'],
          ['Character & Leadership', 'Nurturing integrity, empathy, and social responsibility.'],
          ['Vibrant Arts & Sports', 'Holistic development through creative and athletic expression.'],
          ['Inclusive Community', 'A safe, supportive environment where every student belongs.'],
        ].map((x, i) => (
          <article key={x[0]}>
            <span>0{i + 1}</span>
            <h3>{x[0]}</h3>
            <p>{x[1]}</p>
          </article>
        ))}
      </section>

      <section className="public-cta">
        <span>JOIN OUR COMMUNITY</span>
        <h2>Experience {schoolName} firsthand.</h2>
        <p>
          We invite prospective families to discover what makes our school unique.
        </p>
        <div className="flex gap-4 mt-6">
          {(siteData.settings?.allowPublicAdmission ?? true) && (
            <Link href={`/${schoolSlug}/admissions`} className="hero-primary">
              Apply for admission <Icon name="external" size={15} />
            </Link>
          )}
          <Link href={`/${schoolSlug}/contact`} className="hero-secondary">
            Schedule a visit <Icon name="arrow" size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}
