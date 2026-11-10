'use client'

import { DeviceBreakdownData } from './analytics.types'

interface DeviceBreakdownCardProps {
  data: DeviceBreakdownData
}

export function DeviceBreakdownCard({ data }: DeviceBreakdownCardProps) {
  const devices = [
    {
      label: 'Mobile',
      percentage: data.mobilePct,
      count: data.mobile,
      color: 'bg-emerald-500',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Desktop',
      percentage: data.desktopPct,
      count: data.desktop,
      color: 'bg-blue-500',
      badge: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    {
      label: 'Tablet',
      percentage: data.tabletPct,
      count: data.tablet,
      color: 'bg-amber-500',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
    },
  ]

  return (
    <div className="card p-4">
      <div className="card-title mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Device Breakdown</h3>
          <p className="text-xs text-slate-600">Visitor technology & screen formats</p>
        </div>
      </div>

      <div className="space-y-3">
        {devices.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${d.badge}`}>
                  {d.label}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-mono text-[11px]">
                  {d.count.toLocaleString()} visits
                </span>
                <span className="font-bold text-slate-800 w-8 text-right">
                  {d.percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${d.color}`}
                style={{ width: `${Math.min(100, Math.max(0, d.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
