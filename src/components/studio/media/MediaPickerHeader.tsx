'use client'

import { Icon } from '@/components/common/Icon'

interface MediaPickerHeaderProps {
  title: string
  activeTab: 'library' | 'upload' | 'url'
  setActiveTab: (tab: 'library' | 'upload' | 'url') => void
  assetCount: number
  onClose: () => void
}

export function MediaPickerHeader({
  title,
  activeTab,
  setActiveTab,
  assetCount,
  onClose,
}: MediaPickerHeaderProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 22px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            {title}
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
            Select an existing media asset, upload a new photo, or provide a web URL.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: '6px',
            borderRadius: '6px',
          }}
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 22px',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'library' ? '#163d72' : '#f1f5f9',
            color: activeTab === 'library' ? '#fff' : '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Icon name="image" size={13} />
          Media Library ({assetCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'upload' ? '#163d72' : '#f1f5f9',
            color: activeTab === 'upload' ? '#fff' : '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Icon name="plus" size={13} />
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          style={{
            padding: '7px 14px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'url' ? '#163d72' : '#f1f5f9',
            color: activeTab === 'url' ? '#fff' : '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Icon name="external" size={13} />
          Web Image URL
        </button>
      </div>
    </>
  )
}
