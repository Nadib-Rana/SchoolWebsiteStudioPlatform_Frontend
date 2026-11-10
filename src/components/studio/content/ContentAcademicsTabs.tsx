'use client'

import type { ContentFormData } from './content-manager.types'

interface ContentAcademicsTabsProps {
  activeItem: number
  formData: ContentFormData
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>
}

export function ContentAcademicsTabs({
  activeItem,
  formData,
  setFormData,
}: ContentAcademicsTabsProps) {
  // Tab 3: Academic Information
  if (activeItem === 3) {
    return (
      <div className="form-grid">
        <label className="full">
          Approved Curriculums
          <input
            value={formData.curriculum}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, curriculum: e.target.value }))
            }
          />
        </label>
        <label className="full">
          Academic Divisions & Levels
          <textarea
            rows={4}
            value={formData.academicLevels}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                academicLevels: e.target.value,
              }))
            }
          />
        </label>
      </div>
    )
  }

  // Tab 4: Classes and Grades
  if (activeItem === 4) {
    return (
      <div className="form-grid">
        <label className="full">
          Grade Levels Offered
          <input
            value={formData.gradesOffered}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gradesOffered: e.target.value }))
            }
          />
        </label>
        <label className="full">
          Average Class & Cohort Size
          <input
            value={formData.classSize}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, classSize: e.target.value }))
            }
          />
        </label>
      </div>
    )
  }

  // Tab 5: Subjects
  if (activeItem === 5) {
    return (
      <div className="form-grid">
        <label className="full">
          Curriculum Subjects & Electives Summary
          <textarea
            rows={5}
            value={formData.subjectsSummary}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                subjectsSummary: e.target.value,
              }))
            }
          />
        </label>
      </div>
    )
  }

  // Tab 6: Facilities
  if (activeItem === 6) {
    return (
      <div className="form-grid">
        <label className="full">
          Campus Facilities & Infrastructure Highlights
          <textarea
            rows={5}
            value={formData.facilitiesOverview}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                facilitiesOverview: e.target.value,
              }))
            }
          />
        </label>
      </div>
    )
  }

  // Tab 7: Achievements
  if (activeItem === 7) {
    return (
      <div className="form-grid">
        <label className="full">
          School Accreditations, Awards & Notable Distinctions
          <textarea
            rows={5}
            value={formData.achievementsText}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                achievementsText: e.target.value,
              }))
            }
          />
        </label>
      </div>
    )
  }

  return null
}
