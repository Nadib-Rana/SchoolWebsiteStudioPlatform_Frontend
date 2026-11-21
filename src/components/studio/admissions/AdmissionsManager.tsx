'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { revalidatePublicSite } from '@/lib/revalidate-client'
import { useStudio } from '@/context/StudioContext'
import type { AdmissionItem } from './admission.types'
import { AdmissionDetailModal } from './AdmissionDetailModal'
import { AdmissionsFilterBar } from './AdmissionsFilterBar'
import { AdmissionsTableView } from './AdmissionsTableView'
import { AdmissionsPipelineView } from './AdmissionsPipelineView'
import { exportAdmissionsToCsv } from './admission-export'

export function AdmissionsManager() {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [applications, setApplications] = useState<AdmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table')
  const [selectedApp, setSelectedApp] = useState<AdmissionItem | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [newNotes, setNewNotes] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [allowPublicAdmission, setAllowPublicAdmission] = useState<boolean>(true)
  const [togglingPortal, setTogglingPortal] = useState(false)

  useEffect(() => {
    let ignore = false
    const loadSettings = async () => {
      try {
        const res = await api.settings.get()
        const settings = (res as any)?.data || res
        if (!ignore && typeof settings?.allowPublicAdmission === 'boolean') {
          setAllowPublicAdmission(settings.allowPublicAdmission)
        }
      } catch {
        // default true
      }
    }
    void loadSettings()
    return () => {
      ignore = true
    }
  }, [currentSchool?.id, schoolSwitchKey])

  const handleToggleAdmissionsPortal = async () => {
    const nextValue = !allowPublicAdmission
    setTogglingPortal(true)
    try {
      await api.settings.update({ allowPublicAdmission: nextValue })
      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      setAllowPublicAdmission(nextValue)
      notify(
        nextValue
          ? 'Public Admissions page is now OPEN and visible on your website.'
          : 'Public Admissions page is now HIDDEN and closed to new applications.',
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update admissions visibility'
      notify(msg)
    } finally {
      setTogglingPortal(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const run = async () => {
      try {
        const res = await api.admissions.list(undefined, {
          status: filterStatus === 'ALL' ? undefined : filterStatus,
          search: searchQuery.trim() || undefined,
        })
        if (!ignore && res.data) setApplications(res.data)
      } catch {
        if (!ignore) notify('Unable to load admission applications from server')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void run()
    return () => {
      ignore = true
    }
  }, [filterStatus, searchQuery, refreshKey, notify])

  const refreshApplications = () => {
    setLoading(true)
    setRefreshKey((k) => k + 1)
  }

  const handleOpenDetail = (app: AdmissionItem) => {
    setSelectedApp(app)
    setNewStatus(app.status)
    setNewNotes(app.notes || '')
  }

  const handleAdvanceStage = async (app: AdmissionItem, nextStage: string) => {
    try {
      await api.admissions.updateStatus(app.id, nextStage, 'Advanced via pipeline board')
      notify(`Application ${app.applicationNumber} advanced to ${nextStage.replace('_', ' ')}`)
      refreshApplications()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to advance stage'
      notify(msg)
    }
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApp) return
    setUpdatingStatus(true)
    try {
      await api.admissions.updateStatus(selectedApp.id, newStatus, newNotes.trim() || undefined)
      notify(`Application ${selectedApp.applicationNumber} updated to ${newStatus}`)
      setSelectedApp(null)
      refreshApplications()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      notify(msg)
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Public Admissions Visibility Control Banner */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
          allowPublicAdmission
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-amber-50/80 border-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
              allowPublicAdmission ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-sm font-bold text-slate-900">
                Public Admissions Page
              </strong>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  allowPublicAdmission
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {allowPublicAdmission ? 'Open & Visible' : 'Hidden & Closed'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {allowPublicAdmission
                ? 'Visitors can access /admissions, see the Apply Now button, and submit new student applications.'
                : 'The Admissions link and Apply Now button are hidden from your website, and new applications are paused.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleAdmissionsPortal}
          disabled={togglingPortal}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 ${
            allowPublicAdmission
              ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
          }`}
        >
          {togglingPortal
            ? 'Updating...'
            : allowPublicAdmission
            ? 'Hide Admissions Page'
            : 'Open Admissions Page'}
        </button>
      </div>

      <AdmissionsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onRefresh={refreshApplications}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCsv={() => exportAdmissionsToCsv(applications, currentSchool?.name)}
        totalCount={applications.length}
      />

      {viewMode === 'pipeline' ? (
        <AdmissionsPipelineView
          applications={applications}
          onOpenDetail={handleOpenDetail}
          onAdvanceStage={handleAdvanceStage}
        />
      ) : (
        <AdmissionsTableView
          applications={applications}
          loading={loading}
          onOpenDetail={handleOpenDetail}
        />
      )}

      <AdmissionDetailModal
        app={selectedApp}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        newNotes={newNotes}
        setNewNotes={setNewNotes}
        updatingStatus={updatingStatus}
        onClose={() => setSelectedApp(null)}
        onSubmit={handleUpdateStatus}
      />
    </div>
  )
}
