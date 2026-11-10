'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useState } from 'react'
import type { DataManagerProps } from './data-manager.types'
import { useDataManagerData } from './useDataManagerData'
import { DataManagerSummary } from './DataManagerSummary'
import { DataTableRows } from './DataTableRows'

export type { DataManagerProps }

export function DataManager({ type, refreshKey = 0 }: DataManagerProps) {
  const { notify } = useStudio()
  const labels =
    type === 'pages'
      ? ['Page', 'URL', 'Status', 'Last updated']
      : type === 'teachers'
      ? ['Name', 'Designation', 'Department', 'Visibility']
      : type === 'notices'
      ? ['Notice', 'Category', 'Publication date', 'Status']
      : ['Event', 'Date', 'Location', 'Status']

  const { items, setItems, loading } = useDataManagerData(type, refreshKey)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const statusOptions = ['All statuses', 'Published', 'Draft', 'Expired']

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
            loading={loading}
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
    </>
  )
}
