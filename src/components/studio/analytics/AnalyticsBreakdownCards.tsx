'use client'

import { PageViewItem, TrafficSourceItem } from './analytics.types'

interface AnalyticsBreakdownCardsProps {
  popularPages: PageViewItem[]
  trafficSources: TrafficSourceItem[]
}

const SOURCE_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
]

export function AnalyticsBreakdownCards({
  popularPages,
  trafficSources,
}: AnalyticsBreakdownCardsProps) {
  return (
    <>
      <div className="card popular-pages">
        <div className="card-title">
          <div>
            <h3>Popular pages</h3>
            <p>Most viewed site sections</p>
          </div>
        </div>
        {popularPages.map((page, i) => (
          <div key={page.path || i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0">
            <b className="w-5 text-slate-400 font-mono text-xs">{i + 1}</b>
            <div className="flex-1 min-w-0">
              <strong className="block text-xs font-semibold text-slate-800 truncate">
                {page.title || page.path}
              </strong>
              <small className="block text-[11px] text-slate-600 truncate font-mono">
                {page.path}
              </small>
            </div>
            <div className="text-right">
              <em className="not-italic text-xs font-semibold text-slate-700 block">
                {page.views.toLocaleString()} views
              </em>
              <span className="text-[10px] text-slate-600">
                {page.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card traffic-sources">
        <div className="card-title">
          <div>
            <h3>Traffic sources</h3>
            <p>How visitors find your school</p>
          </div>
        </div>
        {trafficSources.map((source, i) => (
          <div key={source.source || i} className="space-y-1.5 py-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <span className={`w-2 h-2 rounded-full ${SOURCE_COLORS[i % SOURCE_COLORS.length]}`} />
                {source.source}
              </span>
              <div className="flex items-center gap-2">
                {source.count > 0 && (
                  <span className="text-slate-600 text-[11px] font-mono">
                    {source.count.toLocaleString()}
                  </span>
                )}
                <strong className="text-slate-900 font-semibold">{source.percentage}%</strong>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${SOURCE_COLORS[i % SOURCE_COLORS.length]}`}
                style={{ width: `${Math.min(100, Math.max(0, source.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
