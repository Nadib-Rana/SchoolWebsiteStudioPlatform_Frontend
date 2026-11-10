'use client'

import { Icon } from '@/components/common/Icon'

interface AdmissionsFilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filterStatus: string
  setFilterStatus: (s: string) => void
  onRefresh: () => void
  viewMode: 'table' | 'pipeline'
  setViewMode: (mode: 'table' | 'pipeline') => void
  onExportCsv: () => void
  totalCount: number
}

const STATUS_FILTERS = [
  'ALL',
  'SUBMITTED',
  'UNDER_REVIEW',
  'INTERVIEW_SCHEDULED',
  'ACCEPTED',
  'ENROLLED',
  'REJECTED',
]

export function AdmissionsFilterBar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onRefresh,
  viewMode,
  setViewMode,
  onExportCsv,
  totalCount,
}: AdmissionsFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search student, guardian, or ID..."
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
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'pipeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            disabled={totalCount === 0}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
            title="Download applications as CSV"
          >
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status === 'ALL' ? `All (${totalCount})` : status.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
