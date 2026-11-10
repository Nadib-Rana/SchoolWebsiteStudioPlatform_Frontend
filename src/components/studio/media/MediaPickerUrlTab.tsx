'use client'

interface MediaPickerUrlTabProps {
  customUrl: string
  setCustomUrl: (url: string) => void
}

export function MediaPickerUrlTab({
  customUrl,
  setCustomUrl,
}: MediaPickerUrlTabProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#334155',
          marginBottom: '6px',
        }}
      >
        External Image URL
      </label>
      <input
        type="url"
        placeholder="https://images.unsplash.com/..."
        value={customUrl}
        onChange={(e) => setCustomUrl(e.target.value)}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '13px',
          boxSizing: 'border-box',
        }}
      />
      {customUrl.trim() && (
        <div style={{ marginTop: '16px' }}>
          <span
            style={{
              display: 'block',
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '6px',
            }}
          >
            Preview:
          </span>
          <div
            style={{
              maxHeight: '180px',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <img
              src={customUrl.trim()}
              alt="URL preview"
              style={{ width: '100%', height: '180px', objectFit: 'contain' }}
              onError={(e) => {
                ;(e.currentTarget as HTMLElement).style.display = 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
