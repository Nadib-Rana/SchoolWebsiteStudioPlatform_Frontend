'use client'

interface DataManagerSummaryProps {
  totalCount: number
  publishedCount: number
  draftsCount: number
  loading: boolean
}

export function DataManagerSummary({
  totalCount,
  publishedCount,
  draftsCount,
  loading,
}: DataManagerSummaryProps) {
  return (
    <div className="manager-summary">
      <div>
        <span>All items</span>
        <strong>{totalCount}</strong>
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
  )
}
