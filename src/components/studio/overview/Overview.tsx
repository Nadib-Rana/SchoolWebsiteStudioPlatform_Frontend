'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { ActivityItem } from '@/components/studio/overview/ActivityItem'
import { MetricCard } from '@/components/studio/overview/MetricCard'
import { QuickAction } from '@/components/studio/overview/QuickAction'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { ActivityItem as ActivityItemType, MetricItem } from '@/types/studio'
import { useEffect, useState } from 'react'

export function Overview() {
  const { setView } = useStudio()
  const [metrics, setMetrics] = useState<MetricItem[]>([])
  const [activities, setActivities] = useState<ActivityItemType[]>([])
  const [schoolName, setSchoolName] = useState('Northfield High School')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const loadOverview = async () => {
      try {
        const res = await api.schools.getOverview()
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
  }, [])

  const defaultMetrics: MetricItem[] = [
    { label: 'Total visitors', value: '12,842', change: '+18.4%', icon: 'users', tone: 'blue' },
    { label: 'Page views', value: '34,291', change: '+12.8%', icon: 'eye', tone: 'violet' },
    { label: 'Published pages', value: '9', detail: '0 drafts', icon: 'file', tone: 'green' },
    { label: 'Upcoming events', value: '4', detail: 'Live scheduled', icon: 'calendar', tone: 'orange' },
  ]

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">STUDIO DASHBOARD</span>
          <h1>Good morning, Amina</h1>
          <p>Here’s how {schoolName} is performing.</p>
        </div>
        <Button kind="secondary" icon="eye" onClick={() => setView('public')}>
          View live site
        </Button>
      </div>

      <section className="site-banner">
        <div
          className="site-preview-thumb"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <span>
            <Icon name="monitor" size={15} />
          </span>
        </div>
        <div className="site-banner-copy">
          <div>
            <span className="live-badge">
              <i /> LIVE
            </span>
            <h2>Your website is making an impression</h2>
            <p>
              All systems are healthy. Your site has gained <strong>18.4%</strong> more
              visitors this month.
            </p>
          </div>
          <Button kind="dark" icon="layout" onClick={() => setView('builder')}>
            Edit website
          </Button>
        </div>
      </section>

      <section className="metric-grid">
        {displayMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="card performance-card">
          <div className="card-title">
            <div>
              <h3>Website performance</h3>
              <p>Visitors over the last 30 days</p>
            </div>
            <button type="button" className="select-button">
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
            <button type="button" className="text-button">
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
              {i === 3 && <button type="button">Fix now</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
