import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData, getPublicTeacher } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'

interface PageProps {
  params: Promise<{ schoolSlug: string; teacherId: string }>
}

export default async function TeacherDetailPage({ params }: PageProps) {
  const { schoolSlug, teacherId } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  // Try finding in preloaded site data first, or fetch via public endpoint
  let teacher = siteData.teachers?.find((t) => t.id === teacherId)
  if (!teacher) {
    teacher = (await getPublicTeacher(schoolSlug, teacherId)) || undefined
  }

  if (!teacher) {
    notFound()
  }

  const schoolName = siteData.school.name

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>FACULTY PROFILE</span>
        <h1>{teacher.name}</h1>
        <p>
          {teacher.designation} · {teacher.department}
          {teacher.qualification ? ` · ${teacher.qualification}` : ''}
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} />{' '}
          <Link href={`/${schoolSlug}/teachers`} className="hover:underline">
            Faculty Directory
          </Link>{' '}
          <Icon name="chevron" size={11} /> {teacher.name}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Left Column: Portrait & Quick Stats */}
          <div className="bg-slate-50 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-200">
            {teacher.photoUrl ? (
              <img
                src={teacher.photoUrl}
                alt={teacher.name}
                className="w-44 h-44 rounded-xl object-cover shadow-md mb-6"
              />
            ) : (
              <div className="w-44 h-44 rounded-xl bg-blue-900 text-white flex items-center justify-center font-serif text-5xl font-bold mb-6">
                {teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            )}
            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-1">
              {teacher.name}
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3">
              {teacher.department}
            </span>
            <p className="text-sm font-medium text-slate-700">{teacher.designation}</p>

            <div className="w-full mt-8 pt-6 border-t border-slate-200 text-left space-y-3">
              {teacher.qualification && (
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Qualification
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {teacher.qualification}
                  </p>
                </div>
              )}
              {teacher.email && (
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${teacher.email}`}
                    className="text-xs font-medium text-blue-700 hover:underline break-all"
                  >
                    {teacher.email}
                  </a>
                </div>
              )}
              {teacher.phone && (
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Office Phone
                  </span>
                  <p className="text-xs font-medium text-slate-800">{teacher.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio & Philosophy */}
          <div className="p-8 md:p-12 md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="section-kicker">ABOUT THE EDUCATOR</span>
              <h3 className="text-2xl font-serif text-slate-900 mb-6">
                Commitment to teaching and student growth
              </h3>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
                {teacher.bio ? (
                  teacher.bio.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>
                    {teacher.name} is a dedicated educator within the {teacher.department} department at {schoolName}. With a focus on inspiring critical inquiry and fostering an engaging, supportive learning atmosphere, {teacher.name} guides students toward academic confidence and lifelong curiosity.
                  </p>
                )}
              </div>

              <blockquote className="mt-8 p-4 bg-blue-50/70 border-l-4 border-blue-900 text-slate-800 italic text-sm rounded-r-lg">
                “Every student brings a unique perspective and intellect to our classrooms. Our role is to unlock their potential with mentorship, rigor, and care.”
              </blockquote>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/${schoolSlug}/teachers`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors"
              >
                <Icon name="arrow" size={14} className="rotate-180" /> Back to all faculty
              </Link>
              <Link
                href={`/${schoolSlug}/contact`}
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Contact School Office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
