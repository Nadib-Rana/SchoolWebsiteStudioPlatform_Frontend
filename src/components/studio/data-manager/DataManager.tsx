'use client'

import { Icon } from '@/components/common/Icon'
import { tableRows } from '@/constants/mock-data'
import { useState } from 'react'

export interface DataManagerProps {
  type: string
}

export function DataManager({ type }: DataManagerProps) {
  const labels =
    type === 'pages'
      ? ['Page', 'URL', 'Status', 'Last updated']
      : type === 'teachers'
      ? ['Name', 'Designation', 'Department', 'Visibility']
      : type === 'notices'
      ? ['Notice', 'Category', 'Publication date', 'Status']
      : ['Event', 'Date', 'Location', 'Status']

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(0)
  const statusOptions = ['All statuses', 'Published', 'Draft', 'Expired']

  const rows = tableRows[type] || []
  const filtered = rows.filter(
    (r) =>
      r.join(' ').toLowerCase().includes(query.toLowerCase()) &&
      (status === 'All statuses' || r.includes(status))
  )

  const pageSize = 4
  const shown = filtered.slice(page * pageSize, page * pageSize + pageSize)

  const cycleStatus = () => {
    setStatus(
      statusOptions[(statusOptions.indexOf(status) + 1) % statusOptions.length]
    )
    setPage(0)
  }

  const publishedCount = rows.filter(
    (r) => r[3] === 'Published' || r[2] === 'Published'
  ).length
  const draftsCount = rows.filter(
    (r) => r[3] === 'Draft' || r[2] === 'Draft'
  ).length

  return (
    <>
      <div className="manager-summary">
        <div>
          <span>All items</span>
          <strong>{rows.length}</strong>
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
          <span>Last published</span>
          <strong>2h ago</strong>
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
            <span />
          </div>

          {shown.map((r, i) => (
            <div className="table-row" key={r[0]}>
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
                )
              )}
              <button
                type="button"
                aria-label={`Open actions for ${r[0]}`}
              >
                <Icon name="more" />
              </button>
            </div>
          ))}

          {shown.length === 0 && (
            <div className="table-empty">
              <Icon name="search" />
              <strong>No results found</strong>
              <span>Try changing the search or status filter.</span>
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
                    page + 1
                  )
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
