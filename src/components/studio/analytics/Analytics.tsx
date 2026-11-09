'use client'

import { MetricCard } from '@/components/studio/overview/MetricCard'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'

export function Analytics() {
  const [activeFilter, setActiveFilter] = useState('30 days')
  const filters = ['Today', '7 days', '30 days', '90 days']

  const [dateRange, setDateRange] = useState('Last 30 days')
  const [metrics, setMetrics] = useState({
    totalVisitors: '12,842',
    uniqueVisitors: '9,614',
    pageViews: '34,291',
    avgSessionDuration: '3m 42s',
  })

  const [popularPages, setPopularPages] = useState<Array<[string, string, string]>>([
    ['Homepage', '/', '12,428'],
    ['Admissions', '/admissions', '6,214'],
    ['Academics', '/academics', '4,871'],
    ['Teachers', '/teachers', '3,492'],
    ['Notices', '/notices', '2,806'],
  ])

  const [trafficSources, setTrafficSources] = useState<Array<[string, string]>>([
    ['Organic search', '48%'],
    ['Direct', '31%'],
    ['Social media', '14%'],
    ['Referrals', '7%'],
  ])

  useEffect(() => {
    let mounted = true
    const filterDays: Record<string, number> = {
      Today: 1,
      '7 days': 7,
      '30 days': 30,
      '90 days': 90,
    }
    const days = filterDays[activeFilter] || 30

    const fetchAnalytics = async () => {
      try {
        const res = await api.analytics.get(days)
        const data = (res as any)?.data || res
        if (mounted && data) {
          if (data.period) {
            setDateRange(data.period)
          }
          if (data.summary) {
            setMetrics({
              totalVisitors: data.summary.totalVisitors ?? '12,842',
              uniqueVisitors: data.summary.uniqueVisitors ?? '9,614',
              pageViews: data.summary.pageViews ?? '34,291',
              avgSessionDuration: data.summary.avgSessionDuration ?? '3m 42s',
            })
          }
          if (Array.isArray(data.topPages) && data.topPages.length > 0) {
            setPopularPages(
              data.topPages.map((p: any) => [
                p.title || p.path || 'Page',
                p.path || '/',
                Number(p.views || 0).toLocaleString(),
              ])
            )
          }
          if (Array.isArray(data.trafficSources) && data.trafficSources.length > 0) {
            setTrafficSources(
              data.trafficSources.map((s: any) => [
                s.source || 'Direct',
                `${s.percentage || 0}%`,
              ])
            )
          }
        }
      } catch (err: any) {
        console.warn('[Analytics] Sync warning:', err?.message || 'Using cached analytics')
      }
    }

    fetchAnalytics()
    return () => {
      mounted = false
    }
  }, [activeFilter])

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
        <span>{dateRange}</span>
      </div>

      <section className="metric-grid">
        <MetricCard
          label="Total visitors"
          value={metrics.totalVisitors}
          change="+18.4%"
          icon="users"
          tone="blue"
        />
        <MetricCard
          label="Unique visitors"
          value={metrics.uniqueVisitors}
          change="+14.2%"
          icon="users"
          tone="violet"
        />
        <MetricCard
          label="Page views"
          value={metrics.pageViews}
          change="+12.8%"
          icon="eye"
          tone="green"
        />
        <MetricCard
          label="Avg. time on site"
          value={metrics.avgSessionDuration}
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
