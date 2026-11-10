'use client'

import { useState, useEffect } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { CreateBackupParams, StagedChange, VersionRecord } from './publishing.types'
import { PublishReleaseCard } from './PublishReleaseCard'
import { PublishVersionModal } from './PublishVersionModal'
import { VersionHistoryList } from './VersionHistoryList'
import { PublishDangerZone } from './PublishDangerZone'
import { CreateBackupModal } from './CreateBackupModal'
import { RestoreConfirmModal } from './RestoreConfirmModal'

export function Publishing() {
  const { notify, setView } = useStudio()
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [currentVersionTag, setCurrentVersionTag] = useState('v1.0')
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>([])
  const [versions, setVersions] = useState<VersionRecord[]>([])
  const [inspectVersion, setInspectVersion] = useState<VersionRecord | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<VersionRecord | null>(null)
  const [isBackupOpen, setIsBackupOpen] = useState(false)

  const loadStatus = async () => {
    try {
      setLoading(true)
      const res = await api.publishing.getStatus()
      const data = (res as any)?.data || res
      if (data) {
        setIsPublished(Boolean(data.isPublished))
        setCurrentVersionTag(data.currentVersionTag || 'v1.0')
        setStagedChanges(Array.isArray(data.stagedChanges) ? data.stagedChanges : [])
        setVersions(Array.isArray(data.versions) ? data.versions : [])
      }
    } catch (err) {
      console.warn('Failed to load publishing status:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadStatus() }, [])

  const computeNextVersion = (current: string) => {
    const match = current.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?$/)
    return match ? `v${parseInt(match[1], 10)}.${parseInt(match[2], 10) + 1}` : 'v1.1'
  }

  const handlePublishRelease = async () => {
    if (!api.getAuthToken()) {
      notify('⚠️ Please sign in as an administrator to publish.')
      setView('login')
      return
    }
    setPublishing(true)
    const nextTag = computeNextVersion(currentVersionTag)
    try {
      await api.publishing.release({
        versionTag: nextTag,
        summary: `Production release ${nextTag} with latest studio customizations and profile updates`,
      })
      notify(`Version ${nextTag} published successfully!`)
      await loadStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publishing release failed'
      notify(`Error: ${msg}`)
    } finally {
      setPublishing(false)
    }
  }

  const handleCreateBackup = async (params: CreateBackupParams) => {
    try {
      await api.publishing.createBackup(params)
      notify(`Site snapshot '${params.label}' captured successfully!`)
      await loadStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create backup'
      notify(`Error: ${msg}`)
    }
  }

  const handleConfirmRestore = async (versionId: string, reason?: string) => {
    try {
      await api.publishing.restoreVersion(versionId, { reason })
      notify('Website revision successfully restored!')
      await loadStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rollback failed'
      notify(`Error: ${msg}`)
    }
  }

  const handleDeleteVersion = async (v: VersionRecord) => {
    if (!window.confirm(`Delete snapshot ${v.versionTag}? This cannot be undone.`)) return
    try {
      await api.publishing.deleteVersion(v.id)
      notify(`Snapshot ${v.versionTag} deleted.`)
      await loadStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      notify(`Error: ${msg}`)
    }
  }

  const handleTogglePublish = async () => {
    if (!api.getAuthToken()) {
      notify('⚠️ Please sign in as an administrator.')
      setView('login')
      return
    }
    const nextState = !isPublished
    if (!nextState && !window.confirm('Take your school website offline? Public visitors will receive an HTTP 404 page.')) return

    setToggling(true)
    try {
      await api.publishing.toggleStatus(nextState)
      setIsPublished(nextState)
      notify(nextState ? 'Website is now live to the public!' : 'Website unpublished.')
      await loadStatus()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Toggle publication status failed'
      notify(`Error: ${msg}`)
    } finally {
      setToggling(false)
    }
  }

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="publishing-layout">
      <PublishReleaseCard
        stagedChanges={stagedChanges}
        publishing={publishing}
        loading={loading}
        nextVersionTag={computeNextVersion(currentVersionTag)}
        onPublish={handlePublishRelease}
        formatTimeAgo={formatTimeAgo}
      />

      <VersionHistoryList
        versions={versions}
        onInspect={setInspectVersion}
        onRestore={setRestoreTarget}
        onDelete={handleDeleteVersion}
        onCreateBackup={() => setIsBackupOpen(true)}
        formatTimeAgo={formatTimeAgo}
      />

      <PublishDangerZone
        isPublished={isPublished}
        toggling={toggling}
        loading={loading}
        onTogglePublish={handleTogglePublish}
      />

      <PublishVersionModal
        version={inspectVersion}
        onClose={() => setInspectVersion(null)}
        onRestore={setRestoreTarget}
        formatTimeAgo={formatTimeAgo}
      />

      <CreateBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onSubmit={handleCreateBackup}
      />

      <RestoreConfirmModal
        version={restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleConfirmRestore}
      />
    </div>
  )
}
