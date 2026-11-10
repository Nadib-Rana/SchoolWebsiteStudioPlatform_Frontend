'use client'

import { Icon } from '@/components/common/Icon'

interface InquiryFilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filterStatus: string
  setFilterStatus: (s: string) => void
  onRefresh: () => void
  counts: Record<string, number>
}

const STATUS_OPTIONS = ['ALL', 'NEW', 'READ', 'RESPONDED', 'ARCHIVED']

export function InquiryFilterBar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onRefresh,
  counts,
}: InquiryFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search name, email, subject..."
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
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
          >
            Refresh Inbox
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_OPTIONS.map((status) => {
          const count = counts[status] || 0
          const isActive = filterStatus === status

          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{status === 'ALL' ? 'All Inquiries' : status.replace('_', ' ')}</span>
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
