'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import type { NoticeData } from '@/lib/public-site'

interface NoticesDirectoryProps {
  notices: NoticeData[]
  schoolSlug: string
  schoolName?: string
}

export function NoticesDirectory({
  notices,
  schoolSlug,
}: NoticesDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    const set = new Set<string>()
    notices.forEach((n) => {
      if (n.category) set.add(n.category.trim())
    })
    return Array.from(set).sort()
  }, [notices])

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesCat =
        selectedCategory === 'ALL' ||
        n.category?.toLowerCase() === selectedCategory.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [notices, selectedCategory, searchQuery])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Notices ({notices.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search notice archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={16} />
          </div>
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length > 0 ? (
        <section className="space-y-4">
          {filteredNotices.map((n) => (
            <article
              key={n.id}
              className={`p-6 bg-white rounded-xl border transition-all hover:shadow-md ${
                n.isPinned
                  ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {n.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Icon name="check" size={10} /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    {n.category}
                  </span>
                  {n.priority === 'HIGH' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <time className="text-xs font-semibold text-slate-600">
                  {formatDate(n.publishDate)}
                </time>
              </div>

              <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
                <Link
                  href={`/${schoolSlug}/notices/${n.slug || n.id}`}
                  className="hover:text-blue-900 transition-colors"
                >
                  {n.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {n.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link
                  href={`/${schoolSlug}/notices/${n.slug || n.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
                >
                  Read full notice <Icon name="arrow" size={12} />
                </Link>

                {n.fileUrl && (
                  <a
                    href={n.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Icon name="download" size={13} /> Attached Document
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-base font-medium">
            No notices found matching your criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL')
              setSearchQuery('')
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-100"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
