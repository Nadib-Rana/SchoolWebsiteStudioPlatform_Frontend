'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function DnsHelpCard() {
  const { notify } = useStudio()

  const copyVal = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    notify(`Copied "${text}" (${label}) to clipboard`)
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="help" size={18} />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h4 className="font-bold text-sm text-white">How to connect your custom school domain</h4>
            <p className="text-xs text-slate-300 mt-1">
              Log into your domain registrar (GoDaddy, Cloudflare, Namecheap, Google Domains) and configure the following records:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">1. Apex Domain (A Record)</span>
              <p className="text-slate-300 mb-2">Host: <code className="text-amber-300">@</code></p>
              <button
                type="button"
                onClick={() => copyVal('76.76.21.21', 'A record IP')}
                className="w-full py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-mono text-[11px] transition text-center"
              >
                76.76.21.21 📋
              </button>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">2. Subdomain / WWW (CNAME)</span>
              <p className="text-slate-300 mb-2">Host: <code className="text-amber-300">www</code></p>
              <button
                type="button"
                onClick={() => copyVal('cname.schoolcanvas.app', 'CNAME target')}
                className="w-full py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-mono text-[11px] transition text-center truncate"
              >
                cname.schoolcanvas.app 📋
              </button>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">3. Automated SSL Certificate</span>
              <p className="text-slate-300 mb-2">TLS 1.3 / 256-Bit SSL</p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Icon name="check" size={12} />
                <span>Auto-issued via Let&apos;s Encrypt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
