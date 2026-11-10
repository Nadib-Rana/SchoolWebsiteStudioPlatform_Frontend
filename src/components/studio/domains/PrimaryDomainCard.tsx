'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface PrimaryDomainCardProps {
  domain?: string
  activeSlug: string
}

export function PrimaryDomainCard({ domain, activeSlug }: PrimaryDomainCardProps) {
  const displayDomain = domain || `${activeSlug}.schoolcanvas.app`

  return (
    <div className="card primary-domain">
      <div className="domain-icon">
        <Icon name="globe" />
      </div>
      <div>
        <span className="live-badge">
          <i /> PRIMARY DOMAIN
        </span>
        <h2>{displayDomain}</h2>
        <p>
          Your custom domain is connected, secure, and routing traffic to your
          school website.
        </p>
        <div className="domain-tags">
          <span>
            <Icon name="check" size={12} /> Verified
          </span>
          <span>
            <Icon name="check" size={12} /> SSL Active
          </span>
          <span>
            <Icon name="check" size={12} /> Edge CDN Active
          </span>
        </div>
      </div>
      <Button
        icon="external"
        onClick={() =>
          window.open(
            displayDomain.startsWith('http')
              ? displayDomain
              : `https://${displayDomain}`,
            '_blank',
          )
        }
      >
        Open website
      </Button>
    </div>
  )
}
