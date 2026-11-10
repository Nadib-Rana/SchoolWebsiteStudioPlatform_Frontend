'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { SchoolTheme } from '@/types/theme'

interface TemplateItemData {
  theme: SchoolTheme
  name: string
  image: string
  tag?: string
  colors: readonly string[]
  desc: string
  category: string
}

interface TemplateGridCardProps {
  template: TemplateItemData
  isCurrent: boolean
  device: 'monitor' | 'mobile'
  onDeviceChange: (dev: 'monitor' | 'mobile') => void
  onApply: (theme: SchoolTheme, name: string) => void
  onPreview: (theme: SchoolTheme, name: string) => void
}

export function TemplateGridCard({
  template,
  isCurrent,
  device,
  onDeviceChange,
  onApply,
  onPreview,
}: TemplateGridCardProps) {
  return (
    <div className={`template-card ${isCurrent ? 'selected-card' : ''}`}>
      <div
        className={`template-image ${device === 'mobile' ? 'mobile-shot' : ''}`}
        style={{ backgroundImage: `url(${template.image})` }}
      >
        {template.tag && <span>{template.tag}</span>}
        <div
          className="template-devices"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={device === 'monitor' ? 'active' : ''}
            onClick={() => onDeviceChange('monitor')}
            title="Desktop preview"
          >
            <Icon name="monitor" size={14} />
          </button>
          <button
            type="button"
            className={device === 'mobile' ? 'active' : ''}
            onClick={() => onDeviceChange('mobile')}
            title="Mobile preview"
          >
            <Icon name="mobile" size={14} />
          </button>
        </div>
        <div
          className="template-overlay"
          onClick={() => onPreview(template.theme, template.name)}
        >
          <Button
            kind="secondary"
            icon="eye"
            onClick={(e) => {
              e?.stopPropagation?.()
              onPreview(template.theme, template.name)
            }}
          >
            Live preview
          </Button>
        </div>
      </div>
      <div className="template-info">
        <div>
          <div className="template-title">
            <h3>{template.name}</h3>
            <span className="swatches">
              {template.colors.map((c) => (
                <i key={c} style={{ backgroundColor: c }} />
              ))}
            </span>
          </div>
          <p>{template.desc}</p>
          <small>{template.category}</small>
        </div>
        <Button
          kind={isCurrent ? 'primary' : 'secondary'}
          onClick={() => onApply(template.theme, template.name)}
        >
          {isCurrent ? '✓ Current template' : 'Select template'}
        </Button>
      </div>
    </div>
  )
}
