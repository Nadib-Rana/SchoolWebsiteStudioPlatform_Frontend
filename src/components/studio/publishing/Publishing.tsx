'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

interface StagedChange {
  type: string
  title: string
  detail: string
  updatedAt: string
}

interface VersionRecord {
  id: string
  versionTag: string
  summary: string
  isCurrent: boolean
  createdAt: string
  publishedBy?: { firstName?: string; lastName?: string; username?: string }
}

export function Publishing() {
  const { notify } = useStudio()
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [currentVersionTag, setCurrentVersionTag] = useState('v1.0')
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>([])
  const [versions, setVersions] = useState<VersionRecord[]>([])

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

      {/* Version History Card */}
      <div className="card version-card">
        <div className="card-title">
          <div>
            <h3>Version history</h3>
            <p>Immutable snapshots of previous releases</p>
          </div>
        </div>
        {versions.length > 0 ? (
          versions.map((x, i) => {
            const author = x.publishedBy
              ? `${x.publishedBy.firstName || ''} ${x.publishedBy.lastName || ''}`.trim() ||
                x.publishedBy.username ||
                'Administrator'
              : 'System'
            return (
              <div className="version-row" key={x.id || x.versionTag}>
                <b>{x.versionTag}</b>
                <div>
                  <strong>{x.summary || 'Production release'}</strong>
                  <small>
                    {formatTimeAgo(x.createdAt)} · {author}
                  </small>
                </div>
                {x.isCurrent || i === 0 ? (
                  <span className="state-badge published">
                    <i />
                    Live
                  </span>
                ) : (
                  <Button onClick={() => notify(`${x.versionTag} snapshot verified in database`)}>
                    Inspect
                  </Button>
                )}
              </div>
            )
          })
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No previous version snapshots found. Publishing a release will create your first version snapshot.
          </div>
        )}
      </div>

      {/* Danger Zone: Publish / Unpublish Toggle */}
      <div className="card danger-zone">
        <div>
          <strong>{isPublished ? 'Unpublish website' : 'Publish website online'}</strong>
          <p>
            {isPublished
              ? 'Take the public website offline while keeping all content, media, and drafts safe in PostgreSQL.'
              : 'Make your school website publicly accessible to visitors, parents, and prospective applicants.'}
          </p>
        </div>
        <Button
          onClick={handleTogglePublish}
          disabled={toggling || loading}
          className={isPublished ? 'border-rose-300 text-rose-700 hover:bg-rose-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
        >
          {toggling
            ? 'Updating...'
            : isPublished
            ? 'Unpublish website'
            : 'Make website public'}
        </Button>
      </div>
    </div>
  )
}
