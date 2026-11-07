'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage, campusImage, interiorImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useRef, useState } from 'react'

export function MediaLibrary() {
  const { notify } = useStudio()
  const [items, setItems] = useState<Array<[string, string, string]>>([
    [heroImage, 'school-campus-hero.jpg', '2.4 MB'],
    [campusImage, 'northfield-courtyard.jpg', '1.8 MB'],
    [interiorImage, 'learning-commons.jpg', '1.2 MB'],
    ['', 'admission-guide-2025.pdf', '840 KB'],
    ['', 'school-calendar.pdf', '420 KB'],
  ])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All files')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let mounted = true
    const fetchMedia = async () => {
      try {
        const res = await api.gallery.getMedia()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((m: any) => [
            m.url || '',
            m.originalName || m.filename,
            m.sizeFormatted || `${((m.sizeBytes || 1048576) / (1024 * 1024)).toFixed(1)} MB`,
          ] as [string, string, string])
          setItems(mapped)
        }
      } catch (err) {
        console.warn('Failed to load media items from backend:', err)
      }
    }
    fetchMedia()
    return () => {
      mounted = false
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadRes = await api.storage.upload(file)
      const isImg = file.type.startsWith('image/')
      const newEntry: [string, string, string] = [
        isImg ? uploadRes.publicUrl : '',
        file.name,
        `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      ]
      setItems((prev) => [newEntry, ...prev])

      // Persist MediaAsset record to PostgreSQL so it survives reloads
      try {
        await api.gallery.createMedia({
          filename: uploadRes.key,
          originalName: file.name,
          mimeType: file.type || (isImg ? 'image/jpeg' : 'application/octet-stream'),
          sizeBytes: file.size,
          url: uploadRes.publicUrl,
          category: isImg ? 'IMAGE' : 'DOCUMENT',
        })
      } catch (dbErr) {
        console.warn('Could not register media asset in database:', dbErr)
      }

      notify(`Uploaded ${file.name} to storage successfully`)
    } catch (err) {
      console.error('Upload to MinIO failed:', err)
      notify('File upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const filtered = items.filter(
    (x) =>
      x[1].toLowerCase().includes(query.toLowerCase()) &&
      (type === 'All files' || (type === 'Images' ? Boolean(x[0]) : !x[0]))
  )

  const cycleType = () => {
    setType(type === 'All files' ? 'Images' : type === 'Images' ? 'Documents' : 'All files')
  }

  return (
    <>
      <div className="media-toolbar">
        <div className="search-field wide">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files and folders"
          />
        </div>
        <button type="button" className="select-button" onClick={cycleType}>
          {type} <Icon name="chevron" size={13} />
        </button>
        <button
          type="button"
          className="select-button"
          onClick={() => setQuery('')}
        >
          Clear search <Icon name="close" size={13} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <Button
          kind="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading to MinIO...' : 'Upload file'}
        </Button>
      </div>

      {filtered.length ? (
        <div className="media-grid">
          {filtered.map((x, i) => (
            <div className="card media-item" key={x[1]}>
              <div
                className={x[0] ? 'media-photo' : 'document'}
                style={x[0] ? { backgroundImage: `url(${x[0]})` } : {}}
              >
                {!x[0] && (
                  <>
                    <Icon name="file" size={28} />
                    <span>PDF</span>
                  </>
                )}
              </div>
              <section>
                <strong>{x[1]}</strong>
                <small>
                  {x[2]} · Synced with MinIO
                </small>
                <button
                  type="button"
                  aria-label={`Open actions for ${x[1]}`}
                >
                  <Icon name="more" />
                </button>
              </section>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>
            <Icon name="search" />
          </span>
          <strong>No media found</strong>
          <p>Try a different search term or file type.</p>
          <Button
            onClick={() => {
              setQuery('')
              setType('All files')
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </>
  )
}
