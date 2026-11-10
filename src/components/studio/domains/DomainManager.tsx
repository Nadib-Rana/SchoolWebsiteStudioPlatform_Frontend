'use client'

import { useState, useEffect, useCallback } from 'react'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { PrimaryDomainCard } from './PrimaryDomainCard'
import { DomainItemCard } from './DomainItemCard'
import { DnsHelpCard } from './DnsHelpCard'
import type { CustomDomainRecord } from './domain.types'

export function DomainManager() {
  const { notify } = useStudio()
  const activeSlug = api.getActiveSchoolSlug()
  const [subdomain, setSubdomain] = useState(`${activeSlug}.schoolcanvas.app`)
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null)
  const [customDomains, setCustomDomains] = useState<CustomDomainRecord[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadDomains = useCallback(async () => {
    try {
      const res = await api.domains.get()
      const data = res?.data || res
      if (data) {
        if (data.subdomain) setSubdomain(data.subdomain)
        if (data.primaryDomain) setPrimaryDomain(data.primaryDomain)
        if (Array.isArray(data.customDomains)) setCustomDomains(data.customDomains)
      }
    } catch (err) {
      console.warn('Failed to load domains from backend:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDomains()
  }, [loadDomains])

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!clean) return

    setIsAdding(true)
    try {
      await api.domains.add(clean)
      notify(`Domain "${clean}" connected. Please configure DNS records.`)
      setNewDomain('')
      await loadDomains()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add domain.'
      notify(`Error: ${msg}`)
    } finally {
      setIsAdding(false)
    }
  }

  const handleVerify = async (id: string, simulate = false) => {
    setVerifyingId(id)
    try {
      const res = await api.domains.verify(id, simulate)
      const data = res?.data || res
      if (data?.status === 'SSL_ACTIVE' || data?.verificationSuccess) {
        notify('DNS verified successfully! SSL certificate is active.')
      } else {
        notify('DNS records not detected yet. Please allow time for DNS propagation.')
      }
      await loadDomains()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      notify(`Verification error: ${msg}`)
    } finally {
      setVerifyingId(null)
    }
  }

  const handleSetPrimary = async (id: string) => {
    try {
      await api.domains.setPrimary(id)
      notify('Primary domain updated successfully.')
      await loadDomains()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set primary domain'
      notify(`Error: ${msg}`)
    }
  }

  const handleRemove = async (id: string, domainName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${domainName}?`)) return
    try {
      await api.domains.remove(id)
      notify(`Domain ${domainName} disconnected.`)
      await loadDomains()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove domain'
      notify(`Error: ${msg}`)
    }
  }

  const currentPrimary = primaryDomain || subdomain

  return (
    <div className="space-y-6">
      <PrimaryDomainCard domain={currentPrimary} activeSlug={activeSlug} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Custom Domains & SSL Routing</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect external domains (e.g. portal.myschool.edu) with automatic 256-bit TLS encryption.
            </p>
          </div>

          <form onSubmit={handleAddDomain} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. portal.myschool.edu"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-xs w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
            />
            <button
              type="submit"
              disabled={isAdding || !newDomain.trim()}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Connect Domain'}
            </button>
          </form>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Default Platform Subdomain */}
          <div className="p-4 flex items-center justify-between bg-slate-50/50">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 font-mono">{subdomain}</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full">
                  Platform Default
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Icon name="check" size={10} />
                  SSL Active
                </span>
              </div>
              <div className="text-xs text-slate-500">Always available free subdomain powered by global edge CDN.</div>
            </div>
            <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Icon name="check" size={14} />
              <span>Active</span>
            </div>
          </div>

          {/* Custom Domains */}
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading connected domains...</div>
          ) : (
            customDomains.map((item) => (
              <DomainItemCard
                key={item.id}
                item={item}
                onVerify={handleVerify}
                onSetPrimary={handleSetPrimary}
                onRemove={handleRemove}
                isVerifying={verifyingId === item.id}
              />
            ))
          )}
        </div>
      </div>

      <DnsHelpCard />
    </div>
  )
}
