'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'

export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  title?: string
  currentUrl?: string
}

interface MediaAssetItem {
  id?: string
  url: string
  name: string
  size?: string
  mimeType?: string
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Image',
  currentUrl,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library')
  const [assets, setAssets] = useState<MediaAssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl || '')
  const [customUrl, setCustomUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentUrl || '')
      loadAssets()
    }
  }, [isOpen, currentUrl])

  const loadAssets = async () => {
    setLoading(true)
    try {
      const res = await api.gallery.getMedia()
      const data = (res as any)?.data || res
      if (Array.isArray(data)) {
        const mapped = data
          .filter((item: any) => {
            const mime = item.mimeType || ''
            return !mime || mime.startsWith('image/')
          })
          .map((m: any) => ({
            id: m.id,
            url: m.url,
            name: m.originalName || m.filename || 'Media file',
            size: m.sizeFormatted || `${((m.sizeBytes || 1048576) / (1024 * 1024)).toFixed(1)} MB`,
            mimeType: m.mimeType,
          }))
        setAssets(mapped)
      }
    } catch (err) {
      console.warn('Failed to load media assets for picker:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    try {
      const uploadRes = await api.storage.upload(file)
      await api.gallery.createMedia({
        filename: uploadRes.key,
        originalName: file.name,
        mimeType: file.type || 'image/jpeg',
        sizeBytes: file.size,
        url: uploadRes.publicUrl,
        category: 'IMAGE',
      })

      const newAsset: MediaAssetItem = {
        url: uploadRes.publicUrl,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mimeType: file.type,
      }
      setAssets((prev) => [newAsset, ...prev])
      setSelectedUrl(uploadRes.publicUrl)
      setActiveTab('library')
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        {/* Header */}
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

        {/* Tab Navigation */}
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
            Media Library ({assets.length})
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

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'library' && (
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
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
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
                  <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '13px' }}>
                    {searchQuery ? 'No matching images found.' : 'No images in library yet.'}
                  </p>
                  <Button
                    kind="primary"
                    style={{ marginTop: '12px', fontSize: '12px' }}
                    onClick={() => setActiveTab('upload')}
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
                          border: isSelected ? '3px solid #2563eb' : '1px solid #e2e8f0',
                          boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
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
          )}

          {activeTab === 'upload' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                borderRadius: '10px',
                border: '2px dashed #cbd5e1',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  color: '#3730a3',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <Icon name="plus" size={22} />
              </div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                {uploading ? 'Uploading to storage...' : 'Click to choose image or drag & drop'}
              </strong>
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                PNG, JPG, WEBP or SVG up to 25 MB
              </span>
              {uploadError && (
                <div style={{ marginTop: '12px', color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                  {uploadError}
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
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
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
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
          )}
        </div>

        {/* Footer */}
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
          <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
