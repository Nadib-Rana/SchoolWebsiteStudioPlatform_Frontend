'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { revalidatePublicSite } from '@/lib/revalidate-client'

interface AcademicProgramTier {
  level: string
  desc: string
  icon: string
}

const DEFAULT_PROGRAMS: AcademicProgramTier[] = [
  {
    level: 'Primary Years (Grades 1–5)',
    desc: 'Building fundamental literacy, numerical fluency, scientific curiosity, and emotional intelligence in a collaborative environment.',
    icon: 'sparkle',
  },
  {
    level: 'Middle School (Grades 6–8)',
    desc: 'Developing critical inquiry, analytical writing, laboratory experimentation, and independent research skills.',
    icon: 'layers',
  },
  {
    level: 'Senior Secondary (Grades 9–12)',
    desc: 'Rigorous preparation for university entrance, career pathways, advanced electives, and community leadership initiatives.',
    icon: 'file',
  },
]

export function Academics() {
  const { setView, notify, currentSchool, schoolSwitchKey } = useStudio()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rawAcademics, setRawAcademics] = useState<Record<string, any>>({})

  const [heroKicker, setHeroKicker] = useState('CURRICULUM & SCHOLARSHIP')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Inspiring students toward intellectual curiosity, critical thinking, and character-driven leadership.',
  )
  const [frameworkKicker, setFrameworkKicker] = useState('LEARNING FRAMEWORK')
  const [frameworkHeading, setFrameworkHeading] = useState(
    'A structured continuum of excellence.',
  )

  const [programs, setPrograms] = useState<AcademicProgramTier[]>(DEFAULT_PROGRAMS)
  const [curriculum, setCurriculum] = useState(
    'National Standard Curriculum complemented by international STEM and inquiry-based learning modules.',
  )
  const [grades, setGrades] = useState('Grades 1 through 12')
  const [subjects, setSubjects] = useState(
    'Core disciplines in Mathematics, Natural Sciences, Computing & Robotics, Language Arts, Social Sciences, Visual Arts, and Physical Education.',
  )
  const [facilities, setFacilities] = useState(
    'State-of-the-art physics, chemistry, and biology laboratories, high-speed digital computing center, multimedia library, indoor sports pavilion, and creative arts studio.',
  )
  const [achievements, setAchievements] = useState(
    'Consistently ranked in the top academic tier for college readiness, national Olympiad honors, and regional robotics championships.',
  )

  useEffect(() => {
    let mounted = true
    const loadAcademics = async () => {
      setLoading(true)
      try {
        const res = await api.content.get()
        const data = (res as any)?.data || res
        const schoolName = data?.school?.name || currentSchool?.name || ''
        const ac = (data?.profile?.academics || {}) as Record<string, any>
        if (!mounted) return

        setRawAcademics(ac)
        if (typeof ac.heroKicker === 'string' && ac.heroKicker) {
          setHeroKicker(ac.heroKicker)
        }
        setHeroTitle(
          typeof ac.heroTitle === 'string' && ac.heroTitle
            ? ac.heroTitle
            : schoolName
              ? `Academic Programs at ${schoolName}`
              : 'Academic Programs',
        )
        if (typeof ac.heroSubtitle === 'string' && ac.heroSubtitle) {
          setHeroSubtitle(ac.heroSubtitle)
        }
        if (typeof ac.frameworkKicker === 'string' && ac.frameworkKicker) {
          setFrameworkKicker(ac.frameworkKicker)
        }
        if (typeof ac.frameworkHeading === 'string' && ac.frameworkHeading) {
          setFrameworkHeading(ac.frameworkHeading)
        }
        if (Array.isArray(ac.programs) && ac.programs.length > 0) {
          setPrograms(
            ac.programs.map((p: any) => ({
              level: p?.level || '',
              desc: p?.desc || '',
              icon: p?.icon || 'sparkle',
            })),
          )
        } else {
          setPrograms(DEFAULT_PROGRAMS)
        }
        if (typeof ac.curriculum === 'string' && ac.curriculum) {
          setCurriculum(ac.curriculum)
        }
        if (typeof (ac.grades || ac.gradesOffered) === 'string') {
          setGrades(ac.grades || ac.gradesOffered)
        }
        if (typeof (ac.subjects || ac.subjectsSummary) === 'string') {
          setSubjects(ac.subjects || ac.subjectsSummary)
        }
        if (typeof (ac.facilities || ac.facilitiesOverview) === 'string') {
          setFacilities(ac.facilities || ac.facilitiesOverview)
        }
        if (typeof (ac.achievements || ac.achievementsText) === 'string') {
          setAchievements(ac.achievements || ac.achievementsText)
        }
      } catch (err) {
        console.warn('Failed to load academic data:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadAcademics()
    return () => {
      mounted = false
    }
  }, [currentSchool?.id, currentSchool?.name, schoolSwitchKey])

  const handleSave = async () => {
    setSaving(true)
    try {
      const cleanedPrograms = programs
        .filter((p) => p.level.trim() || p.desc.trim())
        .map((p) => ({
          level: p.level.trim(),
          desc: p.desc.trim(),
          icon: p.icon || 'sparkle',
        }))

      const updatedAcademics = {
        ...rawAcademics,
        heroKicker: heroKicker.trim(),
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        frameworkKicker: frameworkKicker.trim(),
        frameworkHeading: frameworkHeading.trim(),
        programs: cleanedPrograms,
        curriculum: curriculum.trim(),
        grades: grades.trim(),
        gradesOffered: grades.trim(),
        subjects: subjects.trim(),
        subjectsSummary: subjects.trim(),
        facilities: facilities.trim(),
        facilitiesOverview: facilities.trim(),
        achievements: achievements.trim(),
        achievementsText: achievements.trim(),
      }

      await api.content.update({ academics: updatedAcademics })
      setRawAcademics(updatedAcademics)
      await revalidatePublicSite(currentSchool?.slug || api.getActiveSchoolSlug())
      notify('Academic Programs page saved and published live!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save academics.'
      notify(`Error: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const cards: Array<[string, string, string]> = [
    ['Academic programs', String(programs.length || 3), 'Divisions shown on /academics'],
    ['Classes & grades', grades || 'Grades 1–12', 'Offered grade range'],
    ['Curriculum & Subjects', 'Configured', 'Core academic standards'],
    ['Facilities & Labs', 'Configured', 'Learning infrastructure'],
    ['Achievements', 'Configured', 'Honors & distinctions'],
  ]

  return (
    <div className="space-y-6">
      <div className="academic-grid">
        {cards.map((x, i) => (
          <div className="card academic-card" key={x[0]}>
            <span className={`academic-icon a${i}`}>
              <Icon name={i === 3 ? 'home' : i === 4 ? 'sparkle' : 'file'} />
            </span>
            <div>
              <small>{x[0]}</small>
              <strong>{x[1]}</strong>
              <p>{x[2]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Public Academics Page (/{currentSchool?.slug || 'school'}/academics)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize page headings, Academic Program division cards, curriculum, grades, facilities, and honors directly here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setView('content')} disabled={saving}>
              Open School Content
            </Button>
            <Button kind="primary" icon="check" onClick={handleSave} disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save & Publish Academics'}
            </Button>
          </div>
        </div>

        <div className="form-grid mb-6">
          <label>
            Hero Eyebrow / Kicker
            <input
              value={heroKicker}
              onChange={(e) => setHeroKicker(e.target.value)}
              placeholder="CURRICULUM & SCHOLARSHIP"
            />
          </label>
          <label>
            Page Title (Hero Heading)
            <input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Academic Programs at Your School"
            />
          </label>
          <label className="full">
            Hero Subtitle / Description
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </label>
          <label>
            Framework Kicker
            <input
              value={frameworkKicker}
              onChange={(e) => setFrameworkKicker(e.target.value)}
              placeholder="LEARNING FRAMEWORK"
            />
          </label>
          <label>
            Framework Heading
            <input
              value={frameworkHeading}
              onChange={(e) => setFrameworkHeading(e.target.value)}
              placeholder="A structured continuum of excellence."
            />
          </label>
        </div>

        <div className="pt-5 mb-6 border-t border-slate-200">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <strong className="block text-sm text-slate-900">
                Academic Program Divisions (Top Cards)
              </strong>
              <span className="text-xs text-slate-500">
                Each division renders as a card on your /academics page.
              </span>
            </div>
            <Button
              icon="plus"
              onClick={() =>
                setPrograms((prev) => [
                  ...prev,
                  { level: '', desc: '', icon: 'sparkle' },
                ])
              }
            >
              Add Program Division
            </Button>
          </div>

          <div className="space-y-3">
            {programs.map((prog, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Division #{index + 1}
                  </span>
                  {programs.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPrograms((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <label>
                    Division Title
                    <input
                      value={prog.level}
                      placeholder="e.g. Primary Years (Grades 1–5)"
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, level: e.target.value } : item,
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    Icon
                    <select
                      value={prog.icon}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, icon: e.target.value } : item,
                          ),
                        )
                      }
                    >
                      <option value="sparkle">Sparkle / Excellence</option>
                      <option value="layers">Layers / Levels</option>
                      <option value="file">Academic Document</option>
                      <option value="users">Students / Faculty</option>
                      <option value="globe">International / Global</option>
                    </select>
                  </label>
                  <label className="full">
                    Description
                    <textarea
                      rows={2}
                      value={prog.desc}
                      placeholder="Brief summary of this division's curriculum focus..."
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, desc: e.target.value } : item,
                          ),
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-slate-200 form-grid">
          <label>
            Classes &amp; Grades Offered
            <input
              value={grades}
              onChange={(e) => setGrades(e.target.value)}
              placeholder="Kindergarten through Grade 12"
            />
          </label>
          <label>
            Curriculum &amp; Instruction Standard
            <textarea
              rows={2}
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
            />
          </label>
          <label>
            Subjects &amp; Specializations
            <textarea
              rows={3}
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            />
          </label>
          <label>
            Learning Facilities Overview
            <textarea
              rows={3}
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
            />
          </label>
          <label className="full">
            Academic Honors &amp; Distinctions
            <textarea
              rows={2}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-end mt-5">
          <Button kind="primary" icon="check" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save & Publish Academics'}
          </Button>
        </div>
      </div>
    </div>
  )
}
