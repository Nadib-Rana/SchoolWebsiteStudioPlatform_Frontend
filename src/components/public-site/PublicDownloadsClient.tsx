'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import type { NoticeData } from '@/lib/public-site-types'
import { safePublicHref } from '@/lib/social-links'

interface PublicDownloadsClientProps {
  schoolSlug: string
  schoolName: string
  notices: NoticeData[]
}

export function PublicDownloadsClient({
  schoolSlug,
  schoolName,
  notices,
}: PublicDownloadsClientProps) {
  const downloadableItems = useMemo(
    () =>
      (notices || [])
        .filter((n) => Boolean(n.fileUrl && n.fileUrl.trim()))
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime(),
        ),
    [notices],
  )

  const categories = useMemo(() => {
    const set = new Set<string>(['All'])
    downloadableItems.forEach((n) => {
      if (n.category) set.add(n.category)
    })
    return Array.from(set)
  }, [downloadableItems])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return downloadableItems.filter((item) => {
      const catMatch =
        selectedCategory === 'All' || item.category === selectedCategory
      const queryMatch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      return catMatch && queryMatch
    })
  }, [downloadableItems, selectedCategory, searchQuery])

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Search & Category Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={
                  active ? { background: 'var(--navy, #102f58)' } : undefined
                }
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search routine, syllabus, PDF..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={14} />
          </span>
        </div>
      </div>

      {/* Downloadable Files Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Icon name="download" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Public Downloads Found
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
            {downloadableItems.length === 0
              ? `${schoolName} has not published any public PDF routines, syllabi, or circulars yet. Please check back later.`
              : 'No files matched your search or selected category.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {searchQuery || selectedCategory !== 'All' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'var(--navy, #102f58)' }}
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href={`/${schoolSlug}/notices`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'var(--navy, #102f58)' }}
              >
                View All Notices
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(16, 47, 88, 0.08)',
                      color: 'var(--navy, #102f58)',
                    }}
                  >
                    {item.category || 'Document'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(item.publishDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/${schoolSlug}/notices/${item.id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Details →
                </Link>
                <div className="flex items-center gap-2">
                  {(() => {
                    const safeFileUrl = safePublicHref(item.fileUrl)
                    return safeFileUrl ? (
                      <a
                        href={safeFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: 'var(--navy, #102f58)' }}
                      >
                        <Icon name="download" size={13} />
                        Download PDF
                      </a>
                    ) : null
                  })()}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

