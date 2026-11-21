'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { revalidatePublicSite } from '@/lib/revalidate-client'
import type { View } from '@/types/studio'
import { useState } from 'react'
import type { DataItem, DataManagerProps } from './data-manager.types'
import { useDataManagerData } from './useDataManagerData'
import { DataManagerSummary } from './DataManagerSummary'
import { DataTableRows } from './DataTableRows'
import { EditorModal } from './EditorModal'

export type { DataManagerProps }

export function DataManager({ type, refreshKey = 0 }: DataManagerProps) {
  const { notify, currentSchool } = useStudio()
  const labels =
    type === 'pages'
      ? ['Page', 'URL', 'Status', 'Last updated']
      : type === 'teachers'
      ? ['Name', 'Designation', 'Department', 'Visibility']
      : type === 'notices'
      ? ['Notice', 'Category', 'Publication date', 'Status']
      : ['Event', 'Date', 'Location', 'Status']

  const [localRefresh, setLocalRefresh] = useState(0)
  const { items, setItems, loading } = useDataManagerData(
    type,
    refreshKey + localRefresh,
  )
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const statusOptions = ['All statuses', 'Published', 'Draft', 'Expired']

  const handleToggleStatus = async (item: DataItem) => {
    const nextPublished = item.status !== 'PUBLISHED'
    setTogglingId(item.id)
    try {
      if (type === 'notices') {
        await api.notices.update(item.id, {
          status: nextPublished ? 'PUBLISHED' : 'DRAFT',
        })
      } else if (type === 'events') {
        await api.events.update(item.id, {
          status: nextPublished ? 'PUBLISHED' : 'DRAFT',
        })
      } else if (type === 'pages') {
        await api.pages.update(item.id, {
          status: nextPublished ? 'PUBLISHED' : 'DRAFT',
        })
      } else if (type === 'teachers') {
        await api.teachers.update(item.id, {
          status: nextPublished ? 'ACTIVE' : 'INACTIVE',
        })
      }
      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      setLocalRefresh((k) => k + 1)
      notify(
        nextPublished
          ? `"${item.cells[0]}" is now Published live!`
          : `"${item.cells[0]}" moved to Draft (hidden from public site).`,
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.'
      notify(`Error: ${msg}`)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    setDeletingId(id)

    try {
      if (type === 'teachers') {
        await api.teachers.delete(id)
      } else if (type === 'notices') {
        await api.notices.delete(id)
      } else if (type === 'events') {
        await api.events.delete(id)
      } else if (type === 'pages') {
        await api.pages.delete(id)
      }

      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      setItems((prev) => prev.filter((item) => item.id !== id))
      notify(`"${name}" was deleted successfully.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete item.'
      notify(`Error: ${msg}`)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = items.filter(
    (item) =>
      item.cells.join(' ').toLowerCase().includes(query.toLowerCase()) &&
      (status === 'All statuses' || item.cells.includes(status)),
  )

  const pageSize = 5
  const shown = filtered.slice(page * pageSize, page * pageSize + pageSize)

  const cycleStatus = () => {
    setStatus(
      statusOptions[(statusOptions.indexOf(status) + 1) % statusOptions.length],
    )
    setPage(0)
  }

  const publishedCount = items.filter(
    (r) => r.cells[3] === 'Published' || r.cells[2] === 'Published',
  ).length
  const draftsCount = items.filter(
    (r) => r.cells[3] === 'Draft' || r.cells[2] === 'Draft',
  ).length

  return (
    <>
      <DataManagerSummary
        totalCount={items.length}
        publishedCount={publishedCount}
        draftsCount={draftsCount}
        loading={loading}
      />

      <div className="card data-card">
        <div className="data-tools">
          <div className="search-field wide">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder={`Search ${type}...`}
            />
          </div>
          <button type="button" className="select-button" onClick={cycleStatus}>
            {status} <Icon name="chevron" size={13} />
          </button>
          <button
            type="button"
            className="select-button"
            onClick={() => {
              setQuery('')
              setStatus('All statuses')
              setPage(0)
            }}
          >
            Reset <Icon name="settings" size={13} />
          </button>
        </div>

        <div className="data-table">
          <div className="table-row table-head">
            <input
              className="check-box"
              type="checkbox"
              aria-label="Select all items"
            />
            {labels.map((x) => (
              <strong key={x}>{x}</strong>
            ))}
            <span>Action</span>
          </div>

          <DataTableRows
            shown={shown}
            type={type}
            deletingId={deletingId}
            togglingId={togglingId}
            loading={loading}
            onEdit={(item) => setEditingItem(item)}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>

        <div className="table-footer">
          <span>
            Showing {shown.length} of {filtered.length} items
          </span>
          <div>
            <button
              type="button"
              onClick={() => setPage(Math.max(0, page - 1))}
              aria-disabled={page === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage(
                  Math.min(
                    Math.max(0, Math.ceil(filtered.length / pageSize) - 1),
                    page + 1,
                  ),
                )
              }
              aria-disabled={(page + 1) * pageSize >= filtered.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingItem && (
        <EditorModal
          type={type as View}
          initialData={editingItem.raw}
          close={() => setEditingItem(null)}
          save={() => {
            const label = editingItem.cells[0]
            setEditingItem(null)
            setLocalRefresh((k) => k + 1)
            notify(`"${label}" updated and published!`)
          }}
        />
      )}
    </>
  )
}
