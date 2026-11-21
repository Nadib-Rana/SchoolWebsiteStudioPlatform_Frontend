'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import { revalidatePublicSite } from '@/lib/revalidate-client'
import type { View } from '@/types/studio'
import { TeacherEditorForm } from './forms/TeacherEditorForm'
import { NoticeEditorForm } from './forms/NoticeEditorForm'
import { EventEditorForm } from './forms/EventEditorForm'
import { AlbumEditorForm } from './forms/AlbumEditorForm'
import { PageEditorForm } from './forms/PageEditorForm'
import { MediaUploadForm } from './forms/MediaUploadForm'

export interface EditorModalProps {
  type: View
  initialData?: any
  close: () => void
  save: () => void
}

const titles: Record<string, string> = {
  media: 'Upload media',
  gallery: 'Create album',
  pages: 'Create page',
  teachers: 'Add teacher',
  notices: 'Create notice',
  events: 'Create event',
}

const editTitles: Record<string, string> = {
  pages: 'Edit page',
  teachers: 'Edit teacher',
  notices: 'Edit notice',
  events: 'Edit event',
}

function toDateInput(val?: string | null): string {
  if (!val) return new Date().toISOString().split('T')[0]
  try {
    return new Date(val).toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

export function EditorModal({ type, initialData, close, save }: EditorModalProps) {
  const isEditing = Boolean(initialData?.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [teacher, setTeacher] = useState({
    name: initialData?.name || '',
    designation: initialData?.designation || '',
    department: initialData?.department || 'Science',
    qualification: initialData?.qualification || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    bio: initialData?.bio || '',
    photoUrl: initialData?.photoUrl || '',
    order: initialData?.order || 1,
    status: initialData?.status || 'ACTIVE',
  })
  const [notice, setNotice] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'General',
    description: initialData?.description || '',
    fileUrl: initialData?.fileUrl || '',
    isPinned: Boolean(initialData?.isPinned),
    priority: initialData?.priority || 'NORMAL',
    status: initialData?.status || 'PUBLISHED',
    publishDate: toDateInput(initialData?.publishDate || initialData?.publishedAt),
  })
  const [event, setEvent] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Academic',
    eventDate: toDateInput(initialData?.eventDate),
    time: initialData?.time || '09:00 AM - 03:00 PM',
    venue: initialData?.venue || initialData?.location || 'Main Auditorium',
    description: initialData?.description || '',
    status: initialData?.status || 'PUBLISHED',
    registrationUrl: initialData?.registrationUrl || '',
  })
  const [page, setPage] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    navLabel: initialData?.navLabel || '',
    status: initialData?.status || 'PUBLISHED',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    featuredImage: initialData?.featuredImage || '',
  })
  const [album, setAlbum] = useState({
    title: '', slug: '', description: '', category: 'Activities', coverUrl: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSlugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  const handleSubmit = async (publishNow = true) => {
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      if (type === 'teachers') {
        if (!teacher.name.trim()) throw new Error('Teacher name is required.')
        if (!teacher.designation.trim()) throw new Error('Designation is required.')
        const payload = {
          ...teacher,
          order: Number(teacher.order) || 1,
          status: publishNow ? 'ACTIVE' : 'INACTIVE',
        }
        if (isEditing) {
          await api.teachers.update(initialData.id, payload)
        } else {
          await api.teachers.create(payload)
        }
      } else if (type === 'notices') {
        if (!notice.title.trim()) throw new Error('Notice title is required.')
        if (!notice.description.trim()) throw new Error('Description is required.')
        const payload = {
          ...notice,
          fileUrl: notice.fileUrl.trim() || undefined,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          publishDate: new Date(notice.publishDate).toISOString(),
        }
        if (isEditing) {
          await api.notices.update(initialData.id, payload)
        } else {
          await api.notices.create(payload)
        }
      } else if (type === 'events') {
        if (!event.title.trim()) throw new Error('Event title is required.')
        const payload = {
          ...event,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          eventDate: new Date(event.eventDate).toISOString(),
        }
        if (isEditing) {
          await api.events.update(initialData.id, payload)
        } else {
          await api.events.create(payload)
        }
      } else if (type === 'pages') {
        if (!page.title.trim()) throw new Error('Page title is required.')
        const payload = {
          title: page.title,
          slug: page.slug.trim() || handleSlugify(page.title),
          navLabel: page.navLabel || page.title,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          metaTitle: page.metaTitle || page.title,
          metaDescription: page.metaDescription,
          featuredImage: page.featuredImage || undefined,
        }
        if (isEditing) {
          await api.pages.update(initialData.id, payload)
        } else {
          await api.pages.create(payload)
        }
      } else if (type === 'gallery') {
        if (!album.title.trim()) throw new Error('Album title is required.')
        await api.gallery.createAlbum({
          title: album.title,
          slug: album.slug.trim() || handleSlugify(album.title),
          description: album.description || undefined,
          category: album.category || 'General',
          coverUrl: album.coverUrl || undefined,
        })
      } else if (type === 'media') {
        if (!selectedFile) throw new Error('Please select a file to upload.')
        const uploaded = await api.storage.upload(selectedFile)
        await api.gallery.createMedia({
          filename: uploaded.key, originalName: selectedFile.name,
          mimeType: selectedFile.type, sizeBytes: selectedFile.size, url: uploaded.publicUrl,
        })
      }
      await revalidatePublicSite(api.getActiveSchoolSlug())
      save()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save entry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="editor-modal detailed" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span>{isEditing ? 'EDIT ENTRY' : 'NEW ENTRY'}</span>
            <h2>{(isEditing && editTitles[type]) || titles[type] || 'Create item'}</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close modal">
            <Icon name="close" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mx-6 mt-4 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {type === 'media' ? (
          <MediaUploadForm selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
        ) : type === 'teachers' ? (
          <TeacherEditorForm teacher={teacher} setTeacher={setTeacher} />
        ) : type === 'notices' ? (
          <NoticeEditorForm notice={notice} setNotice={setNotice} />
        ) : type === 'events' ? (
          <EventEditorForm event={event} setEvent={setEvent} />
        ) : type === 'gallery' ? (
          <AlbumEditorForm album={album} setAlbum={setAlbum} onSlugify={handleSlugify} />
        ) : (
          <PageEditorForm page={page} setPage={setPage} onSlugify={handleSlugify} />
        )}

        <div className="modal-actions">
          <Button onClick={close} disabled={isSubmitting}>
            Cancel
          </Button>
          {type !== 'media' && (
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              Save as draft
            </Button>
          )}
          <Button kind="primary" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : type === 'media' ? 'Upload file' : 'Save & publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}
