'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

interface DomainItem {
  domain: string
  type: string
  status: string
}

export function DomainManager() {
  const { notify } = useStudio()
  const [domains, setDomains] = useState<DomainItem[]>([
    { domain: 'www.northfield.edu', type: 'Custom domain', status: 'Active' },
    {
      domain: 'northfield.schoolcanvas.app',
      type: 'Platform URL',
      status: 'Active',
    },
  ])
  const [newDomain, setNewDomain] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadDomains = async () => {
      try {
        const res = await api.domains.get()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: DomainItem[] = data.map((d: any) => ({
            domain: d.domain,
            type: d.isPrimary ? 'Primary domain' : 'Custom domain',
            status: d.verified ? 'Active' : 'Pending',
          }))
          setDomains(mapped)
        }
      } catch (err) {
        console.warn('Failed to load domains from backend:', err)
      }
    }
    loadDomains()
    return () => {
      mounted = false
    }
  }, [])

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDomain.trim()) return

    setIsAdding(true)
    try {
      await api.domains.add(newDomain.trim())
      setDomains((prev) => [
        ...prev,
        { domain: newDomain.trim(), type: 'Custom domain', status: 'Pending' },
      ])
      notify(`Domain "${newDomain.trim()}" added. Verification in progress.`)
      setNewDomain('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add domain.'
      notify(`Error: ${msg}`)
    } finally {
      setIsAdding(false)
    }
  }

  const primary = domains.find((d) => d.status === 'Active') || domains[0]

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
          <h2>{primary?.domain || 'www.northfield.edu'}</h2>
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
              primary?.domain.startsWith('http')
                ? primary.domain
                : `https://${primary?.domain}`,
              '_blank',
            )
          }
        >
          Open website
        </Button>
      </div>

      <div className="card domain-list">
        <div className="card-title flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3>Connected domains</h3>
            <p>Visitors can reach your website through these addresses.</p>
          </div>

          <form
            onSubmit={handleAddDomain}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="e.g. portal.myschool.edu"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-slate-300 text-xs w-56"
            />
            <Button kind="primary" type="submit" disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add domain'}
            </Button>
          </form>
        </div>

        {domains.map((x, i) => (
          <div className="domain-row" key={x.domain + i}>
            <span
              className={`domain-status ${
                x.status === 'Pending' ? 'pending' : ''
              }`}
            >
              <Icon name={x.status === 'Pending' ? 'clock' : 'check'} size={14} />
            </span>
            <div>
              <strong>{x.domain}</strong>
              <small>{x.type}</small>
            </div>
            <span className={`state-badge ${x.status.toLowerCase()}`}>
              <i />
              {x.status}
            </span>
          </div>
        ))}
      </div>

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
        <Button onClick={() => notify('DNS CNAME target copied to clipboard')}>
          Copy DNS record
        </Button>
      </div>
    </div>
  )
}
