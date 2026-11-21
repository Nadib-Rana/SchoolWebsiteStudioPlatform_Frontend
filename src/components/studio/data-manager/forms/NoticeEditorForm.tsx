'use client'

import { useRef, useState } from 'react'
import { api } from '@/lib/api-client'

interface NoticeFormState {
  title: string
  category: string
  description: string
  fileUrl: string
  isPinned: boolean
  priority: string
  status: string
  publishDate: string
}

interface NoticeEditorFormProps {
  notice: NoticeFormState
  setNotice: React.Dispatch<React.SetStateAction<NoticeFormState>>
}

export function NoticeEditorForm({ notice, setNotice }: NoticeEditorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadAttachment = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    setUploadError(null)
    try {
      const uploaded = await api.storage.upload(file)
      await api.gallery.createMedia({
        filename: uploaded.key,
        originalName: file.name,
        mimeType: file.type || 'application/pdf',
        sizeBytes: file.size,
        url: uploaded.publicUrl,
        category: file.type?.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
      })
      setNotice((prev) => ({ ...prev, fileUrl: uploaded.publicUrl }))
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to upload attachment.',
      )
    } finally {
      setUploadingFile(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }
  return (
    <div className="modal-form">
      <label>
        Notice title *
        <input
          required
          placeholder="e.g. Science Fair Registration Open"
          value={notice.title}
          onChange={(e) =>
            setNotice((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>
      <label>
        Description *
        <textarea
          required
          rows={4}
          placeholder="Provide notice instructions, deadlines, and information"
          value={notice.description}
          onChange={(e) =>
            setNotice((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </label>
      <div className="form-grid">
        <label>
          Category
          <select
            value={notice.category}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="General">General</option>
            <option value="Routine">Routine</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Examinations">Examinations</option>
            <option value="Holiday">Holiday</option>
            <option value="Academic">Academic</option>
            <option value="Admissions">Admissions</option>
            <option value="Parents">Parents</option>
          </select>
        </label>
        <label>
          Publish Date
          <input
            type="date"
            value={notice.publishDate}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, publishDate: e.target.value }))
            }
          />
        </label>
        <label>
          Priority
          <select
            value={notice.priority}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High / Urgent</option>
          </select>
        </label>
        <label>
          Pinned Notice
          <select
            value={notice.isPinned ? 'true' : 'false'}
            onChange={(e) =>
              setNotice((prev) => ({
                ...prev,
                isPinned: e.target.value === 'true',
              }))
            }
          >
            <option value="false">No</option>
            <option value="true">Yes (Pin to top)</option>
          </select>
        </label>
      </div>

      {/* PDF / Document Attachment for Download Center */}
      <div
        style={{
          marginTop: '6px',
          padding: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            PDF / File Attachment (Optional — shows in Download Center)
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={handleUploadAttachment}
            />
            <button
              type="button"
              disabled={uploadingFile}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '5px 10px',
                borderRadius: '7px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {uploadingFile ? 'Uploading...' : 'Upload PDF / File'}
            </button>
            {notice.fileUrl && (
              <button
                type="button"
                onClick={() => setNotice((prev) => ({ ...prev, fileUrl: '' }))}
                style={{
                  padding: '5px 8px',
                  borderRadius: '7px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <input
          type="url"
          placeholder="Or paste PDF / document URL (https://...)"
          value={notice.fileUrl}
          onChange={(e) =>
            setNotice((prev) => ({ ...prev, fileUrl: e.target.value }))
          }
        />

        {uploadError && (
          <span style={{ fontSize: '11px', color: '#b91c1c' }}>
            {uploadError}
          </span>
        )}
      </div>
    </div>
  )
}
