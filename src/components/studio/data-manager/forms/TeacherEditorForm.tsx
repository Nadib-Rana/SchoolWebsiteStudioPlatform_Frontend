'use client'

import { Icon } from '@/components/common/Icon'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'

interface TeacherFormState {
  name: string
  designation: string
  department: string
  qualification: string
  email: string
  phone: string
  bio: string
  photoUrl: string
  order: number
  status: string
}

interface TeacherEditorFormProps {
  teacher: TeacherFormState
  setTeacher: React.Dispatch<React.SetStateAction<TeacherFormState>>
}

export function TeacherEditorForm({ teacher, setTeacher }: TeacherEditorFormProps) {
  return (
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
      <div style={{ marginBottom: '16px' }}>
        <ImageUploadControl
          label="Teacher Profile Photo / Headshot"
          value={teacher.photoUrl}
          onChange={(url) => setTeacher((prev) => ({ ...prev, photoUrl: url || '' }))}
          aspectRatio="portrait"
          fallbackInitial={teacher.name ? teacher.name.slice(0, 2).toUpperCase() : 'TC'}
          pickerTitle="Select Teacher Headshot Photo"
          helperText="Professional headshot displayed in public faculty directory."
        />
      </div>
      <div className="form-grid">
        <label>
          Full name *
          <input
            required
            placeholder="e.g. Dr. Mahmud Karim"
            value={teacher.name}
            onChange={(e) =>
              setTeacher((prev) => ({ ...prev, name: e.target.value }))
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
              setTeacher((prev) => ({ ...prev, designation: e.target.value }))
            }
          />
        </label>
        <label>
          Department *
          <select
            value={teacher.department}
            onChange={(e) =>
              setTeacher((prev) => ({ ...prev, department: e.target.value }))
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
              setTeacher((prev) => ({ ...prev, qualification: e.target.value }))
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
              setTeacher((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>
        <label>
          Display Order
          <input
            type="number"
            value={teacher.order}
            onChange={(e) =>
              setTeacher((prev) => ({
                ...prev,
                order: Number(e.target.value) || 1,
              }))
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
              setTeacher((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
        </label>
      </div>
    </div>
  )
}
