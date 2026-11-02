'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function DomainManager() {
  const { notify } = useStudio()

  const domains = [
    ['www.northfield.edu', 'Custom domain', 'Active'],
    ['northfield.schoolcanvas.app', 'Platform URL', 'Active'],
    ['admissions.northfield.edu', 'Redirect', 'Pending'],
  ] as const

  return (
    <div className="domain-layout">
      <div className="card primary-domain">
        <div className="domain-icon">
          <Icon name="globe" />
        </div>
        <div>
          <span className="live-badge">
            <i /> PRIMARY DOMAIN
          </span>
          <h2>www.northfield.edu</h2>
          <p>
            Your custom domain is connected, secure, and serving your published
            website.
          </p>
          <div className="domain-tags">
            <span>
              <Icon name="check" size={12} /> Verified
            </span>
            <span>
              <Icon name="check" size={12} /> SSL active
            </span>
            <span>
              <Icon name="check" size={12} /> CDN active
            </span>
          </div>
        </div>
        <Button icon="external">Open website</Button>
      </div>

      <div className="card domain-list">
        <div className="card-title">
          <div>
            <h3>Connected domains</h3>
            <p>Visitors can reach your website through these addresses.</p>
          </div>
        </div>
        {domains.map((x, i) => (
          <div className="domain-row" key={x[0]}>
            <span className={`domain-status ${i === 2 ? 'pending' : ''}`}>
              <Icon name={i === 2 ? 'clock' : 'check'} size={14} />
            </span>
            <div>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
            </div>
            <span className={`state-badge ${x[2].toLowerCase()}`}>
              <i />
              {x[2]}
            </span>
            <button type="button" aria-label={`Options for ${x[0]}`}>
              <Icon name="more" />
            </button>
          </div>
        ))}
      </div>

      <div className="card dns-card">
        <Icon name="help" />
        <div>
          <strong>DNS verification guide</strong>
          <p>
            Add the provided CNAME record at your domain provider. Verification may
            take up to 48 hours.
          </p>
        </div>
        <Button onClick={() => notify('DNS records copied to clipboard')}>
          View DNS records
        </Button>
      </div>
    </div>
  )
}
