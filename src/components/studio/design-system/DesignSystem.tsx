'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { DesignSystemShowcase } from './DesignSystemShowcase'

export function DesignSystem() {
  const { notify } = useStudio()

  const categories = [
    'Foundations',
    'Colors',
    'Typography',
    'Buttons',
    'Form controls',
    'Badges',
    'Cards',
    'Tables',
    'Feedback',
    'States',
  ]

  const [activeCategory, setActiveCategory] = useState(categories[0])

  const handleCopyDocs = () => {
    const docText = `# SchoolCanvas Design System Tokens
Primary: #2563EB
Ink: #0F172A
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
Typography: Inter (UI) / DM Serif Display (Editorial)
`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(docText)
      notify('Component documentation copied to clipboard!')
    } else {
      notify('Component documentation ready in clipboard')
    }
  }

  return (
    <div className="page-content system-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FOUNDATIONS & COMPONENTS</span>
          <h1>SchoolCanvas design system</h1>
          <p>Reusable patterns for a consistent, accessible product experience.</p>
        </div>
        <Button
          kind="primary"
          onClick={handleCopyDocs}
        >
          Copy documentation
        </Button>
      </div>

      <div className="system-layout">
        <aside className="system-index">
          {categories.map((x) => (
            <button
              type="button"
              className={activeCategory === x ? 'active' : ''}
              key={x}
              onClick={() => setActiveCategory(x)}
            >
              {x}
              <Icon name="chevron" size={12} />
            </button>
          ))}
        </aside>

        <DesignSystemShowcase />
      </div>
    </div>
  )
}
