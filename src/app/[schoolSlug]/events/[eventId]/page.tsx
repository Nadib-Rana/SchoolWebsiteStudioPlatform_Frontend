import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData, getPublicEvent } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'

interface PageProps {
  params: Promise<{ schoolSlug: string; eventId: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { schoolSlug, eventId } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  let event = siteData.events?.find((e) => e.id === eventId)
  if (!event) {
    event = (await getPublicEvent(schoolSlug, eventId)) || undefined
  }

  if (!event) {
    notFound()
  }

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>{event.category?.toUpperCase() || 'SCHOOL EVENT'}</span>
        <h1>{event.title}</h1>
        <p>{formatEventDate(event.eventDate)}</p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} />{' '}
          <Link href={`/${schoolSlug}/events`} className="hover:underline">
            Events Calendar
          </Link>{' '}
          <Icon name="chevron" size={11} /> {event.title}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {event.bannerUrl && (
            <div className="w-full h-72 overflow-hidden bg-slate-100">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 mb-8">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Date
                </span>
                <strong className="text-sm font-semibold text-slate-900 block">
                  {formatEventDate(event.eventDate)}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Time
                </span>
                <strong className="text-sm font-semibold text-slate-900 block">
                  {event.time || 'All Day'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Venue & Location
                </span>
                <strong className="text-sm font-semibold text-slate-900 block">
                  {event.venue || 'Main Campus'}
                </strong>
              </div>
            </div>

            {/* Event Description */}
            <div className="prose prose-slate max-w-none text-base text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
              {event.description || (
                <p>
                  Join us for this school community event. All students, parents, and visitors are encouraged to participate and support our learners.
                </p>
              )}
            </div>

            {/* Registration CTA if available */}
            {event.registrationUrl && (
              <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <strong className="text-sm font-bold text-blue-950 block">
                    Event Registration Open
                  </strong>
                  <span className="text-xs text-blue-800">
                    RSVP or reserve your seat online
                  </span>
                </div>
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-950 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Register Now <Icon name="external" size={14} />
                </a>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={`/${schoolSlug}/events`}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors"
              >
                <Icon name="arrow" size={14} className="rotate-180" /> Back to calendar
              </Link>
              <Link
                href={`/${schoolSlug}/contact`}
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Questions about this event?
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
