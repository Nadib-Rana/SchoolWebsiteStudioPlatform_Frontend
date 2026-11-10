'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import type { TeacherData } from '@/lib/public-site'

interface TeachersDirectoryProps {
  teachers: TeacherData[]
  schoolSlug: string
  schoolName?: string
}

export function TeachersDirectory({
  teachers,
  schoolSlug,
}: TeachersDirectoryProps) {
  const [selectedDept, setSelectedDept] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const departments = useMemo(() => {
    const set = new Set<string>()
    teachers.forEach((t) => {
      if (t.department) set.add(t.department.trim())
    })
    return Array.from(set).sort()
  }, [teachers])

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesDept =
        selectedDept === 'ALL' ||
        t.department?.toLowerCase() === selectedDept.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q) ||
        t.qualification?.toLowerCase().includes(q) ||
        t.department?.toLowerCase().includes(q)
      return matchesDept && matchesSearch
    })
  }, [teachers, selectedDept, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Controls & Filtering Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDept('ALL')}
            style={{ background: selectedDept === 'ALL' ? 'var(--navy, #1e3a8a)' : undefined }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              selectedDept === 'ALL'
                ? 'text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments ({teachers.length})
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              style={{ background: selectedDept === dept ? 'var(--navy, #1e3a8a)' : undefined }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                selectedDept === dept
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={16} />
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <section className="faculty-grid">
          {filteredTeachers.map((t, idx) => (
            <article key={t.id} className="faculty-card group">
              <div className="faculty-photo-wrapper relative overflow-hidden">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    className="faculty-photo object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`faculty-photo fp${idx % 4}`}>
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
              </div>
              <small className="faculty-dept">{t.department?.toUpperCase() || 'GENERAL'}</small>
              <h3 className="faculty-name font-serif text-xl">{t.name}</h3>
              <p className="faculty-designation text-sm text-slate-600 font-medium">
                {t.designation}
              </p>
              {t.qualification && (
                <p className="faculty-qualification text-xs text-slate-500 mt-1 italic">
                  {t.qualification}
                </p>
              )}
              {t.bio && (
                <p className="faculty-bio-snippet text-xs text-slate-600 mt-2 line-clamp-2">
                  {t.bio}
                </p>
              )}
              <Link
                href={`/${schoolSlug}/teachers/${t.id}`}
                style={{ color: 'var(--navy, #1e3a8a)' }}
                className="faculty-link inline-flex items-center gap-1.5 text-xs font-bold mt-4 hover:underline"
              >
                View profile <Icon name="arrow" size={12} />
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-base font-medium">
            No faculty members found matching your criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedDept('ALL')
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
