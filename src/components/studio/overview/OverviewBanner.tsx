'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'

export function OverviewBanner() {
  const { setView } = useStudio()

  return (
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
  )
}
