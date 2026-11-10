'use client'

import { Icon } from '@/components/common/Icon'
import type { DataItem } from './data-manager.types'

interface DataTableRowsProps {
  shown: DataItem[]
  type: string
  deletingId: string | null
  loading: boolean
  onDelete: (id: string, name: string) => void
}

export function DataTableRows({
  shown,
  type,
  deletingId,
  loading,
  onDelete,
}: DataTableRowsProps) {
  return (
    <>
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
              onClick={() => onDelete(item.id, r[0])}
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
    </>
  )
}
