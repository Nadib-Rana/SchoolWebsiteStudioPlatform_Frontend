'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import type { GoverningMemberData } from '@/lib/public-site-types'

interface GoverningBodySectionProps {
  members: GoverningMemberData[]
  schoolSlug?: string
  schoolName?: string
  mode?: 'full' | 'compact'
}

const CATEGORY_LABELS: Record<string, string> = {
  GOVERNING_BODY: 'Governing Body',
  MANAGING_COMMITTEE: 'Managing Committee (SMC)',
  BOARD_OF_TRUSTEES: 'Board of Trustees',
  ADVISORY_BOARD: 'Advisory Board',
}

function getCategoryLabel(category?: string): string {
  if (!category) return 'Governing Body'
  return CATEGORY_LABELS[category] || category.replace(/_/g, ' ')
}

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'GB'
  )
}

export function GoverningBodySection({
  members,
  schoolSlug,
  schoolName,
  mode = 'compact',
}: GoverningBodySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of members) {
      const cat = m.category || 'GOVERNING_BODY'
      counts.set(cat, (counts.get(cat) || 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [members])

  const sectionHeading = useMemo(() => {
    if (categories.length === 1) {
      return getCategoryLabel(categories[0][0])
    }
    if (
      categories.some(([c]) => c === 'MANAGING_COMMITTEE') &&
      !categories.some(([c]) => c === 'GOVERNING_BODY')
    ) {
      return 'Managing Committee (SMC)'
    }
    return 'Governing Body & Managing Committee'
  }, [categories])

  if (mode === 'compact' && members.length === 0) {
    return null
  }

  if (members.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-base font-semibold text-slate-700">
            Committee member directory is being updated.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {schoolName
              ? `Approved Governing Body & Managing Committee profiles for ${schoolName} will appear here once published.`
              : 'Approved Governing Body & Managing Committee profiles will appear here once published.'}
          </p>
        </div>
      </section>
    )
  }

  const visibleByCategory =
    mode === 'full' && selectedCategory !== 'ALL'
      ? members.filter((m) => (m.category || 'GOVERNING_BODY') === selectedCategory)
      : members

  const featuredMember =
    visibleByCategory.find((m) => m.isFeatured) ||
    visibleByCategory.find((m) => /chairman|president/i.test(m.designation)) ||
    null

  const remainingMembers = featuredMember
    ? visibleByCategory.filter((m) => m.id !== featuredMember.id)
    : visibleByCategory

  const gridMembers =
    mode === 'compact' ? remainingMembers.slice(0, 6) : remainingMembers

  return (
    <section className="py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-kicker">LEADERSHIP &amp; GOVERNANCE</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
              {sectionHeading}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Committed trustees, guardians, and academic leaders guiding policy,
              transparency, and institutional excellence
              {schoolName ? ` at ${schoolName}` : ''}.
            </p>
          </div>

          {mode === 'compact' && schoolSlug && (
            <Link
              href={`/${schoolSlug}/governing-body`}
              style={{
                borderColor: 'var(--navy, #102f58)',
                color: 'var(--navy, #102f58)',
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold hover:bg-slate-50 transition self-start md:self-auto"
            >
              View Full Committee ({members.length}) <Icon name="arrow" size={14} />
            </Link>
          )}
        </div>

        {mode === 'full' && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-5 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              style={{
                background:
                  selectedCategory === 'ALL' ? 'var(--navy, #102f58)' : undefined,
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === 'ALL'
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Committees ({members.length})
            </button>
            {categories.map(([cat, count]) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background:
                    selectedCategory === cat ? 'var(--navy, #102f58)' : undefined,
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {getCategoryLabel(cat)} ({count})
              </button>
            ))}
          </div>
        )}

        {featuredMember && (
          <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-md bg-slate-200 flex items-center justify-center">
                {featuredMember.photoUrl ? (
                  <img
                    src={featuredMember.photoUrl}
                    alt={featuredMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    style={{ background: 'var(--navy, #102f58)' }}
                    className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                  >
                    {getInitials(featuredMember.name)}
                  </span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span
                    style={{
                      background: 'var(--gold, #e3ad3f)',
                      color: '#0f172a',
                    }}
                    className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                  >
                    {featuredMember.designation}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold">
                    {getCategoryLabel(featuredMember.category)}
                    {featuredMember.termPeriod ? ` · ${featuredMember.termPeriod}` : ''}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {featuredMember.name}
                </h3>

                {featuredMember.qualification && (
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    {featuredMember.qualification}
                  </p>
                )}

                {featuredMember.message && (
                  <blockquote className="mt-4 text-slate-700 italic text-sm sm:text-base leading-relaxed border-l-4 border-amber-400 pl-4 text-left">
                    “{featuredMember.message}”
                  </blockquote>
                )}

                {(featuredMember.email || featuredMember.phone) && (
                  <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
                    {featuredMember.phone && <span>Phone: {featuredMember.phone}</span>}
                    {featuredMember.email && <span>Email: {featuredMember.email}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gridMembers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridMembers.map((member, idx) => (
              <article
                key={member.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`faculty-photo fp${idx % 4} w-full h-full flex items-center justify-center text-lg font-bold`}>
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                    {member.designation}
                  </span>
                  <h4 className="mt-1.5 text-base font-bold text-slate-900 leading-snug">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getCategoryLabel(member.category)}
                    {member.termPeriod ? ` · ${member.termPeriod}` : ''}
                  </p>
                  {member.qualification && (
                    <p className="text-xs text-slate-600 italic mt-1">
                      {member.qualification}
                    </p>
                  )}
                  {member.message && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      {member.message}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

