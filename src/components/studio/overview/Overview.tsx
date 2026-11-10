'use client'

import { Button } from '@/components/common/Button'
import { ActivityItem } from '@/components/studio/overview/ActivityItem'
import { MetricCard } from '@/components/studio/overview/MetricCard'
import { QuickAction } from '@/components/studio/overview/QuickAction'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { ActivityItem as ActivityItemType, MetricItem } from '@/types/studio'
import { useEffect, useState } from 'react'
import { OverviewBanner } from './OverviewBanner'
import { OverviewPerformanceChart } from './OverviewPerformanceChart'
import { OverviewHealthCard } from './OverviewHealthCard'

export function Overview() {
  const { setView, user, currentSchool, schoolSwitchKey } = useStudio()
  const [metrics, setMetrics] = useState<MetricItem[]>([])
  const [activities, setActivities] = useState<ActivityItemType[]>([])
  const [schoolName, setSchoolName] = useState(currentSchool?.name || 'School Studio')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const loadOverview = async () => {
      try {
        const activeId = currentSchool?.id || api.getActiveSchoolId()
        const res = await api.schools.getOverview(activeId)
        const data = (res as any)?.data || res
        if (mounted && data) {
          if (data.metrics) setMetrics(data.metrics)
          if (data.recentActivities) setActivities(data.recentActivities)
          if (data.school?.name) setSchoolName(data.school.name)
        }
      } catch (err: any) {
        console.warn('[Overview] Live data sync:', err?.message || 'waiting for authentication')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadOverview()
    return () => {
      mounted = false
    }
  }, [currentSchool?.id, schoolSwitchKey])

  const defaultMetrics: MetricItem[] = [
    { label: 'Total visitors', value: '12,842', change: '+18.4%', icon: 'users', tone: 'blue' },
    { label: 'Page views', value: '34,291', change: '+12.8%', icon: 'eye', tone: 'violet' },
    { label: 'Published pages', value: '9', detail: '0 drafts', icon: 'file', tone: 'green' },
    { label: 'Upcoming events', value: '4', detail: 'Live scheduled', icon: 'calendar', tone: 'orange' },
  ]

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics
  const userGreeting = user?.firstName || 'Admin'
  const activeSchoolName = currentSchool?.name || schoolName
  const activeSlug = currentSchool?.slug || 'northfield-high'

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">STUDIO DASHBOARD</span>
          <h1>Welcome, {userGreeting}</h1>
          <p>Here’s how {activeSchoolName} is performing.</p>
        </div>
        <Button
          kind="secondary"
          icon="eye"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(`/${activeSlug}`, '_blank')
            }
          }}
        >
          View live site
        </Button>
      </div>

      <OverviewBanner />

      <section className="metric-grid">
        {displayMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </section>

      <section className="dashboard-grid">
        <OverviewPerformanceChart />

        <div className="card quick-card">
          <div className="card-title">
            <div>
              <h3>Quick actions</h3>
              <p>Keep your website fresh</p>
            </div>
          </div>
          <div className="quick-grid">
            <QuickAction
              icon="layout"
              label="Edit website"
              tone="blue"
              onClick={() => setView('builder')}
            />
            <QuickAction icon="file" label="New page" tone="violet" />
            <QuickAction icon="bell" label="Add notice" tone="orange" />
            <QuickAction icon="users" label="Add teacher" tone="green" />
            <QuickAction icon="image" label="Upload media" tone="pink" />
            <QuickAction
              icon="eye"
              label="Preview"
              tone="slate"
              onClick={() => setView('public')}
            />
          </div>
        </div>

        <div className="card activity-card">
          <div className="card-title">
            <div>
              <h3>Recent activity</h3>
              <p>Latest updates across your website</p>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => setView('audit-logs')}
              title="View full audit log activity"
            >
              View all
            </button>
          </div>
          {activities.length > 0 ? (
            activities.map((act) => (
              <ActivityItem key={act.title} {...act} />
            ))
          ) : (
            <p className="no-data">No recent activity logged yet.</p>
          )}
        </div>

        <OverviewHealthCard />
      </section>
    </div>
  )
}
