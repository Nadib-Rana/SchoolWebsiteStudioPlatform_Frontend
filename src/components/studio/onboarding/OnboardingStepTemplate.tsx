'use client'

import { Icon } from '@/components/common/Icon'
import { templates } from '@/config/templates'

interface OnboardingStepTemplateProps {
  selectedTemplateIndex: number
  setSelectedTemplateIndex: (index: number) => void
}

export function OnboardingStepTemplate({
  selectedTemplateIndex,
  setSelectedTemplateIndex,
}: OnboardingStepTemplateProps) {
  return (
    <>
      <span className="eyebrow">CHOOSE A STARTING POINT</span>
      <h1>Select your first template.</h1>
      <p>
        Your content is independent from your design, so you can switch anytime.
      </p>
      <div className="onboard-templates">
        {templates.slice(0, 3).map((x, i) => (
          <button
            key={x.name}
            type="button"
            className={selectedTemplateIndex === i ? 'active' : ''}
            onClick={() => setSelectedTemplateIndex(i)}
          >
            <div style={{ backgroundImage: `url(${x.image})` }}>
              {selectedTemplateIndex === i && (
                <span>
                  <Icon name="check" size={13} />
                </span>
              )}
            </div>
            <strong>{x.name}</strong>
            <small>{x.category}</small>
          </button>
        ))}
      </div>
    </>
  )
}
