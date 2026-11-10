'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function DnsHelpCard() {
  const { notify } = useStudio()

  return (
    <div className="card dns-card">
      <Icon name="help" />
      <div>
        <strong>DNS configuration & routing</strong>
        <p>
          Add a CNAME record pointing your subdomain to{' '}
          <code>cname.schoolcanvas.app</code>. SSL certificates are issued
          automatically.
        </p>
      </div>
      <Button
        onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText('cname.schoolcanvas.app')
          }
          notify('Copied "cname.schoolcanvas.app" to clipboard')
        }}
      >
        Copy DNS record
      </Button>
    </div>
  )
}
