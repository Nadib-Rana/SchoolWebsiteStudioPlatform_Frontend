'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import type { View } from '@/types/studio'

export interface EditorModalProps {
  type: View
  close: () => void
  save: () => void
}

export function EditorModal({ type, close, save }: EditorModalProps) {
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

        {type === 'media' ? (
          <div className="upload-drop">
            <Icon name="image" size={28} />
            <strong>Drop files here or browse</strong>
            <span>Images, PDFs and documents up to 20 MB</span>
            <Button>Select files</Button>
          </div>
        ) : type === 'teachers' ? (
          <div className="modal-form">
            <div className="privacy-note">
              <Icon name="eye" />
              <div>
                <strong>Public information only</strong>
                <p>
                  Private employee records, payroll, personal contacts, and
                  identification are never shown here.
                </p>
              </div>
            </div>
            <div className="profile-upload">
              <span>
                <Icon name="users" />
              </span>
              <div>
                <strong>Teacher photo</strong>
                <small>Professional portrait · JPG or PNG</small>
                <button type="button">Upload photo</button>
              </div>
            </div>
            <div className="form-grid">
              <label>
                Full name
                <input placeholder="Teacher’s public name" />
              </label>
              <label>
                Designation
                <input placeholder="e.g. Senior Teacher" />
              </label>
              <label>
                Department
                <select defaultValue="Science">
                  <option>Choose department</option>
                  <option>Science</option>
                  <option>English</option>
                </select>
              </label>
              <label>
                Qualification
                <input placeholder="e.g. M.Sc. in Physics" />
              </label>
              <label>
                Experience
                <input placeholder="e.g. 12 years" />
              </label>
              <label>
                Display order
                <input type="number" defaultValue="1" />
              </label>
              <label className="full">
                Short biography
                <textarea placeholder="Write an approved public biography" />
              </label>
              <label className="full">
                Professional information
                <textarea placeholder="Subjects, interests, awards, or professional memberships" />
              </label>
              <label>
                Publishing status
                <select defaultValue="Draft">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </label>
              <label>
                Public approval
                <select defaultValue="Approved for website">
                  <option>Awaiting approval</option>
                  <option>Approved for website</option>
                </select>
              </label>
            </div>
          </div>
        ) : type === 'notices' ? (
          <div className="modal-form">
            <label>
              Notice title
              <input placeholder="Write a clear notice title" />
            </label>
            <label>
              Description
              <textarea placeholder="Provide all information families need" />
            </label>
            <div className="form-grid">
              <label>
                Category
                <select defaultValue="General">
                  <option>General</option>
                  <option>Academic</option>
                  <option>Parents</option>
                  <option>Activities</option>
                </select>
              </label>
              <label>
                Attachment
                <div className="file-field">
                  <Icon name="file" size={14} />
                  Choose PDF or document
                </div>
              </label>
              <label>
                Publication date
                <input type="date" />
              </label>
              <label>
                Expiration date
                <input type="date" />
              </label>
              <label>
                Featured notice
                <select defaultValue="No">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </label>
              <label>
                Status
                <select defaultValue="Save as draft">
                  <option>Save as draft</option>
                  <option>Publish now</option>
                </select>
              </label>
            </div>
          </div>
        ) : type === 'events' ? (
          <div className="modal-form">
            <label>
              Event title
              <input placeholder="Event name" />
            </label>
            <label>
              Event description
              <textarea placeholder="Describe the event and who should attend" />
            </label>
            <div className="event-image-drop">
              <Icon name="image" />
              <span>Upload event image</span>
            </div>
            <div className="form-grid">
              <label>
                Start date & time
                <input type="datetime-local" />
              </label>
              <label>
                End date & time
                <input type="datetime-local" />
              </label>
              <label>
                Location
                <input placeholder="Venue or online link" />
              </label>
              <label>
                Category
                <select defaultValue="Academic">
                  <option>Academic</option>
                  <option>Community</option>
                  <option>Arts</option>
                  <option>Sports</option>
                </select>
              </label>
              <label>
                Featured event
                <select defaultValue="No">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </label>
              <label>
                Publication status
                <select defaultValue="Draft">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </label>
            </div>
          </div>
        ) : type === 'gallery' ? (
          <div className="modal-form">
            <label>
              Album name
              <input placeholder="e.g. Science Fair 2025" />
            </label>
            <label>
              Album description
              <textarea placeholder="Describe this collection" />
            </label>
            <div className="upload-drop compact">
              <Icon name="image" />
              <strong>Upload multiple images</strong>
              <span>Drag files here or choose up to 50 images</span>
              <Button>Select images</Button>
            </div>
            <div className="form-grid">
              <label>
                Featured image
                <select>
                  <option>Choose after upload</option>
                </select>
              </label>
              <label>
                Publication status
                <select defaultValue="Draft">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <div className="modal-form">
            <label>
              Page title
              <input placeholder="e.g. Student Life" />
            </label>
            <div className="form-grid">
              <label>
                Page URL
                <input placeholder="/student-life" />
              </label>
              <label>
                Parent page
                <select defaultValue="None — top level">
                  <option>None — top level</option>
                  <option>About Us</option>
                </select>
              </label>
              <label>
                Visibility
                <select defaultValue="Visible in navigation">
                  <option>Visible in navigation</option>
                  <option>Hidden</option>
                </select>
              </label>
              <label>
                Status
                <select defaultValue="Save as draft">
                  <option>Save as draft</option>
                  <option>Publish now</option>
                </select>
              </label>
            </div>
            <label>
              Page summary
              <textarea placeholder="Briefly describe this page for search and navigation" />
            </label>
          </div>
        )}

        <div className="modal-actions">
          <Button onClick={close}>Cancel</Button>
          <Button onClick={() => save()}>Save draft</Button>
          <Button kind="primary" onClick={save}>
            {type === 'media' ? 'Upload files' : 'Save & preview'}
          </Button>
        </div>
      </div>
    </div>
  )
}
