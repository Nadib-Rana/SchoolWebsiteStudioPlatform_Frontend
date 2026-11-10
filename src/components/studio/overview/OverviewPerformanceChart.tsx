'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function OverviewPerformanceChart() {
  const { setView } = useStudio()

  return (
    <div className="card performance-card">
      <div className="card-title">
        <div>
          <h3>Website performance</h3>
          <p>Visitors over the last 30 days</p>
        </div>
        <button
          type="button"
          className="select-button"
          onClick={() => setView('analytics')}
          title="View full analytics"
        >
          Last 30 days <Icon name="chevron" size={13} />
        </button>
      </div>
      <div className="chart-summary">
        <strong>12,842</strong>
        <span>+18.4%</span>
        <small>vs. previous period</small>
      </div>
      <div className="chart">
        <div className="grid-line l1" />
        <div className="grid-line l2" />
        <div className="grid-line l3" />
        <svg viewBox="0 0 700 170" preserveAspectRatio="none">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity=".2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="area"
            d="M0 145 C40 138 55 100 95 112 S155 135 190 94 S245 70 280 89 S335 112 370 67 S430 40 465 58 S525 88 560 48 S625 20 700 30 L700 170 L0 170Z"
          />
          <path
            className="line"
            d="M0 145 C40 138 55 100 95 112 S155 135 190 94 S245 70 280 89 S335 112 370 67 S430 40 465 58 S525 88 560 48 S625 20 700 30"
          />
        </svg>
        <div className="chart-labels">
          <span>Apr 14</span>
          <span>Apr 20</span>
          <span>Apr 26</span>
          <span>May 2</span>
          <span>May 8</span>
          <span>May 12</span>
        </div>
      </div>
    </div>
  )
}
