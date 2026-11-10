'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useStudio } from '@/context/StudioContext'
import type { AdmissionItem } from './admission.types'
import { AdmissionDetailModal } from './AdmissionDetailModal'
import { AdmissionsFilterBar } from './AdmissionsFilterBar'
import { AdmissionsTableView } from './AdmissionsTableView'
import { AdmissionsPipelineView } from './AdmissionsPipelineView'
import { exportAdmissionsToCsv } from './admission-export'

export function AdmissionsManager() {
  const { notify, currentSchool } = useStudio()
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
