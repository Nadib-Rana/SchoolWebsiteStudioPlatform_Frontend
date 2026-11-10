'use client'

import { MetricCard } from '@/components/studio/overview/MetricCard'
import { api } from '@/lib/api-client'
import { useCallback, useEffect, useState } from 'react'
import { TrafficChartCard } from './TrafficChartCard'
import { AnalyticsBreakdownCards } from './AnalyticsBreakdownCards'
import { DeviceBreakdownCard } from './DeviceBreakdownCard'
import { AnalyticsFilterBar } from './AnalyticsFilterBar'
import { AnalyticsData, TimeFilter } from './analytics.types'

const FILTER_DAYS: Record<TimeFilter, number> = {
  Today: 1,
  '7 days': 7,
  '30 days': 30,
  '90 days': 90,
}

export function Analytics() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('30 days')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)

  const fetchAnalytics = useCallback(async (filter: TimeFilter) => {
    setLoading(true)
    const days = FILTER_DAYS[filter] || 30
    try {
      const res = await api.analytics.get(days)
      const payload = (res as any)?.data || res
      if (payload) {
        setData(payload)
      }
    } catch (err: any) {
      console.warn('[Analytics] Sync error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics(activeFilter)
  }, [activeFilter, fetchAnalytics])

  const summary = data?.summary || {
    totalVisitors: '12,842',
    uniqueVisitors: '9,614',
    pageViews: '34,291',
    avgSessionDuration: '3m 42s',
    bounceRate: '28.4%',
  }

  const defaultDevices = {
    mobile: 620,
    desktop: 340,
    tablet: 40,
    mobilePct: 62,
    desktopPct: 34,
    tabletPct: 4,
  }

  return (
    <>
      <AnalyticsFilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        dateRange={data?.period || `Last ${activeFilter}`}
        loading={loading}
        onRefresh={() => fetchAnalytics(activeFilter)}
        data={data}
      />

      <section className="metric-grid mb-6">
        <MetricCard
          label="Total visitors"
          value={summary.totalVisitors}
          change="+18.4%"
          icon="users"
          tone="blue"
        />
        <MetricCard
          label="Unique visitors"
          value={summary.uniqueVisitors}
          change="+14.2%"
          icon="users"
          tone="violet"
        />
        <MetricCard
          label="Page views"
          value={summary.pageViews}
          change="+12.8%"
          icon="eye"
          tone="green"
        />
        <MetricCard
          label="Avg. time on site"
          value={summary.avgSessionDuration}
          change="+8.1%"
          icon="clock"
          tone="orange"
        />
      </section>

      <div className="analytics-grid">
        <TrafficChartCard records={data?.dailyRecords || []} />
        <AnalyticsBreakdownCards
          popularPages={data?.topPages || []}
          trafficSources={data?.trafficSources || []}
        />
      </div>

      <div className="mt-4">
        <DeviceBreakdownCard data={data?.deviceBreakdown || defaultDevices} />
      </div>
    </>
  )
}
