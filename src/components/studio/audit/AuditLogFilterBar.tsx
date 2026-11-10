'use client'

import { Icon } from '@/components/common/Icon'
import type { AuditCategoryFilter } from './audit.types'

interface AuditLogFilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeCategory: AuditCategoryFilter
  setActiveCategory: (cat: AuditCategoryFilter) => void
  onRefresh: () => void
  onExportCsv: () => void
  totalCount: number
  counts: Record<string, number>
}

const CATEGORIES: { key: AuditCategoryFilter; label: string }[] = [
  { key: 'ALL', label: 'All Activities' },
  { key: 'PUBLISHING', label: 'Publishing & Pages' },
  { key: 'THEME', label: 'Theme & Design' },
  { key: 'DOMAINS', label: 'Domains & DNS' },
  { key: 'MEMBERS', label: 'Staff & Roles' },
  { key: 'COMMUNICATION', label: 'CRM & Inquiries' },
]

export function AuditLogFilterBar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onRefresh,
  onExportCsv,
  totalCount,
  counts,
}: AuditLogFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by action, user, or detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={15} />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            disabled={totalCount === 0}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.key] || 0
          const isActive = activeCategory === cat.key

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
