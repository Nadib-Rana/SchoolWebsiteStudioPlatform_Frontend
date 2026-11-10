'use client'

import { MetricCard } from '@/components/studio/overview/MetricCard'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'
import { TrafficChartCard } from './TrafficChartCard'
import { AnalyticsBreakdownCards } from './AnalyticsBreakdownCards'

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
        <TrafficChartCard />
        <AnalyticsBreakdownCards
          popularPages={popularPages}
          trafficSources={trafficSources}
        />
      </div>
    </>
  )
}
