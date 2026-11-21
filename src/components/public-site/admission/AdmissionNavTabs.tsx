'use client'

import { Icon } from '@/components/common/Icon'
import type { TabMode } from './admission-form.types'

interface AdmissionNavTabsProps {
  activeTab: TabMode
  setActiveTab: (tab: TabMode) => void
}

export function AdmissionNavTabs({ activeTab, setActiveTab }: AdmissionNavTabsProps) {
  return (
    <div className="bg-slate-100/90 p-1.5 border-b border-slate-200/80">
      <div className="grid grid-cols-2 gap-1.5 max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('apply')}
          className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'apply'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
            style={{
              background:
                activeTab === 'apply' ? 'var(--navy, #102f58)' : '#94a3b8',
            }}
          >
            <Icon name="file" size={13} />
          </span>
          <span>New Application</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'track'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
            style={{
              background:
                activeTab === 'track' ? 'var(--navy, #102f58)' : '#94a3b8',
            }}
          >
            <Icon name="search" size={13} />
          </span>
          <span>Track Status</span>
        </button>
      </div>
    </div>
  )
}
