'use client'

import { MetricCard } from '@/components/studio/overview/MetricCard'
import { useState } from 'react'

export function Analytics() {
  const [activeFilter, setActiveFilter] = useState('30 days')
  const filters = ['Today', '7 days', '30 days', '90 days']

  const popularPages = [
    ['Homepage', '/', '12,428'],
    ['Admissions', '/admissions', '6,214'],
    ['Academics', '/academics', '4,871'],
    ['Teachers', '/teachers', '3,492'],
    ['Notices', '/notices', '2,806'],
  ] as const

  const trafficSources = [
    ['Organic search', '48%'],
    ['Direct', '31%'],
    ['Social media', '14%'],
    ['Referrals', '7%'],
  ] as const

  return (
    <>
      <div className="analytics-filter">
        <div>
          {filters.map((x) => (
            <button
              key={x}
              type="button"
              className={activeFilter === x ? 'active' : ''}
              onClick={() => setActiveFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <span>Apr 13 – May 12, 2025</span>
      </div>

      <section className="metric-grid">
        <MetricCard
          label="Total visitors"
          value="12,842"
          change="+18.4%"
          icon="users"
          tone="blue"
        />
        <MetricCard
          label="Unique visitors"
          value="9,614"
          change="+14.2%"
          icon="users"
          tone="violet"
        />
        <MetricCard
          label="Page views"
          value="34,291"
          change="+12.8%"
          icon="eye"
          tone="green"
        />
        <MetricCard
          label="Avg. time on site"
          value="3m 42s"
          change="+8.1%"
          icon="clock"
          tone="orange"
        />
      </section>

      <div className="analytics-grid">
        <div className="card performance-card">
          <div className="card-title">
            <div>
              <h3>Traffic overview</h3>
              <p>Visitors and page views over time</p>
            </div>
            <span className="legend">
              <i />
              Visitors <i />
              Page views
            </span>
          </div>
          <div className="chart large">
            <div className="grid-line l1" />
            <div className="grid-line l2" />
            <div className="grid-line l3" />
            <svg viewBox="0 0 700 170" preserveAspectRatio="none">
              <path
                className="line"
                d="M0 145 C40 138 55 100 95 112 S155 135 190 94 S245 70 280 89 S335 112 370 67 S430 40 465 58 S525 88 560 48 S625 20 700 30"
              />
              <path
                className="line second"
                d="M0 158 C60 140 85 150 125 120 S180 110 220 105 S280 130 330 100 S390 75 440 90 S500 75 550 62 S630 72 700 50"
              />
            </svg>
          </div>
        </div>

        <div className="card popular-pages">
          <div className="card-title">
            <div>
              <h3>Popular pages</h3>
              <p>Most viewed content</p>
            </div>
          </div>
          {popularPages.map((x, i) => (
            <div key={x[0]}>
              <b>{i + 1}</b>
              <span>
                <strong>{x[0]}</strong>
                <small>{x[1]}</small>
              </span>
              <em>{x[2]} views</em>
            </div>
          ))}
        </div>

        <div className="card traffic-sources">
          <div className="card-title">
            <div>
              <h3>Traffic sources</h3>
              <p>How visitors find you</p>
            </div>
          </div>
          {trafficSources.map((x, i) => (
            <div key={x[0]}>
              <span>
                <i className={`source s${i}`} />
                {x[0]}
              </span>
              <strong>{x[1]}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
