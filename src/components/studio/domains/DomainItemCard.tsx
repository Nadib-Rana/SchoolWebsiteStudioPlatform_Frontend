'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import type { CustomDomainRecord } from './domain.types'
import { DomainRecordsTable } from './DomainRecordsTable'

interface DomainItemCardProps {
  item: CustomDomainRecord
  onVerify: (id: string, simulate?: boolean) => Promise<void>
  onSetPrimary: (id: string) => Promise<void>
  onRemove: (id: string, domainName: string) => Promise<void>
  isVerifying: boolean
}

export function DomainItemCard({
  item,
  onVerify,
  onSetPrimary,
  onRemove,
  isVerifying,
}: DomainItemCardProps) {
  const [showDns, setShowDns] = useState(false)
  const isSslActive = item.status === 'SSL_ACTIVE' || item.status === 'VERIFIED'
  const dnsRecords = item.dnsRecords || []

  return (
    <div className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-900 font-mono">{item.domain}</span>
            {item.isPrimary && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full border border-blue-200">
                Primary Domain
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSslActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <Icon name={isSslActive ? 'check' : 'clock'} size={10} />
              {isSslActive ? 'SSL Active (TLS 1.3)' : 'SSL Pending DNS'}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {isSslActive
              ? `Connected and active · Verified ${item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : 'recently'}`
              : 'Awaiting DNS propagation and verification'}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowDns(!showDns)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            <span>{showDns ? 'Hide DNS Records' : 'DNS Records'}</span>
            <Icon name="chevron" size={12} className={showDns ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          <button
            type="button"
            onClick={() => onVerify(item.id, false)}
            disabled={isVerifying}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
          >
            {isVerifying ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="check" size={12} />
            )}
            <span>Verify DNS</span>
          </button>

          {!isSslActive && (
            <button
              type="button"
              onClick={() => onVerify(item.id, true)}
              disabled={isVerifying}
              className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition"
              title="Test verification instantly for demo/sandbox environments"
            >
              Test Verify
            </button>
          )}

          {!item.isPrimary && isSslActive && (
            <button
              type="button"
              onClick={() => onSetPrimary(item.id)}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition"
            >
              Make Primary
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(item.id, item.domain)}
            className="px-2 py-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            title="Disconnect domain"
          >
            <Icon name="close" size={12} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {showDns && (
        <DomainRecordsTable records={dnsRecords} domainName={item.domain} />
      )}
    </div>
  )
}
