'use client'

import { Icon } from '@/components/common/Icon'

interface AdmissionsFilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filterStatus: string
  setFilterStatus: (s: string) => void
  onRefresh: () => void
}

const STATUS_FILTERS = [
  'ALL',
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'ACCEPTED',
  'REJECTED',
  'ENROLLED',
]

export function AdmissionsFilterBar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onRefresh,
}: AdmissionsFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-72">
          <input
            type="text"
            placeholder="Search by student, guardian, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={15} />
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
        >
          Filter
        </button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status === 'ALL' ? 'All Applications' : status.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
