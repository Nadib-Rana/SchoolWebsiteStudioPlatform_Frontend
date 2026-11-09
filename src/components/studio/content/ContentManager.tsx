'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { StateBadge } from '@/components/common/StateBadge'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useEffect, useState, useRef } from 'react'

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

  const [formData, setFormData] = useState({
    // Tab 0: School Information
    schoolName: 'Northfield High School',
    schoolType: 'Secondary school',
    address: '27 Lakeview Avenue, Dhanmondi, Dhaka 1209',
    phone: '+880 2 555 0142',
    email: 'hello@northfield.edu',
    establishedYear: '1983',
    schoolCode: 'NHS-1042',
    officeHours: 'Monday - Friday: 8:00 AM - 4:30 PM',

    // Tab 1: About School
    motto: 'Excellence in Education, Leadership in Character',
    shortBio: 'Northfield High School has provided excellence in secondary education for over four decades.',
    missionStatement: 'To provide an inclusive, inspiring environment where curiosity is celebrated and students are prepared for purposeful lives.',
    visionStatement: 'To cultivate empathetic, forward-thinking scholars and leaders who contribute meaningfully to society.',

    // Tab 2: Principal Message
    principalName: 'Dr. Farhana Noor',
    principalTitle: 'Principal & Head Administrator',
    principalBio: 'At Northfield, we pair high expectations with genuine care. Our students learn to think deeply, act with integrity, and use their gifts in service of others.',
    principalPhotoUrl: '',

    // Tab 3: Academics
    curriculum: 'National Curriculum & Cambridge International',
    academicLevels: 'Primary (Grades 1-5), Middle (Grades 6-8), Senior (Grades 9-12)',

    // Tab 4: Classes & Grades
    gradesOffered: 'Grades 1 through 12',
    classSize: '24-28 students per section',

    // Tab 5: Subjects
    subjectsSummary: 'Core: Mathematics, Sciences, English Literature, History, ICT. Electives: Robotics, Studio Art, Music, French.',

    // Tab 6: Facilities
    facilitiesOverview: 'Modern Science Laboratories, Digital Media Library, Sports Complex, Auditorium, Visual Arts Wing.',

    // Tab 7: Achievements
    achievementsText: 'Top 1% National STEM Competition, Regional Debate Champions 2025, Eco-School Green Flag Award.',
  })

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState('Just now')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoUploadRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
        notify(`Logo "${file.name}" selected. Click "Save changes" to persist.`)
      }
      reader.readAsDataURL(file)
    }
  }

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
      {/* Sidebar Section Selectors */}
      <div className="content-list">
        {items.map((x, i) => (
          <button
            type="button"
            className={activeItem === i ? 'active' : ''}
            onClick={() => setActiveItem(i)}
            key={x[0]}
          >
            <span className={`content-icon c${i}`}>
              <Icon
                name={i > 5 ? 'sparkle' : i > 2 ? 'file' : 'home'}
                size={17}
              />
            </span>
            <div>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
              <em>
                <i style={{ width: x[2] }} />
                {x[2]} complete
              </em>
            </div>
            <Icon name="chevron" size={15} />
          </button>
        ))}
      </div>

      {/* Dynamic Content Form */}
      <div className="card content-form">
        <div className="form-title">
          <div>
            <h3>{items[activeItem]?.[0] || 'Content Section'}</h3>
            <p>{items[activeItem]?.[1] || 'Configure section details for public website.'}</p>
          </div>
          <StateBadge status="published">Database Connected</StateBadge>
        </div>

        {/* Tab 0: School Information */}
        {activeItem === 0 && (
          <>
            <div className="logo-upload">
              <input
                type="file"
                ref={logoUploadRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleLogoUpload}
              />
              <div
                style={{
                  backgroundImage: logoPreview ? `url(${logoPreview})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!logoPreview && (formData.schoolName || 'N').charAt(0)}
              </div>
              <span>
                <strong>School logo</strong>
                <small>PNG, JPG or SVG · Managed via MinIO</small>
                <button
                  type="button"
                  onClick={() => logoUploadRef.current?.click()}
                >
                  {logoPreview ? 'Change logo' : 'Upload logo'}
                </button>
              </span>
            </div>

            <div className="form-grid">
              <label>
                School name *
                <input
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                />
              </label>
              <label>
                School type
                <select
                  value={formData.schoolType}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolType: e.target.value })
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
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </label>
              <label>
                Contact telephone
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </label>
              <label>
                Official email
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </label>
              <label>
                Established year
                <input
                  value={formData.establishedYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      establishedYear: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                School registry code
                <input
                  value={formData.schoolCode}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolCode: e.target.value })
                  }
                />
              </label>
              <label className="full">
                Operating office hours
                <input
                  value={formData.officeHours}
                  onChange={(e) =>
                    setFormData({ ...formData, officeHours: e.target.value })
                  }
                />
              </label>
            </div>
          </>
        )}

        {/* Tab 1: About School */}
        {activeItem === 1 && (
          <div className="form-grid">
            <label className="full">
              School Motto / Tagline
              <input
                value={formData.motto}
                onChange={(e) =>
                  setFormData({ ...formData, motto: e.target.value })
                }
              />
            </label>
            <label className="full">
              Short School Biography
              <textarea
                rows={3}
                value={formData.shortBio}
                onChange={(e) =>
                  setFormData({ ...formData, shortBio: e.target.value })
                }
              />
            </label>
            <label className="full">
              Mission Statement
              <textarea
                rows={3}
                value={formData.missionStatement}
                onChange={(e) =>
                  setFormData({ ...formData, missionStatement: e.target.value })
                }
              />
            </label>
            <label className="full">
              Vision Statement
              <textarea
                rows={3}
                value={formData.visionStatement}
                onChange={(e) =>
                  setFormData({ ...formData, visionStatement: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 2: Principal Message */}
        {activeItem === 2 && (
          <div className="form-grid">
            <label>
              Principal Name
              <input
                value={formData.principalName}
                onChange={(e) =>
                  setFormData({ ...formData, principalName: e.target.value })
                }
              />
            </label>
            <label>
              Official Title
              <input
                value={formData.principalTitle}
                onChange={(e) =>
                  setFormData({ ...formData, principalTitle: e.target.value })
                }
              />
            </label>
            <label className="full">
              Principal Portrait URL
              <input
                placeholder="https://images.unsplash.com/..."
                value={formData.principalPhotoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, principalPhotoUrl: e.target.value })
                }
              />
            </label>
            <label className="full">
              Welcome Message & Biography
              <textarea
                rows={5}
                value={formData.principalBio}
                onChange={(e) =>
                  setFormData({ ...formData, principalBio: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 3: Academic Information */}
        {activeItem === 3 && (
          <div className="form-grid">
            <label className="full">
              Approved Curriculums
              <input
                value={formData.curriculum}
                onChange={(e) =>
                  setFormData({ ...formData, curriculum: e.target.value })
                }
              />
            </label>
            <label className="full">
              Academic Divisions & Levels
              <textarea
                rows={4}
                value={formData.academicLevels}
                onChange={(e) =>
                  setFormData({ ...formData, academicLevels: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 4: Classes and Grades */}
        {activeItem === 4 && (
          <div className="form-grid">
            <label className="full">
              Grade Levels Offered
              <input
                value={formData.gradesOffered}
                onChange={(e) =>
                  setFormData({ ...formData, gradesOffered: e.target.value })
                }
              />
            </label>
            <label className="full">
              Average Class & Cohort Size
              <input
                value={formData.classSize}
                onChange={(e) =>
                  setFormData({ ...formData, classSize: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 5: Subjects */}
        {activeItem === 5 && (
          <div className="form-grid">
            <label className="full">
              Curriculum Subjects & Electives Summary
              <textarea
                rows={5}
                value={formData.subjectsSummary}
                onChange={(e) =>
                  setFormData({ ...formData, subjectsSummary: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 6: Facilities */}
        {activeItem === 6 && (
          <div className="form-grid">
            <label className="full">
              Campus Facilities & Infrastructure Highlights
              <textarea
                rows={5}
                value={formData.facilitiesOverview}
                onChange={(e) =>
                  setFormData({ ...formData, facilitiesOverview: e.target.value })
                }
              />
            </label>
          </div>
        )}

        {/* Tab 7: Achievements */}
        {activeItem === 7 && (
          <div className="form-grid">
            <label className="full">
              School Accreditations, Awards & Notable Distinctions
              <textarea
                rows={5}
                value={formData.achievementsText}
                onChange={(e) =>
                  setFormData({ ...formData, achievementsText: e.target.value })
                }
              />
            </label>
          </div>
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
