'use client'

import { Icon } from '@/components/common/Icon'
import type { Step } from './admission-form.types'

interface AdmissionStepperHeaderProps {
  step: Step
}

const STEPS: Array<{ num: Step; label: string; sub: string }> = [
  { num: 1, label: 'Student Details', sub: 'Personal & class' },
  { num: 2, label: 'Guardian Info', sub: 'Parent contact' },
  { num: 3, label: 'Review & Submit', sub: 'Confirm & apply' },
]

export function AdmissionStepperHeader({ step }: AdmissionStepperHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div
          aria-hidden="true"
          className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0"
        />
        <div
          aria-hidden="true"
          className="absolute top-5 left-8 h-0.5 transition-all duration-300 -z-0"
          style={{
            background: 'var(--navy, #102f58)',
            width: step === 1 ? '0%' : step === 2 ? '45%' : 'calc(100% - 4rem)',
          }}
        />

        {STEPS.map((s) => {
          const isDone = step > s.num
          const isCurrent = step === s.num
          return (
            <div
              key={s.num}
              className="relative z-10 flex items-center gap-3 bg-white pr-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCurrent
                    ? 'text-white shadow-md ring-4 ring-slate-900/10'
                    : isDone
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
                style={
                  isCurrent
                    ? { background: 'var(--navy, #102f58)' }
                    : undefined
                }
              >
                {isDone ? <Icon name="check" size={16} /> : s.num}
              </div>
              <div className="hidden sm:block">
                <span
                  className={`text-xs font-bold block ${
                    isCurrent || isDone ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {s.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
