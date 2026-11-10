'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function OverviewHealthCard() {
  const { setView } = useStudio()

  return (
    <div className="card checklist-card">
      <div className="card-title">
        <div>
          <h3>Website health</h3>
          <p>4 of 5 recommended tasks complete</p>
        </div>
        <span className="score">92</span>
      </div>
      <div className="progress">
        <span />
      </div>
      {[
        'Custom domain connected',
        'SEO settings configured',
        'Mobile experience optimized',
        'Add social sharing image',
      ].map((x, i) => (
        <div className="check-row" key={x}>
          <span className={i === 3 ? 'todo' : 'done'}>
            {i === 3 ? <Icon name="clock" size={14} /> : <Icon name="check" size={14} />}
          </span>
          <span>{x}</span>
          {i === 3 && (
            <button
              type="button"
              onClick={() => setView('seo')}
              title="Configure SEO & Social sharing"
            >
              Fix now
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
