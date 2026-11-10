'use client'

import { ImageUploadControl } from '@/components/common/ImageUploadControl'
import type { ContentFormData } from './content-manager.types'

interface ContentSchoolInfoTabProps {
  formData: ContentFormData
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>
}

export function ContentSchoolInfoTab({
  formData,
  setFormData,
}: ContentSchoolInfoTabProps) {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, 1fr) minmax(240px, 2fr)',
          gap: '20px',
          marginBottom: '24px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <ImageUploadControl
          label="School Logo"
          value={formData.logoUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url || '' }))}
          aspectRatio="square"
          fallbackInitial={(formData.schoolName || 'N').charAt(0)}
          pickerTitle="Select School Logo"
          helperText="PNG, JPG or SVG. Displayed in public navbar and header."
        />
        <ImageUploadControl
          label="Campus Cover Banner"
          value={formData.coverUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, coverUrl: url || '' }))}
          aspectRatio="video"
          pickerTitle="Select Campus Cover Banner"
          helperText="Wide cover photo for profile header and live campus banner."
        />
      </div>

      <div className="form-grid">
        <label>
          School name *
          <input
            value={formData.schoolName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, schoolName: e.target.value }))
            }
          />
        </label>
        <label>
          School type
          <select
            value={formData.schoolType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, schoolType: e.target.value }))
            }
          >
            <option>Secondary school</option>
            <option>Primary school</option>
            <option>Higher Secondary</option>
            <option>K-12 Academy</option>
          </select>
        </label>
        <label className="full">
          School campus address *
          <input
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </label>
        <label>
          Contact telephone
          <input
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </label>
        <label>
          Official email
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>
        <label>
          Established year
          <input
            value={formData.establishedYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                establishedYear: e.target.value,
              }))
            }
          />
        </label>
        <label>
          School registry code
          <input
            value={formData.schoolCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, schoolCode: e.target.value }))
            }
          />
        </label>
        <label className="full">
          Operating office hours
          <input
            value={formData.officeHours}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, officeHours: e.target.value }))
            }
          />
        </label>
      </div>
    </>
  )
}
