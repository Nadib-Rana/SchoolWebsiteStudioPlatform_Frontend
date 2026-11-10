'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import type { EventData } from '@/lib/public-site'

interface EventsDirectoryProps {
  events: EventData[]
  schoolSlug: string
  schoolName?: string
}

export function EventsDirectory({
  events,
  schoolSlug,
}: EventsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    const set = new Set<string>()
    events.forEach((ev) => {
      if (ev.category) set.add(ev.category.trim())
    })
    return Array.from(set).sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCat =
        selectedCategory === 'ALL' ||
        ev.category?.toLowerCase() === selectedCategory.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q) ||
        ev.venue?.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [events, selectedCategory, searchQuery])

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      const day = d.getDate().toString().padStart(2, '0')
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      const year = d.getFullYear()
      return { day, month, year }
    } catch {
      return { day: '01', month: 'JAN', year: 2025 }
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
            style={{ background: selectedCategory === 'ALL' ? 'var(--navy, #1e3a8a)' : undefined }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              selectedCategory === 'ALL' ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Events ({events.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{ background: selectedCategory === cat ? 'var(--navy, #1e3a8a)' : undefined }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                selectedCategory === cat ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search calendar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={16} />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => {
            const { day, month, year } = formatEventDate(ev.eventDate)
            return (
              <article
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-blue-900 text-white flex flex-col items-center justify-center font-serif shadow-sm">
                        <strong className="text-xl font-bold leading-none">{day}</strong>
                        <small className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300">
                          {month}
                        </small>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                          {ev.category}
                        </span>
                        <small className="block text-xs text-slate-500 mt-1">
                          {year}
                        </small>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
                    <Link
                      href={`/${schoolSlug}/events/${ev.id}`}
                      className="hover:text-blue-900 transition-colors"
                    >
                      {ev.title}
                    </Link>
                  </h2>

                  {ev.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {ev.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Icon name="clock" size={13} />
                    <span>{ev.time || 'All Day'}</span>
                    {ev.venue && (
                      <span className="before:content-['•'] before:mx-1 text-slate-600">
                        {ev.venue}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/${schoolSlug}/events/${ev.id}`}
                    style={{ color: 'var(--navy, #1e3a8a)' }}
                    className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                  >
                    Details <Icon name="arrow" size={12} />
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-base font-medium">
            No events found matching your criteria.
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
