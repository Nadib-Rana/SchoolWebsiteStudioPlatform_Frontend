'use client'

import { Icon } from '@/components/common/Icon'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'

export interface GoverningMemberFormState {
  name: string
  designation: string
  category: string
  qualification: string
  termPeriod: string
  email: string
  phone: string
  message: string
  photoUrl: string
  isFeatured: boolean
  order: number
  status: string
}

interface GoverningBodyEditorFormProps {
  member: GoverningMemberFormState
  setMember: React.Dispatch<React.SetStateAction<GoverningMemberFormState>>
}

const DESIGNATION_SUGGESTIONS = [
  'Chairman',
  'President',
  'Vice Chairman',
  'Member Secretary',
  'Guardian Representative',
  'Donor Member',
  'Teacher Representative',
  'Educationist Member',
]

export function GoverningBodyEditorForm({
  member,
  setMember,
}: GoverningBodyEditorFormProps) {
  return (
    <div className="modal-form">
      <div className="privacy-note">
        <Icon name="eye" />
        <div>
          <strong>Public governance directory</strong>
          <p>
            Only approved leadership profiles, roles, and committee messages are
            shown on your public school website.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <ImageUploadControl
          label="Member Portrait Photo"
          value={member.photoUrl}
          onChange={(url) =>
            setMember((prev) => ({ ...prev, photoUrl: url || '' }))
          }
          aspectRatio="portrait"
          fallbackInitial={
            member.name ? member.name.slice(0, 2).toUpperCase() : 'GB'
          }
          pickerTitle="Select Committee Member Photo"
          helperText="Official portrait displayed in the Governing Body & Managing Committee section."
        />
      </div>

      <div className="form-grid">
        <label>
          Full Name *
          <input
            required
            placeholder="e.g. Alhaj Md. Habibur Rahman"
            value={member.name}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>

        <label>
          Designation *
          <input
            required
            list="governing-designation-suggestions"
            placeholder="e.g. Chairman, Member Secretary"
            value={member.designation}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, designation: e.target.value }))
            }
          />
          <datalist id="governing-designation-suggestions">
            {DESIGNATION_SUGGESTIONS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>

        <label>
          Committee Category
          <select
            value={member.category}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="GOVERNING_BODY">Governing Body</option>
            <option value="MANAGING_COMMITTEE">Managing Committee (SMC)</option>
            <option value="BOARD_OF_TRUSTEES">Board of Trustees</option>
            <option value="ADVISORY_BOARD">Advisory Board</option>
          </select>
        </label>

        <label>
          Term Period
          <input
            placeholder="e.g. 2025–2027"
            value={member.termPeriod}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, termPeriod: e.target.value }))
            }
          />
        </label>

        <label>
          Qualification / Profession
          <input
            placeholder="e.g. M.A., Educationist"
            value={member.qualification}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, qualification: e.target.value }))
            }
          />
        </label>

        <label>
          Display Order
          <input
            type="number"
            value={member.order}
            onChange={(e) =>
              setMember((prev) => ({
                ...prev,
                order: Number(e.target.value) || 1,
              }))
            }
          />
        </label>

        <label>
          Public Email (Optional)
          <input
            type="email"
            placeholder="chairman@school.edu"
            value={member.email}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>

        <label>
          Public Phone / Office Contact (Optional)
          <input
            placeholder="e.g. +880 1711-000000"
            value={member.phone}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </label>

        <label className="full flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={member.isFeatured}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, isFeatured: e.target.checked }))
            }
            className="w-4 h-4 accent-blue-700"
          />
          <span>
            Highlight as Chairman / President Spotlight (featured card at the top)
          </span>
        </label>

        <label className="full">
          Message / Biography
          <textarea
            rows={3}
            placeholder="Short leadership message or introduction displayed on the public website"
            value={member.message}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, message: e.target.value }))
            }
          />
        </label>
      </div>
    </div>
  )
}

