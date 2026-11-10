'use client'

import { useState } from 'react'
import { DailyAnalyticsRecord } from './analytics.types'
import { buildSmoothPath, computeChartPoints } from './analytics-chart.util'

interface TrafficChartCardProps {
  records: DailyAnalyticsRecord[]
}

export function TrafficChartCard({ records }: TrafficChartCardProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const viewPoints = computeChartPoints(records, 'pageViews', 700, 170, 20)
  const visitorPoints = computeChartPoints(records, 'uniqueVisitors', 700, 170, 20)

  const viewPath = buildSmoothPath(viewPoints)
  const visitorPath = buildSmoothPath(visitorPoints)

  const activeRecord = hoverIndex !== null ? records[hoverIndex] : null
  const activeViewPoint = hoverIndex !== null ? viewPoints[hoverIndex] : null

  return (
    <div className="card performance-card relative">
      <div className="card-title">
        <div>
          <h3>Traffic overview</h3>
          <p>Daily visitors and page views over time</p>
        </div>
        <span className="legend flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-[#2563eb]" /> Page views
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Visitors
          </span>
        </span>
      </div>

      <div className="chart large relative">
        <div className="grid-line l1" />
        <div className="grid-line l2" />
        <div className="grid-line l3" />

        <svg
          viewBox="0 0 700 170"
          preserveAspectRatio="none"
          className="w-full h-[220px] overflow-visible"
        >
          {viewPath && (
            <path
              className="line stroke-[#2563eb] fill-none stroke-[2.5]"
              d={viewPath}
            />
          )}
          {visitorPath && (
            <path
              className="line second stroke-[#8b5cf6] fill-none stroke-[2]"
              d={visitorPath}
            />
          )}

          {viewPoints.map((pt, idx) => (
            <circle
              key={`vp-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === idx ? 6 : 3}
              className="fill-[#2563eb] cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}

          {visitorPoints.map((pt, idx) => (
            <circle
              key={`vis-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === idx ? 5 : 2.5}
              className="fill-[#8b5cf6] cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </svg>

        {activeRecord && activeViewPoint && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -top-2 bg-slate-900/95 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg backdrop-blur-sm border border-slate-700/60"
            style={{ left: `${(activeViewPoint.x / 700) * 100}%` }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-700/50 pb-1 mb-1">
              {activeRecord.formattedDate || activeRecord.date}
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-blue-400">Views: {activeRecord.pageViews.toLocaleString()}</span>
              <span className="text-slate-400">•</span>
              <span className="text-purple-300">Visitors: {activeRecord.uniqueVisitors.toLocaleString()}</span>
            </div>
          </div>
        )}

        {records.length > 1 && (
          <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 px-1">
            <span>{records[0]?.formattedDate || records[0]?.date}</span>
            {records.length > 4 && (
              <span>{records[Math.floor(records.length / 2)]?.formattedDate}</span>
            )}
            <span>{records[records.length - 1]?.formattedDate || records[records.length - 1]?.date}</span>
          </div>
        )}
      </div>
    </div>
  )
}
