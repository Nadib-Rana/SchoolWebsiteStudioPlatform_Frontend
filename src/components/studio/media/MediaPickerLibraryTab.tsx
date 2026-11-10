'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { MediaAssetItem } from './media-picker.types'

interface MediaPickerLibraryTabProps {
  assets: MediaAssetItem[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedUrl: string
  setSelectedUrl: (url: string) => void
  onGoToUpload: () => void
}

export function MediaPickerLibraryTab({
  assets,
  loading,
  searchQuery,
  setSearchQuery,
  selectedUrl,
  setSelectedUrl,
  onGoToUpload,
}: MediaPickerLibraryTabProps) {
  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search media assets by filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '13px',
          }}
        >
          Loading school media assets...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <Icon name="image" size={32} />
          <p
            style={{
              margin: '8px 0 0',
              color: '#64748b',
              fontSize: '13px',
            }}
          >
            {searchQuery
              ? 'No matching images found.'
              : 'No images in library yet.'}
          </p>
          <Button
            kind="primary"
            style={{ marginTop: '12px', fontSize: '12px' }}
            onClick={onGoToUpload}
          >
            Upload first image
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
          }}
        >
          {filtered.map((asset) => {
            const isSelected = selectedUrl === asset.url
            return (
              <div
                key={asset.url + (asset.id || '')}
                onClick={() => setSelectedUrl(asset.url)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected
                    ? '3px solid #2563eb'
                    : '1px solid #e2e8f0',
                  boxShadow: isSelected
                    ? '0 0 0 2px rgba(37,99,235,0.2)'
                    : 'none',
                  transition: 'transform 0.15s, border-color 0.15s',
                }}
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '3px 6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {asset.name}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
