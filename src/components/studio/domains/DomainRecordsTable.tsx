'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import type { DnsRecordItem } from './domain.types'

interface DomainRecordsTableProps {
  records: DnsRecordItem[]
  domainName: string
}

export function DomainRecordsTable({ records, domainName }: DomainRecordsTableProps) {
  const { notify } = useStudio()

  const copyToClipboard = (val: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(val)
      notify(`Copied ${label} to clipboard: ${val}`)
    }
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">DNS Configuration Records for {domainName}</span>
        <span className="text-[11px] text-slate-500">Add these records at your DNS host (Cloudflare, GoDaddy, etc.)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2 px-2">Type</th>
              <th className="py-2 px-2">Host / Name</th>
              <th className="py-2 px-2">Value / Points to</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 font-mono">
            {records.map((r, idx) => {
              const targetVal = r.expected || r.value || ''
              const isVerified = r.status === 'VERIFIED'

              return (
                <tr key={r.type + r.name + idx} className="hover:bg-white/60 transition">
                  <td className="py-2.5 px-2 font-bold text-slate-800">{r.type}</td>
                  <td className="py-2.5 px-2 text-slate-700">{r.name}</td>
                  <td className="py-2.5 px-2 text-slate-900 truncate max-w-[200px]" title={targetVal}>
                    {targetVal}
                  </td>
                  <td className="py-2.5 px-2 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <Icon name={isVerified ? 'check' : 'clock'} size={10} />
                      {isVerified ? 'Verified' : 'Pending DNS'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(targetVal, `${r.type} ${r.name}`)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition"
                      title="Copy target value"
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
