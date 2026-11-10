'use client'

import { ImageUploadControl } from '@/components/common/ImageUploadControl'
import type { ContentFormData } from './content-manager.types'

interface ContentAboutPrincipalTabsProps {
  activeItem: number
  formData: ContentFormData
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>
}

export function ContentAboutPrincipalTabs({
  activeItem,
  formData,
  setFormData,
}: ContentAboutPrincipalTabsProps) {
  if (activeItem === 1) {
    return (
      <div className="form-grid">
        <label className="full">
          School Motto / Tagline
          <input
            value={formData.motto}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, motto: e.target.value }))
            }
          />
        </label>
        <label className="full">
          Short School Biography
          <textarea
            rows={3}
            value={formData.shortBio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shortBio: e.target.value }))
            }
          />
        </label>
        <label className="full">
          Mission Statement
          <textarea
            rows={3}
            value={formData.missionStatement}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                missionStatement: e.target.value,
              }))
            }
          />
        </label>
        <label className="full">
          Vision Statement
          <textarea
            rows={3}
            value={formData.visionStatement}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                visionStatement: e.target.value,
              }))
            }
          />
        </label>
      </div>
    )
  }

  if (activeItem === 2) {
    return (
      <div className="form-grid">
        <label>
          Principal Name
          <input
            value={formData.principalName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, principalName: e.target.value }))
            }
          />
        </label>
        <label>
          Official Title
          <input
            value={formData.principalTitle}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                principalTitle: e.target.value,
              }))
            }
          />
        </label>
        <div className="full" style={{ marginBottom: '16px' }}>
          <ImageUploadControl
            label="Principal Portrait Headshot"
            value={formData.principalPhotoUrl}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                principalPhotoUrl: url || '',
              }))
            }
            aspectRatio="portrait"
            pickerTitle="Select Principal Portrait Photo"
            helperText="Official school administrator portrait displayed on homepage and principal message page."
          />
        </div>
        <label className="full">
          Welcome Message & Biography
          <textarea
            rows={5}
            value={formData.principalBio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, principalBio: e.target.value }))
            }
          />
        </label>
      </div>
    )
  }

  return null
}
