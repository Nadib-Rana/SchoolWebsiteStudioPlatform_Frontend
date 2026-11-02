'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { syncHistory } from '@/constants/mock-data'
import { useStudio } from '@/context/StudioContext'
import type { IconName } from '@/types/studio'

function IntegrationCard({
  icon,
  title,
  label,
  description,
  items,
  footer,
  action,
}: {
  icon: IconName
  title: string
  label: string
  description: string
  items: string[]
  footer: string
  action: string
}) {
  const { notify } = useStudio()
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
        <Button onClick={() => notify(`${title}: ${action} successful`)}>
          {action}
        </Button>
      </div>
    </div>
  )
}

export function Integrations() {

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
        footer="Last synchronized 12 minutes ago"
        action="Sync now"
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
        footer="Last health check 2 minutes ago"
        action="Test connection"
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
        {syncHistory.map((x, i) => (
          <div key={x[0]}>
            <span className={i === 2 ? 'warn' : 'ok'}>
              <Icon name={i === 2 ? 'clock' : 'check'} size={14} />
            </span>
            <div>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
            </div>
            <em>{x[2]}</em>
          </div>
        ))}
      </div>
    </div>
  )
}
