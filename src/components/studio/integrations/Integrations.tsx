'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { IconName } from '@/types/studio'
import { useEffect, useState } from 'react'

function IntegrationCard({
  icon,
  title,
  label,
  description,
  items,
  footer,
  action,
  onAction,
}: {
  icon: IconName
  title: string
  label: string
  description: string
  items: string[]
  footer: string
  action: string
  onAction: () => void
}) {
  return (
    <div className="card integration-card">
      <div className="integration-head">
        <span>
          <Icon name={icon} />
        </span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <em>
          <i />
          {label}
        </em>
      </div>
      {items.map((x) => (
        <div className="integration-check" key={x}>
          <span>
            <Icon name="check" size={12} />
          </span>
          {x}
        </div>
      ))}
      <div className="integration-footer">
        <small>{footer}</small>
        <Button onClick={onAction}>
          {action}
        </Button>
      </div>
    </div>
  )
}

export function Integrations() {
  const { notify } = useStudio()
  const [history, setHistory] = useState<Array<[string, string, string]>>([
    ['ERP automatic sync', '36 records reviewed', 'Success · Live connected'],
    ['Admission API health check', 'Gateway responded in 142 ms', 'Healthy · Live'],
    ['ERP teacher import', 'All records up to date', 'Synchronized'],
  ])

  useEffect(() => {
    let mounted = true
    const loadIntegrations = async () => {
      try {
        const res = await api.integrations.get()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mappedLogs: Array<[string, string, string]> = []
          data.forEach((integ: any) => {
            if (Array.isArray(integ.syncLogs)) {
              integ.syncLogs.forEach((l: any) => {
                mappedLogs.push([
                  `${integ.type} ${l.operation || 'sync'}`,
                  l.details || 'Sync completed successfully',
                  `${l.status || 'Success'} · ${new Date(l.createdAt).toLocaleDateString()}`,
                ])
              })
            }
          })
          if (mappedLogs.length > 0) {
            setHistory(mappedLogs)
          }
        }
      } catch (err) {
        console.warn('Failed to load integration logs:', err)
      }
    }
    loadIntegrations()
    return () => {
      mounted = false
    }
  }, [])

  const handleSync = async (type: string) => {
    try {
      await api.integrations.sync(type)
      notify(`${type} synchronization completed and logged to database`)
    } catch (err) {
      console.error('Sync failed:', err)
      notify(`${type} sync failed`)
    }
  }

  return (
    <div className="integration-grid">
      <IntegrationCard
        icon="layers"
        title="School ERP"
        label="Connected"
        description="Sync approved school, academic, and teacher information."
        items={[
          'School information sync',
          'Academic information sync',
          'Approved teacher profiles',
        ]}
        footer="Last synchronized: Live connected"
        action="Sync now"
        onAction={() => handleSync('ERP')}
      />
      <IntegrationCard
        icon="plug"
        title="Admission API Gateway"
        label="Healthy"
        description="Securely send applicants to your existing admission system."
        items={[
          'Gateway connection active',
          'Application URL configured',
          'API health checks passing',
        ]}
        footer="Gateway active on port 4000"
        action="Test connection"
        onAction={() => handleSync('ADMISSION')}
      />
      <div className="card sync-history">
        <div className="card-title">
          <div>
            <h3>Synchronization history</h3>
            <p>Recent activity from connected systems</p>
          </div>
          <button type="button" className="text-button">
            View all
          </button>
        </div>
        {history.map((x, i) => (
          <div className="sync-item" key={x[0] + i}>
            <span className={i === 2 ? 'rev' : 'ok'}>
              <Icon name={i === 2 ? 'clock' : 'check'} size={14} />
            </span>
            <div>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
            </div>
            <span>{x[2]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
