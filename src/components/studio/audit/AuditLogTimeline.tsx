'use client'

import type { AuditLogItem } from './audit.types'

interface AuditLogTimelineProps {
  logs: AuditLogItem[]
  loading: boolean
}

export function AuditLogTimeline({ logs, loading }: AuditLogTimelineProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading audit activity timeline...
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
        No audit log events found matching your criteria.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
      {logs.map((item) => {
        const toneClass =
          item.tone === 'green'
            ? 'bg-emerald-100 text-emerald-800'
            : item.tone === 'blue'
            ? 'bg-blue-100 text-blue-800'
            : item.tone === 'orange'
            ? 'bg-amber-100 text-amber-800'
            : item.tone === 'violet'
            ? 'bg-purple-100 text-purple-800'
            : item.tone === 'rose'
            ? 'bg-rose-100 text-rose-800'
            : 'bg-slate-100 text-slate-700'

        return (
          <div
            key={item.id}
            className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${toneClass}`}
              >
                {item.initials}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    {item.action}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {item.entity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{item.detail}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
                  <span>Actor: {item.userName}</span>
                  {item.userEmail && <span>({item.userEmail})</span>}
                  {item.ipAddress && <span>· IP: {item.ipAddress}</span>}
                </div>
              </div>
            </div>

            <div className="sm:self-center shrink-0 text-right">
              <span className="text-xs font-semibold text-slate-600 block">
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {new Date(item.createdAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
