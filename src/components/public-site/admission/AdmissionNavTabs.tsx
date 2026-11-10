'use client'

import { Icon } from '@/components/common/Icon'
import type { TabMode } from './admission-form.types'

interface AdmissionNavTabsProps {
  activeTab: TabMode
  setActiveTab: (tab: TabMode) => void
}

export function AdmissionNavTabs({ activeTab, setActiveTab }: AdmissionNavTabsProps) {
  return (
    <div className="flex border-b border-slate-100 bg-slate-50/70 p-2 gap-2">
      <button
        type="button"
        onClick={() => setActiveTab('apply')}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          activeTab === 'apply'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
        }`}
      >
        <Icon name="check" size={16} /> Online Admission Application
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('track')}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          activeTab === 'track'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
        }`}
      >
        <Icon name="search" size={16} /> Track Application Status
      </button>
    </div>
  )
}
