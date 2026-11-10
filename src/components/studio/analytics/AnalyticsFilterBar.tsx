'use client'

import { AnalyticsData, TimeFilter } from './analytics.types'

interface AnalyticsFilterBarProps {
  activeFilter: TimeFilter
  onFilterChange: (filter: TimeFilter) => void
  dateRange: string
  loading: boolean
  onRefresh: () => void
  data: AnalyticsData | null
}

export function AnalyticsFilterBar({
  activeFilter,
  onFilterChange,
  dateRange,
  loading,
  onRefresh,
  data,
}: AnalyticsFilterBarProps) {
  const filters: TimeFilter[] = ['Today', '7 days', '30 days', '90 days']

  const handleExportCsv = () => {
    if (!data) return
    const rows: string[] = []

    rows.push('--- DAILY TRAFFIC ---')
    rows.push('Date,Page Views,Unique Visitors')
    data.dailyRecords.forEach((r) => {
      rows.push(`"${r.date}",${r.pageViews},${r.uniqueVisitors}`)
    })

    rows.push('\n--- POPULAR PAGES ---')
    rows.push('Title,Path,Views,Percentage')
    data.topPages.forEach((p) => {
      rows.push(`"${p.title.replace(/"/g, '""')}","${p.path}",${p.views},${p.percentage}%`)
    })

    rows.push('\n--- TRAFFIC SOURCES ---')
    rows.push('Source,Visitors,Percentage')
    data.trafficSources.forEach((s) => {
      rows.push(`"${s.source.replace(/"/g, '""')}",${s.count},${s.percentage}%`)
    })

    rows.push('\n--- DEVICE BREAKDOWN ---')
    rows.push('Device,Visits,Percentage')
    rows.push(`Mobile,${data.deviceBreakdown.mobile},${data.deviceBreakdown.mobilePct}%`)
    rows.push(`Desktop,${data.deviceBreakdown.desktop},${data.deviceBreakdown.desktopPct}%`)
    rows.push(`Tablet,${data.deviceBreakdown.tablet},${data.deviceBreakdown.tabletPct}%`)

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-report-${activeFilter.replace(/\s+/g, '-').toLowerCase()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="analytics-filter flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="bg-slate-200/80 p-0.5 rounded-md inline-flex">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-150 ${
                activeFilter === filter
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-600 font-medium ml-2">{dateRange}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          title="Refresh statistics"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={!data}
          className="text-xs text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>
    </div>
  )
}
