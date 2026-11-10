'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { StagedChange, VersionRecord } from './publishing.types'
import { PublishVersionModal } from './PublishVersionModal'
import { VersionHistoryList } from './VersionHistoryList'
import { PublishDangerZone } from './PublishDangerZone'

export function Publishing() {
  const { notify } = useStudio()
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [currentVersionTag, setCurrentVersionTag] = useState('v1.0')
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>([])
  const [versions, setVersions] = useState<VersionRecord[]>([])
  const [inspectVersion, setInspectVersion] = useState<VersionRecord | null>(null)

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

  useEffect(() => {
    void loadStatus()
  }, [])

  const computeNextVersion = (current: string) => {
    const match = current.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?$/)
    if (match) {
      const major = parseInt(match[1], 10)
      const minor = parseInt(match[2], 10) + 1
      return `v${major}.${minor}`
    }
    return 'v1.1'
  }

  const handlePublishRelease = async () => {
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

  const handleTogglePublish = async () => {
    const nextState = !isPublished
    if (
      !nextState &&
      typeof window !== 'undefined' &&
      !window.confirm(
        'Are you sure you want to take your school website offline? Public visitors will receive an HTTP 404 page.',
      )
    ) {
      return
    }

    setToggling(true)
    try {
      await api.publishing.toggleStatus(nextState)
      setIsPublished(nextState)
      notify(
        nextState
          ? 'Website is now live and accessible to the public!'
          : 'Website unpublished. It is now hidden from public visitors.',
      )
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
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="publishing-layout">
      {/* Top Release Card */}
      <div className="card release-card">
        <div className="release-top">
          <span className="release-icon">
            <Icon name="sparkle" />
          </span>
          <div>
            <span className={`state-badge ${stagedChanges.length > 0 ? 'draft' : 'published'}`}>
              <i />
              {stagedChanges.length > 0 ? 'Draft ready' : 'All changes live'}
            </span>
            <h2>
              {stagedChanges.length > 0
                ? `${stagedChanges.length} ${
                    stagedChanges.length === 1 ? 'change is' : 'changes are'
                  } ready to publish`
                : 'Your live website is currently up to date'}
            </h2>
            <p>
              {stagedChanges.length > 0
                ? 'Your published public website remains unchanged until you create a new version release.'
                : 'All pages, notices, events, and customizations are currently synchronized with the public profile.'}
            </p>
          </div>
          <Button
            kind="primary"
            onClick={handlePublishRelease}
            disabled={publishing || loading}
          >
            {publishing
              ? 'Publishing...'
              : `Publish version ${computeNextVersion(currentVersionTag)}`}
          </Button>
        </div>

        {stagedChanges.length > 0 ? (
          <div className="change-list">
            {stagedChanges.map((x, i) => (
              <div key={x.title + i}>
                <span>
                  <Icon name="check" size={13} />
                </span>
                <div>
                  <strong>{x.title}</strong>
                  <p>{x.detail}</p>
                </div>
                <small>{formatTimeAgo(x.updatedAt)}</small>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            <Icon name="check" size={20} className="text-emerald-600 mb-1 inline-block mr-1" />
            No pending drafts awaiting release.
          </div>
        )}
      </div>

      <VersionHistoryList
        versions={versions}
        onInspect={setInspectVersion}
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
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  )
}
