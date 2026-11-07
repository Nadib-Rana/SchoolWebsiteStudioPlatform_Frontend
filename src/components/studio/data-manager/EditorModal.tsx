'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { View } from '@/types/studio'

export interface EditorModalProps {
  type: View
  close: () => void
  save: () => void
}

export function EditorModal({ type, close, save }: EditorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Teachers form state
  const [teacher, setTeacher] = useState({
    name: '',
    designation: '',
    department: 'Science',
    qualification: '',
    email: '',
    phone: '',
    bio: '',
    order: 1,
    status: 'ACTIVE',
  })

  // Notices form state
  const [notice, setNotice] = useState({
    title: '',
    category: 'General',
    description: '',
    fileUrl: '',
    isPinned: false,
    priority: 'NORMAL',
    status: 'PUBLISHED',
    publishDate: new Date().toISOString().split('T')[0],
  })

  // Events form state
  const [event, setEvent] = useState({
    title: '',
    category: 'Academic',
    eventDate: new Date().toISOString().split('T')[0],
    time: '09:00 AM - 03:00 PM',
    venue: 'Main Auditorium',
    description: '',
    status: 'PUBLISHED',
    registrationUrl: '',
  })

  // Pages form state
  const [page, setPage] = useState({
    title: '',
    slug: '',
    navLabel: '',
    status: 'PUBLISHED',
    metaTitle: '',
    metaDescription: '',
  })

  // Albums form state
  const [album, setAlbum] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Activities',
    coverUrl: '',
  })

  // Media file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (publishNow = true) => {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      if (type === 'teachers') {
        if (!teacher.name.trim()) throw new Error('Teacher name is required.')
        if (!teacher.designation.trim())
          throw new Error('Designation is required.')
        await api.teachers.create({
          ...teacher,
          order: Number(teacher.order) || 1,
        })
      } else if (type === 'notices') {
        if (!notice.title.trim()) throw new Error('Notice title is required.')
        if (!notice.description.trim())
          throw new Error('Description is required.')
        await api.notices.create({
          ...notice,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          publishDate: new Date(notice.publishDate).toISOString(),
        })
      } else if (type === 'events') {
        if (!event.title.trim()) throw new Error('Event title is required.')
        await api.events.create({
          ...event,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          eventDate: new Date(event.eventDate).toISOString(),
        })
      } else if (type === 'pages') {
        if (!page.title.trim()) throw new Error('Page title is required.')
        const finalSlug = page.slug.trim() || handleSlugify(page.title)
        await api.pages.create({
          title: page.title,
          slug: finalSlug,
          navLabel: page.navLabel || page.title,
          status: publishNow ? 'PUBLISHED' : 'DRAFT',
          metaTitle: page.metaTitle || page.title,
          metaDescription: page.metaDescription,
        })
      } else if (type === 'gallery') {
        if (!album.title.trim()) throw new Error('Album title is required.')
        const finalSlug = album.slug.trim() || handleSlugify(album.title)
        await api.gallery.createAlbum({
          title: album.title,
          slug: finalSlug,
          description: album.description || undefined,
          category: album.category || 'General',
          coverUrl: album.coverUrl || undefined,
        })
      } else if (type === 'media') {
        if (!selectedFile) throw new Error('Please select a file to upload.')
        const uploaded = await api.storage.upload(selectedFile)
        await api.gallery.createMedia({
          filename: uploaded.key,
          originalName: selectedFile.name,
          mimeType: selectedFile.type,
          sizeBytes: selectedFile.size,
          url: uploaded.publicUrl,
        })
      }

      save()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save entry.'
      setErrorMsg(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const singular =
    type === 'media'
      ? 'Upload media'
      : type === 'gallery'
      ? 'Create album'
      : type === 'pages'
      ? 'Create page'
      : type === 'teachers'
      ? 'Add teacher'
      : type === 'notices'
      ? 'Create notice'
      : 'Create event'

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        className="editor-modal detailed"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span>NEW ENTRY</span>
            <h2>{singular}</h2>
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
          <div className="upload-drop p-8 text-center flex flex-col items-center">
            <Icon name="image" size={36} className="text-slate-400 mb-2" />
            <strong>Select image or document</strong>
            <span className="text-xs text-slate-500 mb-4">
              Files are securely stored in Object Storage and registered in PostgreSQL.
            </span>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) setSelectedFile(e.target.files[0])
              }}
              className="text-xs"
            />
            {selectedFile && (
              <p className="mt-2 text-xs font-bold text-blue-900">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        ) : type === 'teachers' ? (
          <div className="modal-form">
            <div className="privacy-note">
              <Icon name="eye" />
              <div>
                <strong>Public information only</strong>
                <p>
                  Private employee records, payroll, personal contacts, and
                  identification are never exposed.
                </p>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Full name *
                <input
                  required
                  placeholder="e.g. Dr. Mahmud Karim"
                  value={teacher.name}
                  onChange={(e) =>
                    setTeacher({ ...teacher, name: e.target.value })
                  }
                />
              </label>
              <label>
                Designation *
                <input
                  required
                  placeholder="e.g. Head of Science"
                  value={teacher.designation}
                  onChange={(e) =>
                    setTeacher({ ...teacher, designation: e.target.value })
                  }
                />
              </label>
              <label>
                Department *
                <select
                  value={teacher.department}
                  onChange={(e) =>
                    setTeacher({ ...teacher, department: e.target.value })
                  }
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Arts & Music">Arts & Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Administration">Administration</option>
                </select>
              </label>
              <label>
                Qualification
                <input
                  placeholder="e.g. M.Sc. in Physics"
                  value={teacher.qualification}
                  onChange={(e) =>
                    setTeacher({ ...teacher, qualification: e.target.value })
                  }
                />
              </label>
              <label>
                Public Email
                <input
                  type="email"
                  placeholder="name@school.edu"
                  value={teacher.email}
                  onChange={(e) =>
                    setTeacher({ ...teacher, email: e.target.value })
                  }
                />
              </label>
              <label>
                Display Order
                <input
                  type="number"
                  value={teacher.order}
                  onChange={(e) =>
                    setTeacher({ ...teacher, order: Number(e.target.value) || 1 })
                  }
                />
              </label>
              <label className="full">
                Public Biography
                <textarea
                  rows={3}
                  placeholder="Teacher’s educational background and approach to teaching"
                  value={teacher.bio}
                  onChange={(e) =>
                    setTeacher({ ...teacher, bio: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
        ) : type === 'notices' ? (
          <div className="modal-form">
            <label>
              Notice title *
              <input
                required
                placeholder="e.g. Science Fair Registration Open"
                value={notice.title}
                onChange={(e) =>
                  setNotice({ ...notice, title: e.target.value })
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
                  setNotice({ ...notice, description: e.target.value })
                }
              />
            </label>
            <div className="form-grid">
              <label>
                Category
                <select
                  value={notice.category}
                  onChange={(e) =>
                    setNotice({ ...notice, category: e.target.value })
                  }
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Parents">Parents</option>
                  <option value="Examinations">Examinations</option>
                  <option value="Admissions">Admissions</option>
                </select>
              </label>
              <label>
                Publish Date
                <input
                  type="date"
                  value={notice.publishDate}
                  onChange={(e) =>
                    setNotice({ ...notice, publishDate: e.target.value })
                  }
                />
              </label>
              <label>
                Priority
                <select
                  value={notice.priority}
                  onChange={(e) =>
                    setNotice({ ...notice, priority: e.target.value })
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
                    setNotice({ ...notice, isPinned: e.target.value === 'true' })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes (Pin to top)</option>
                </select>
              </label>
            </div>
          </div>
        ) : type === 'events' ? (
          <div className="modal-form">
            <label>
              Event title *
              <input
                required
                placeholder="e.g. Annual Interschool Science Fair"
                value={event.title}
                onChange={(e) =>
                  setEvent({ ...event, title: e.target.value })
                }
              />
            </label>
            <label>
              Event description
              <textarea
                rows={3}
                placeholder="Describe the activities, schedule, and attendees"
                value={event.description}
                onChange={(e) =>
                  setEvent({ ...event, description: e.target.value })
                }
              />
            </label>
            <div className="form-grid">
              <label>
                Event Date *
                <input
                  required
                  type="date"
                  value={event.eventDate}
                  onChange={(e) =>
                    setEvent({ ...event, eventDate: e.target.value })
                  }
                />
              </label>
              <label>
                Time / Hours
                <input
                  placeholder="e.g. 9:00 AM - 4:00 PM"
                  value={event.time}
                  onChange={(e) =>
                    setEvent({ ...event, time: e.target.value })
                  }
                />
              </label>
              <label>
                Venue / Location
                <input
                  placeholder="e.g. Main Auditorium"
                  value={event.venue}
                  onChange={(e) =>
                    setEvent({ ...event, venue: e.target.value })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={event.category}
                  onChange={(e) =>
                    setEvent({ ...event, category: e.target.value })
                  }
                >
                  <option value="Academic">Academic</option>
                  <option value="Community">Community</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                </select>
              </label>
            </div>
          </div>
        ) : type === 'gallery' ? (
          <div className="modal-form">
            <label>
              Album title *
              <input
                required
                placeholder="e.g. Spring Science Fair 2026"
                value={album.title}
                onChange={(e) =>
                  setAlbum({
                    ...album,
                    title: e.target.value,
                    slug: album.slug || handleSlugify(e.target.value),
                  })
                }
              />
            </label>
            <div className="form-grid">
              <label>
                Album Slug (URL)
                <input
                  placeholder="spring-science-fair-2026"
                  value={album.slug}
                  onChange={(e) =>
                    setAlbum({ ...album, slug: e.target.value })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={album.category}
                  onChange={(e) =>
                    setAlbum({ ...album, category: e.target.value })
                  }
                >
                  <option value="Activities">Activities</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Celebrations">Celebrations</option>
                </select>
              </label>
            </div>
            <label>
              Album description
              <textarea
                rows={3}
                placeholder="Describe the moments captured in this album"
                value={album.description}
                onChange={(e) =>
                  setAlbum({ ...album, description: e.target.value })
                }
              />
            </label>
          </div>
        ) : (
          <div className="modal-form">
            <label>
              Page title *
              <input
                required
                placeholder="e.g. Student Life"
                value={page.title}
                onChange={(e) =>
                  setPage({
                    ...page,
                    title: e.target.value,
                    slug: page.slug || handleSlugify(e.target.value),
                  })
                }
              />
            </label>
            <div className="form-grid">
              <label>
                Page Slug (URL) *
                <input
                  required
                  placeholder="student-life"
                  value={page.slug}
                  onChange={(e) =>
                    setPage({ ...page, slug: e.target.value })
                  }
                />
              </label>
              <label>
                Navigation Label
                <input
                  placeholder="e.g. Student Life"
                  value={page.navLabel}
                  onChange={(e) =>
                    setPage({ ...page, navLabel: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Meta Description (SEO)
              <textarea
                rows={2}
                placeholder="Search engine summary for this page"
                value={page.metaDescription}
                onChange={(e) =>
                  setPage({ ...page, metaDescription: e.target.value })
                }
              />
            </label>
          </div>
        )}

        <div className="modal-actions">
          <Button onClick={close} disabled={isSubmitting}>
            Cancel
          </Button>
          {type !== 'media' && (
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              Save as draft
            </Button>
          )}
          <Button
            kind="primary"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : type === 'media' ? 'Upload file' : 'Save & publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}
