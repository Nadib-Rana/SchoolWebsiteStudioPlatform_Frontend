'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/common/Button'
import type { MediaPickerModalProps } from './media-picker.types'
import { useMediaPickerAssets } from './useMediaPickerAssets'
import { MediaPickerHeader } from './MediaPickerHeader'
import { MediaPickerLibraryTab } from './MediaPickerLibraryTab'
import { MediaPickerUploadTab } from './MediaPickerUploadTab'
import { MediaPickerUrlTab } from './MediaPickerUrlTab'

export type { MediaPickerModalProps }

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Image',
  currentUrl,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl || '')
  const [customUrl, setCustomUrl] = useState<string>('')

  const {
    assets,
    loading,
    uploading,
    uploadError,
    fileInputRef,
    loadAssets,
    handleFileUpload,
  } = useMediaPickerAssets((newUrl) => {
    setSelectedUrl(newUrl)
    setActiveTab('library')
  })

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentUrl || '')
      loadAssets()
    }
  }, [isOpen, currentUrl])

  const handleConfirm = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSelect(customUrl.trim())
      onClose()
    } else if (selectedUrl) {
      onSelect(selectedUrl)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1100,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <MediaPickerHeader
          title={title}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assetCount={assets.length}
          onClose={onClose}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'library' && (
            <MediaPickerLibraryTab
              assets={assets}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedUrl={selectedUrl}
              setSelectedUrl={setSelectedUrl}
              onGoToUpload={() => setActiveTab('upload')}
            />
          )}

          {activeTab === 'upload' && (
            <MediaPickerUploadTab
              uploading={uploading}
              uploadError={uploadError}
              fileInputRef={fileInputRef}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeTab === 'url' && (
            <MediaPickerUrlTab
              customUrl={customUrl}
              setCustomUrl={setCustomUrl}
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 22px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#64748b',
              maxWidth: '420px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedUrl ? `Selected: ${selectedUrl}` : 'No image selected'}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button kind="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              kind="primary"
              disabled={activeTab === 'url' ? !customUrl.trim() : !selectedUrl}
              onClick={handleConfirm}
            >
              Apply Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
