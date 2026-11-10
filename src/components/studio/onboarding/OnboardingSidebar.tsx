'use client'

import { Icon } from '@/components/common/Icon'
import { ONBOARDING_STEPS } from './onboarding.types'

interface OnboardingSidebarProps {
  step: number
  onStepClick: (targetStep: number) => void
}

export function OnboardingSidebar({ step, onStepClick }: OnboardingSidebarProps) {
  return (
    <aside>
      <span>SETUP PROGRESS</span>
      <h2>Register your school</h2>
      <p>
        Complete these steps to provision your new public school website.
        All settings can be customized later in Studio.
      </p>
      {ONBOARDING_STEPS.map((x, i) => (
        <button
          key={x}
          type="button"
          className={step === i + 1 ? 'active' : step > i + 1 ? 'complete' : ''}
          onClick={() => onStepClick(i + 1)}
        >
          <span>
            {step > i + 1 ? <Icon name="check" size={13} /> : i + 1}
          </span>
          <div>
            <small>STEP 0{i + 1}</small>
            <strong>{x}</strong>
          </div>
        </button>
      ))}
    </aside>
  )
}
