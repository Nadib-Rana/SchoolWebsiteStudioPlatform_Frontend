'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api, API_BASE_URL } from '@/lib/api-client'
import type { IconName } from '@/types/studio'
import { useCallback, useEffect, useState } from 'react'

interface ErpCredentialsSummary {
  isServerConfigured?: boolean
  apiKeyHint?: string
  hasApiKey?: boolean
  webhookSecretHint?: string
  hasWebhookSecret?: boolean
  enabled?: boolean
  tenantId?: string
  erpSchoolName?: string
  erpSubdomain?: string
  openClassesCount?: number
  lastVerifiedAt?: string
}

interface IntegrationRecord {
  id: string
  type: string
  name: string
  status: string
  lastSyncAt?: string
  credentials?: ErpCredentialsSummary
  syncHistory?: Array<{
    action?: string
    detail?: string
    timestamp?: string
    status?: string
  }>
}

function IntegrationCard({
  icon,
  title,
  label,
  description,
  items,
  footer,
  action,
  onAction,
  disabled,
}: {
  icon: IconName
  title: string
  label: string
  description: string
  items: string[]
  footer: string
  action: string
  onAction: () => void
  disabled?: boolean
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
        <Button onClick={onAction} disabled={disabled}>
          {action}
        </Button>
      </div>
    </div>
  )
}

export function Integrations() {
  const { notify } = useStudio()
  const [erpRecord, setErpRecord] = useState<IntegrationRecord | null>(null)
  const [gatewayRecord, setGatewayRecord] = useState<IntegrationRecord | null>(null)
  const [history, setHistory] = useState<Array<[string, string, string, string]>>([])

  const [apiKey, setApiKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [copiedWebhook, setCopiedWebhook] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [testBanner, setTestBanner] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const loadIntegrations = useCallback(async () => {
    try {
      const res = await api.integrations.get()
      const data: IntegrationRecord[] = (res as any)?.data || res || []
      if (!Array.isArray(data)) return

      const erp = data.find((i) => i.type === 'SCHOOL_ERP') || null
      const gateway = data.find((i) => i.type === 'ADMISSION_GATEWAY') || null
      setErpRecord(erp)
      setGatewayRecord(gateway)

      if (erp?.credentials) {
        setEnabled(erp.credentials.enabled ?? false)
      }

      const mappedLogs: Array<[string, string, string, string]> = []
      data.forEach((integ) => {
        const logs = Array.isArray(integ.syncHistory) ? integ.syncHistory : []
        logs.forEach((l) => {
          const ts = l.timestamp
            ? isNaN(Date.parse(l.timestamp))
              ? l.timestamp
              : new Date(l.timestamp).toLocaleString()
            : 'Recent'
          mappedLogs.push([
            l.action || `${integ.name} sync`,
            l.detail || 'Completed',
            `${l.status || 'SUCCESS'} · ${ts}`,
            (l.status || 'SUCCESS').toUpperCase(),
          ])
        })
      })
      setHistory(mappedLogs)
    } catch (err) {
      console.warn('Failed to load integrations:', err)
    }
  }, [])

  useEffect(() => {
    loadIntegrations()
  }, [loadIntegrations])

  const handleSaveErpConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim() && !creds?.hasApiKey) {
      setTestBanner({
        type: 'error',
        text: 'Please enter your ERP Website API Key (x-website-key).',
      })
      return
    }
    setIsSaving(true)
    setTestBanner(null)
    try {
      const credentials: Record<string, any> = {
        enabled,
      }
      if (apiKey.trim()) {
        credentials.apiKey = apiKey.trim()
      }
      if (webhookSecret.trim()) {
        credentials.webhookSecret = webhookSecret.trim()
      }

      await api.integrations.configure({
        type: 'SCHOOL_ERP',
        name: 'School ERP System',
        status: enabled ? 'CONNECTED' : 'INACTIVE',
        credentials,
      })
      setApiKey('')
      setWebhookSecret('')
      notify('School ERP configuration saved securely')
      setTestBanner({
        type: 'success',
        text: 'Configuration saved. Click "Test Live Connection" to verify your API key with the ERP.',
      })
      await loadIntegrations()
    } catch (err: any) {
      const msg = err?.message || 'Failed to save ERP configuration'
      setTestBanner({ type: 'error', text: msg })
      notify(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestErpConnection = async () => {
    setIsTesting(true)
    setTestBanner(null)
    try {
      const payload: { apiKey?: string; enabled?: boolean } = {
        enabled,
      }
      if (apiKey.trim()) payload.apiKey = apiKey.trim()

      const res = await api.integrations.testErp(payload)
      const data = (res as any)?.data || res
      setApiKey('')
      const summary = `Connected to ${data?.schoolName || 'School ERP'} (Tenant: ${data?.tenantId || 'Verified'}, Open Classes: ${data?.openClassesCount ?? 0})`
      setTestBanner({ type: 'success', text: summary })
      notify('ERP live connection verified!')
      await loadIntegrations()
    } catch (err: any) {
      const msg = err?.message || 'ERP connection test failed'
      setTestBanner({ type: 'error', text: msg })
      notify(msg)
      await loadIntegrations()
    } finally {
      setIsTesting(false)
    }
  }

  const handleSync = async (type: 'SCHOOL_ERP' | 'ADMISSION_GATEWAY') => {
    setIsSyncing(true)
    try {
      await api.integrations.sync(type)
      notify(`${type} synchronization completed`)
      await loadIntegrations()
    } catch (err: any) {
      notify(err?.message || `${type} sync failed`)
    } finally {
      setIsSyncing(false)
    }
  }

  const creds = erpRecord?.credentials
  const isErpLive = Boolean(
    creds?.enabled && creds?.hasApiKey && creds?.isServerConfigured !== false,
  )
  const activeSchoolId = api.getActiveSchoolId()
  const webhookUrl = `${API_BASE_URL}/public/webhooks/erp/${activeSchoolId || 'SCHOOL_ID'}`

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopiedWebhook(true)
    notify('ERP Webhook URL copied to clipboard')
    setTimeout(() => setCopiedWebhook(false), 2000)
  }

  return (
    <div className="integration-grid">
      <IntegrationCard
        icon="layers"
        title="School ERP Website Integration"
        label={isErpLive ? 'Connected' : 'Not Configured'}
        description="Connect your external School ERP for live admissions, open classes, status tracking, and alumni verification."
        items={[
          creds?.erpSchoolName
            ? `Linked ERP School: ${creds.erpSchoolName}`
            : 'Dynamic open classes dropdown',
          creds?.openClassesCount !== undefined
            ? `${creds.openClassesCount} open admission class(es) detected`
            : 'Real-time application submission & tracking',
          creds?.tenantId
            ? `Alumni verification ready (Tenant linked)`
            : 'Encrypted server-side x-website-key proxy',
        ]}
        footer={
          erpRecord?.lastSyncAt
            ? `Last verified: ${new Date(erpRecord.lastSyncAt).toLocaleString()}`
            : 'Configure your Website API Key below'
        }
        action={isSyncing ? 'Syncing...' : 'Sync ERP now'}
        onAction={() => handleSync('SCHOOL_ERP')}
        disabled={isSyncing}
      />

      <IntegrationCard
        icon="plug"
        title="Admission API Gateway"
        label={gatewayRecord?.status || 'Healthy'}
        description="Routes public admission forms & applicant tracking to your ERP (or local registry when ERP is disabled)."
        items={[
          isErpLive
            ? 'Mode: Live ERP Proxy + Local Mirror'
            : 'Mode: Standalone Local Registry',
          'Server-side secret protection (no key in browser)',
          'Automatic 400 / 401 / 403 / 429 error handling',
        ]}
        footer={
          gatewayRecord?.lastSyncAt
            ? `Last checked: ${new Date(gatewayRecord.lastSyncAt).toLocaleString()}`
            : 'Gateway ready'
        }
        action={isSyncing ? 'Checking...' : 'Test gateway'}
        onAction={() => handleSync('ADMISSION_GATEWAY')}
        disabled={isSyncing}
      />

      {/* ERP Configuration Panel */}
      <div className="card" style={{ gridColumn: '1 / -1', padding: '20px' }}>
        <div className="card-title gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h3>Connect School ERP (x-website-key)</h3>
            <p className="mt-1">
              Paste the <code>sk_web_...</code> Website API Key generated from{' '}
              <strong>ERP → System → Website Integration</strong>. Keys are stored encrypted on the server.
            </p>
          </div>
          {creds?.apiKeyHint && (
            <span className="shrink-0 whitespace-nowrap text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Saved Key: {creds.apiKeyHint}
            </span>
          )}
        </div>

        {creds && creds.isServerConfigured === false && (
          <div className="mt-4 p-3.5 rounded-lg text-sm border bg-amber-50 border-amber-200 text-amber-800">
            ERP server connection is not yet enabled on this platform. Please contact system support.
          </div>
        )}

        <form onSubmit={handleSaveErpConfig} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Website API Key (x-website-key) {creds?.hasApiKey ? '(leave blank to keep existing)' : '*'}
              </label>
              <input
                type="password"
                required={!creds?.hasApiKey}
                placeholder={creds?.hasApiKey ? creds.apiKeyHint || 'sk_web_••••••••' : 'sk_web_xxxxxxxx...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Webhook HMAC Secret {creds?.hasWebhookSecret ? `(${creds.webhookSecretHint || 'saved'})` : '(Optional)'}
              </label>
              <input
                type="password"
                placeholder={
                  creds?.hasWebhookSecret
                    ? 'Leave blank to keep existing secret'
                    : 'Paste ERP webhook signing secret (X-ERP-Signature)'
                }
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                ERP Status Webhook URL (paste into ERP Website Integration)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono text-slate-700"
                />
                <Button type="button" onClick={handleCopyWebhookUrl}>
                  {copiedWebhook ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>

          <label className="inline-flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>Enable Live ERP Admission Sync & Alumni Verification for this school</span>
          </label>

          {testBanner && (
            <div
              className={`p-3.5 rounded-lg text-sm border ${
                testBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testBanner.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button type="submit" disabled={isSaving || isTesting}>
              {isSaving ? 'Saving...' : 'Save ERP Settings'}
            </Button>
            <Button
              type="button"
              onClick={handleTestErpConnection}
              disabled={isTesting || isSaving}
            >
              {isTesting ? 'Testing Connection...' : 'Test Live Connection'}
            </Button>
          </div>
        </form>
      </div>

      {/* Sync History */}
      <div className="card sync-history" style={{ gridColumn: '1 / -1' }}>
        <div className="card-title mb-2 gap-3">
          <div>
            <h3>Synchronization history</h3>
            <p>Recent activity from connected systems</p>
          </div>
          <button
            type="button"
            className="text-button shrink-0"
            onClick={async () => {
              await loadIntegrations()
              notify('Sync history refreshed from database')
            }}
          >
            Refresh history
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No synchronization events logged yet.</p>
        ) : (
          history.map((x, i) => {
            const statusUpper = x[3] || 'SUCCESS'
            const isError = statusUpper === 'ERROR'
            const isWarn = statusUpper === 'PENDING' || statusUpper === 'INACTIVE'
            const timestampText = x[2].includes(' · ')
              ? x[2].split(' · ').slice(1).join(' · ')
              : x[2]
            return (
              <div className="sync-item" key={x[0] + i}>
                <span className={`sync-icon ${isError ? 'rev' : isWarn ? 'warn' : 'ok'}`}>
                  <Icon name={isError ? 'close' : 'check'} size={14} />
                </span>
                <div className="sync-body">
                  <strong>{x[0]}</strong>
                  <small>{x[1]}</small>
                </div>
                <div className="sync-meta">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isError
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isWarn
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {statusUpper}
                  </span>
                  <span>{timestampText}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
