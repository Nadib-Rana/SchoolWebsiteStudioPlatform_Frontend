import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData, getPublicNotice } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'

interface PageProps {
  params: Promise<{ schoolSlug: string; noticeId: string }>
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { schoolSlug, noticeId } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  // Preloaded or single fetch
  let notice = siteData.notices?.find((n) => n.id === noticeId)
  if (!notice) {
    notice = (await getPublicNotice(schoolSlug, noticeId)) || undefined
  }

  if (!notice) {
    notFound()
  }

  const formatDate = (dateStr: string) => {
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
        <span>{notice.category?.toUpperCase() || 'OFFICIAL NOTICE'}</span>
        <h1>{notice.title}</h1>
        <p>Published on {formatDate(notice.publishDate)}</p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} />{' '}
          <Link href={`/${schoolSlug}/notices`} className="hover:underline">
            Notices
          </Link>{' '}
          <Icon name="chevron" size={11} /> {notice.title}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                {notice.category}
              </span>
              {notice.isPinned && (
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Pinned
                </span>
              )}
              {notice.priority === 'HIGH' && (
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  Important Notice
                </span>
              )}
            </div>
            <time className="text-xs font-semibold text-slate-500">
              {formatDate(notice.publishDate)}
            </time>
          </div>

          {/* Notice Body */}
          <div className="prose prose-slate max-w-none text-base text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
            {notice.description}
          </div>

          {/* Attachment Box */}
          {notice.fileUrl && (
            <div className="mt-10 p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-sm font-semibold text-slate-900 block">
                  Official Attachment Document
                </strong>
                <span className="text-xs text-slate-500">
                  PDF or image file associated with this notice
                </span>
              </div>
              <a
                href={notice.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors shadow-sm"
              >
                <Icon name="download" size={14} /> Download File
              </a>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
            <Link
              href={`/${schoolSlug}/notices`}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors"
            >
              <Icon name="arrow" size={14} className="rotate-180" /> Back to notices archive
            </Link>
            <Link
              href={`/${schoolSlug}/contact`}
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              Have a question about this notice?
            </Link>
          </div>
        </article>
      </section>
    </main>
  )
}
