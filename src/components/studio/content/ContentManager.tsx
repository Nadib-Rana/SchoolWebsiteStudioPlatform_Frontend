'use client'

import { Button } from '@/components/common/Button'
import { StateBadge } from '@/components/common/StateBadge'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState } from 'react'
import {
  type ContentFormData,
  INITIAL_CONTENT_FORM_DATA,
} from './content-manager.types'
import { ContentSchoolInfoTab } from './ContentSchoolInfoTab'
import { ContentAboutPrincipalTabs } from './ContentAboutPrincipalTabs'
import { ContentAcademicsTabs } from './ContentAcademicsTabs'
import { ContentSidebarNav } from './ContentSidebarNav'

export function ContentManager() {
  const { notify, currentSchool, schoolSwitchKey } = useStudio()
  const [activeItem, setActiveItem] = useState(0)
  const [items, setItems] = useState<Array<[string, string, string]>>([
    ['School information', 'Core identity, contact details, logo and address', '100%'],
    ['About school', 'History, mission, vision and educational values', '92%'],
    ['Principal message', 'Public welcome message and principal profile', '100%'],
    ['Academic information', 'Curriculum, teaching approach and school calendar', '85%'],
    ['Classes and grades', 'Grade levels, sections and enrollment information', '85%'],
    ['Subjects', 'Subject catalog organized by grade and program', '75%'],
    ['Facilities', 'Campus facilities and approved public details', '90%'],
    ['Achievements', 'Awards, distinctions and school milestones', '80%'],
  ])

  const [formData, setFormData] = useState<ContentFormData>(INITIAL_CONTENT_FORM_DATA)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState('Just now')

  useEffect(() => {
    let mounted = true
    const loadContent = async () => {
      try {
        const res = await api.content.get()
        const data = (res as any)?.data || res
        if (mounted && data) {
          if (data.completionItems?.length) {
            setItems(
              data.completionItems.map((c: any) => [c.name, c.description, c.progress]),
            )
          }
          if (data.profile) {
            const p = data.profile
            const ac = p.academics || {}
            setFormData((prev) => ({
              ...prev,
              schoolName: data.school?.name || prev.schoolName,
              logoUrl: data.school?.logoUrl || prev.logoUrl,
              faviconUrl: data.school?.faviconUrl || prev.faviconUrl,
              coverUrl: p.coverUrl || prev.coverUrl,
              address: p.address || prev.address,
              phone: p.phone || prev.phone,
              email: p.email || prev.email,
              establishedYear: p.established ? String(p.established) : prev.establishedYear,
              schoolCode: p.schoolCode || prev.schoolCode,
              officeHours: p.officeHours || prev.officeHours,
              motto: p.motto || prev.motto,
              shortBio: p.shortBio || prev.shortBio,
              missionStatement: p.missionStatement || prev.missionStatement,
              visionStatement: p.visionStatement || prev.visionStatement,
              principalName: p.principalName || prev.principalName,
              principalTitle: p.principalTitle || prev.principalTitle,
              principalBio: p.principalBio || prev.principalBio,
              principalPhotoUrl: p.principalPhotoUrl || prev.principalPhotoUrl,
              curriculum: ac.curriculum || prev.curriculum,
              academicLevels: ac.levels || prev.academicLevels,
              gradesOffered: ac.grades || prev.gradesOffered,
              classSize: ac.classSize || prev.classSize,
              subjectsSummary: ac.subjects || prev.subjectsSummary,
              facilitiesOverview: ac.facilities || prev.facilitiesOverview,
              achievementsText: ac.achievements || prev.achievementsText,
            }))
          }
        }
      } catch (err) {
        console.warn('Failed to load school profile content:', err)
      }
    }
    loadContent()
    return () => {
      mounted = false
    }
  }, [currentSchool?.id, schoolSwitchKey])

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      await api.content.update({
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        logoUrl: formData.logoUrl || undefined,
        faviconUrl: formData.faviconUrl || undefined,
        coverUrl: formData.coverUrl || undefined,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        officeHours: formData.officeHours,
        established: parseInt(formData.establishedYear, 10) || 1983,
        establishedYear: parseInt(formData.establishedYear, 10) || 1983,
        schoolCode: formData.schoolCode,
        motto: formData.motto,
        shortBio: formData.shortBio,
        missionStatement: formData.missionStatement,
        visionStatement: formData.visionStatement,
        principalName: formData.principalName,
        principalTitle: formData.principalTitle,
        principalBio: formData.principalBio,
        principalPhotoUrl: formData.principalPhotoUrl || undefined,
        academics: {
          curriculum: formData.curriculum,
          levels: formData.academicLevels,
          grades: formData.gradesOffered,
          classSize: formData.classSize,
          subjects: formData.subjectsSummary,
          facilities: formData.facilitiesOverview,
          achievements: formData.achievementsText,
        },
      })
      setLastSaved(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      )
      notify(
        publish
          ? 'School information published to live website'
          : 'Draft saved to database',
      )
    } catch (err) {
      console.error('Failed to save content:', err)
      notify('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="content-layout">
      <ContentSidebarNav
        items={items}
        activeItem={activeItem}
        onSelectItem={setActiveItem}
      />

      <div className="card content-form">
        <div className="form-title">
          <div>
            <h3>{items[activeItem]?.[0] || 'Content Section'}</h3>
            <p>{items[activeItem]?.[1] || 'Configure section details for public website.'}</p>
          </div>
          <StateBadge status="published">Database Connected</StateBadge>
        </div>

        {activeItem === 0 && (
          <ContentSchoolInfoTab
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {(activeItem === 1 || activeItem === 2) && (
          <ContentAboutPrincipalTabs
            activeItem={activeItem}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {activeItem >= 3 && (
          <ContentAcademicsTabs
            activeItem={activeItem}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        <div className="form-actions">
          <span>Last saved: {lastSaved}</span>
          <Button onClick={() => handleSave(false)} disabled={saving}>
            {saving ? 'Saving...' : 'Save draft'}
          </Button>
          <Button
            kind="primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            Publish changes
          </Button>
        </div>
      </div>
    </div>
  )
}
