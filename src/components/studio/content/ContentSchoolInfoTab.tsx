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
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
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
          helperText="PNG, JPG or WebP for public navbar."
        />
        <ImageUploadControl
          label="Website Favicon"
          value={formData.faviconUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, faviconUrl: url || '' }))}
          aspectRatio="square"
          fallbackInitial={(formData.schoolName || 'N').charAt(0)}
          pickerTitle="Select Website Favicon"
          helperText="32×32 or 64×64 px for browser tab & bookmarks."
        />
        <ImageUploadControl
          label="Campus Cover Banner"
          value={formData.coverUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, coverUrl: url || '' }))}
          aspectRatio="video"
          pickerTitle="Select Campus Cover Banner"
          helperText="Wide cover photo for profile header and live banner."
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

      <div
        style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
          ERP Login &amp; Public Social Profile Links
        </strong>
        <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
          Links saved here appear in your public website Footer and Header (ERP Login button). Leave any field blank to hide it.
        </span>

        <div className="form-grid">
          <label>
            ERP Login Portal URL
            <input
              type="url"
              placeholder="https://erp.yourschool.com/login"
              value={formData.erpLoginUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, erpLoginUrl: e.target.value }))
              }
            />
          </label>
          <label>
            ERP Button Label
            <input
              placeholder="ERP Login"
              value={formData.erpLoginLabel}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, erpLoginLabel: e.target.value }))
              }
            />
          </label>
          <label>
            Facebook Page URL
            <input
              type="url"
              placeholder="https://facebook.com/yourschool"
              value={formData.facebookUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))
              }
            />
          </label>
          <label>
            YouTube Channel URL
            <input
              type="url"
              placeholder="https://youtube.com/@yourschool"
              value={formData.youtubeUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))
              }
            />
          </label>
          <label>
            Instagram URL
            <input
              type="url"
              placeholder="https://instagram.com/yourschool"
              value={formData.instagramUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))
              }
            />
          </label>
          <label>
            LinkedIn Page URL
            <input
              type="url"
              placeholder="https://linkedin.com/school/yourschool"
              value={formData.linkedinUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
              }
            />
          </label>
          <label>
            X (Twitter) URL
            <input
              type="url"
              placeholder="https://x.com/yourschool"
              value={formData.twitterUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, twitterUrl: e.target.value }))
              }
            />
          </label>
          <label>
            Official Website / Portal URL
            <input
              type="url"
              placeholder="https://www.yourschool.edu.bd"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
              }
            />
          </label>
        </div>
      </div>
    </>
  )
}
