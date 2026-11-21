'use client'

import { Icon } from '@/components/common/Icon'
import type { DataItem } from './data-manager.types'

interface DataTableRowsProps {
  shown: DataItem[]
  type: string
  deletingId: string | null
  togglingId?: string | null
  loading: boolean
  selectedIds?: string[]
  onToggleSelect?: (id: string) => void
  onEdit?: (item: DataItem) => void
  onToggleStatus?: (item: DataItem) => void
  onDelete: (id: string, name: string) => void
}

export function DataTableRows({
  shown,
  type,
  deletingId,
  togglingId,
  loading,
  selectedIds = [],
  onToggleSelect,
  onEdit,
  onToggleStatus,
  onDelete,
}: DataTableRowsProps) {
  return (
    <>
      {shown.map((item, i) => {
        const r = item.cells
        const isDeleting = deletingId === item.id
        const isToggling = togglingId === item.id
        const isPublished = item.status === 'PUBLISHED'
        const isSelected = selectedIds.includes(item.id)
        return (
          <div className={`table-row ${isSelected ? 'bg-slate-50/80' : ''}`} key={item.id}>
            <input
              className="check-box cursor-pointer"
              type="checkbox"
              aria-label={`Select ${r[0]}`}
              checked={isSelected}
              onChange={() => onToggleSelect?.(item.id)}
            />
            {r.map((x, j) =>
              j === 0 ? (
                <div className="primary-cell" key={`${item.id}-${j}`}>
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
                  {type === 'pages' && item.raw?.isHome && <small>Homepage</small>}
                </div>
              ) : j === r.length - 1 ? (
                <span className={`state-badge ${x.toLowerCase()}`} key={`${item.id}-${j}`}>
                  <i />
                  {x}
                </span>
              ) : (
                <span key={`${item.id}-${j}`}>{x}</span>
              ),
            )}
            <div className="flex items-center justify-end gap-1.5">
              {onToggleStatus && (
                <button
                  type="button"
                  disabled={isToggling}
                  onClick={() => onToggleStatus(item)}
                  title={isPublished ? `Move "${r[0]}" to Draft` : `Publish "${r[0]}" live`}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                    isPublished
                      ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {isToggling ? '...' : isPublished ? 'Unpublish' : 'Publish'}
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  title={`Edit ${r[0]}`}
                  aria-label={`Edit ${r[0]}`}
                  onClick={() => onEdit(item)}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                title={`Delete ${r[0]}`}
                aria-label={`Delete ${r[0]}`}
                disabled={isDeleting}
                onClick={() => onDelete(item.id, r[0])}
                className="p-1 hover:text-rose-600 transition-colors text-slate-400 cursor-pointer"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
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
