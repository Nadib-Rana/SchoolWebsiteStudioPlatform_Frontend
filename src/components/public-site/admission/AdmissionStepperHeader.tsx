'use client'

import { Icon } from '@/components/common/Icon'
import type { Step } from './admission-form.types'

interface AdmissionStepperHeaderProps {
  step: Step
}

const STEPS: Array<{ num: Step; label: string }> = [
  { num: 1, label: 'Student Details' },
  { num: 2, label: 'Guardian Info' },
  { num: 3, label: 'Review & Submit' },
]

export function AdmissionStepperHeader({ step }: AdmissionStepperHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
      {STEPS.map((s) => (
        <div key={s.num} className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step === s.num
                ? 'bg-slate-900 text-white shadow-md'
                : step > s.num
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {step > s.num ? <Icon name="check" size={16} /> : s.num}
          </div>
          <span
            className={`text-xs font-semibold hidden sm:inline ${
              step === s.num ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}
