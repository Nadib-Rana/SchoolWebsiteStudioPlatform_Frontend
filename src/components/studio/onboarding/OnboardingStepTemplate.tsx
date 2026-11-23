'use client'

import { Icon } from '@/components/common/Icon'
import { templates } from '@/config/templates'

interface OnboardingStepTemplateProps {
  selectedTemplateIndex: number
  setSelectedTemplateIndex: (index: number) => void
  onSelectTemplateColors?: (primary: string, accent: string) => void
}

export function OnboardingStepTemplate({
  selectedTemplateIndex,
  setSelectedTemplateIndex,
  onSelectTemplateColors,
}: OnboardingStepTemplateProps) {
  return (
    <>
      <span className="eyebrow">CHOOSE A STARTING POINT</span>
      <h1>Select your first template.</h1>
      <p>
        Your content is independent from your design, so you can switch anytime.
      </p>
      <div className="onboard-templates">
        {templates.map((x, i) => (
          <button
            key={x.name}
            type="button"
            className={selectedTemplateIndex === i ? 'active' : ''}
            onClick={() => {
              setSelectedTemplateIndex(i)
              if (x.colors?.[0] && x.colors?.[1]) {
                onSelectTemplateColors?.(x.colors[0], x.colors[1])
              }
            }}
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
