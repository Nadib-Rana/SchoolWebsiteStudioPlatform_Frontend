'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'

export interface DataManagerProps {
  type: string
  refreshKey?: number
}

interface DataItem {
  id: string
  cells: string[]
}

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

  const [items, setItems] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const statusOptions = ['All statuses', 'Published', 'Draft', 'Expired']

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        if (type === 'pages') {
          const res = await api.pages.list()
          const data = (res as any)?.data || res
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((p: any) => ({
              id: p.id,
              cells: [
                p.title,
                p.slug === 'home' ? '/' : `/${p.slug}`,
                p.status === 'PUBLISHED' ? 'Published' : 'Draft',
                p.updatedAt
                  ? new Date(p.updatedAt).toLocaleDateString()
                  : 'Recently',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'teachers') {
          const res = await api.teachers.list()
          const data = (res as any)?.data || res
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((t: any) => ({
              id: t.id,
              cells: [
                t.name,
                t.designation,
                t.department || 'General',
                t.status === 'ACTIVE' || t.status === 'PUBLISHED'
                  ? 'Published'
                  : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'notices') {
          const res = await api.notices.list()
          const data = (res as any)?.data || res
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((n: any) => ({
              id: n.id,
              cells: [
                n.title,
                n.category || 'General',
                n.publishDate || n.publishedAt
                  ? new Date(
                      n.publishDate || n.publishedAt,
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Live',
                n.status === 'PUBLISHED' ? 'Published' : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'events') {
          const res = await api.events.list()
          const data = (res as any)?.data || res
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((e: any) => ({
              id: e.id,
              cells: [
                e.title,
                e.eventDate
                  ? new Date(e.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Scheduled',
                e.venue || e.location || 'Main Campus',
                e.status === 'PUBLISHED' ? 'Published' : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        }
      } catch (err) {
        console.warn(`Failed to load ${type} data from backend:`, err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [type, refreshKey])

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
      <div className="manager-summary">
        <div>
          <span>All items</span>
          <strong>{items.length}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </div>
        <div>
          <span>Drafts</span>
          <strong>{draftsCount}</strong>
        </div>
        <div>
          <span>Database status</span>
          <strong>{loading ? 'Syncing...' : 'Connected'}</strong>
        </div>
      </div>

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

          {shown.map((item, i) => {
            const r = item.cells
            const isDeleting = deletingId === item.id
            return (
              <div className="table-row" key={item.id}>
                <input
                  className="check-box"
                  type="checkbox"
                  aria-label={`Select ${r[0]}`}
                />
                {r.map((x, j) =>
                  j === 0 ? (
                    <div className="primary-cell" key={x}>
                      {type === 'teachers' && (
                        <span className={`person p${i}`}>
                          {r[0]
                            .split(' ')
                            .map((v) => v[0])
                            .slice(-2)
                            .join('')}
                        </span>
                      )}
                      <strong>{x}</strong>
                      {type === 'pages' && i === 0 && <small>Homepage</small>}
                    </div>
                  ) : j === r.length - 1 ? (
                    <span className={`state-badge ${x.toLowerCase()}`} key={x}>
                      <i />
                      {x}
                    </span>
                  ) : (
                    <span key={x}>{x}</span>
                  ),
                )}
                <button
                  type="button"
                  title={`Delete ${r[0]}`}
                  aria-label={`Delete ${r[0]}`}
                  disabled={isDeleting}
                  onClick={() => handleDelete(item.id, r[0])}
                  className="p-1 hover:text-rose-600 transition-colors text-slate-400"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            )
          })}

          {shown.length === 0 && (
            <div className="table-empty">
              <Icon name="search" />
              <strong>
                {loading ? 'Loading from database...' : 'No results found'}
              </strong>
              <span>
                {loading
                  ? 'Connecting to PostgreSQL backend...'
                  : 'Try changing the search or status filter.'}
              </span>
            </div>
          )}
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
