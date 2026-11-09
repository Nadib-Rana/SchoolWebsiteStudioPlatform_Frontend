'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage, templates } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useState } from 'react'

export function Onboarding() {
  const { setView, notify } = useStudio()
  const [step, setStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Step 1: School Information
  const [schoolName, setSchoolName] = useState('Riverside Academy')
  const [schoolType, setSchoolType] = useState('Secondary School')
  const [schoolAddress, setSchoolAddress] = useState('27 Lakeview Avenue, Dhanmondi, Dhaka')
  const [contactPhone, setContactPhone] = useState('+880 1712 998 877')
  const [contactEmail, setContactEmail] = useState('info@riverside.edu')
  const [establishedYear, setEstablishedYear] = useState('1995')

  // Step 2: Website Identity
  const [slug, setSlug] = useState('riverside-academy')
  const [description, setDescription] = useState(
    'A vibrant learning community where every student is known, challenged, and inspired.'
  )
  const [primaryColor, setPrimaryColor] = useState('#163D72')
  const [accentColor, setAccentColor] = useState('#E3AD3F')

  // Step 3: Template
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)

  // Step 4: Content
  const [principalName, setPrincipalName] = useState('Dr. Arthur Pendelton')
  const [principalDesignation, setPrincipalDesignation] = useState('Principal')
  const [academicOverview, setAcademicOverview] = useState(
    'Our connected learning journey spans Primary, Middle and Senior School.'
  )

  const steps = [
    'School information',
    'Website identity',
    'Choose template',
    'Initial content',
    'Preview & publish',
  ]

  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val)
    if (fieldErrors.schoolName) {
      setFieldErrors((prev) => ({ ...prev, schoolName: '' }))
    }
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    if (autoSlug) {
      setSlug(autoSlug)
      if (fieldErrors.slug) {
        setFieldErrors((prev) => ({ ...prev, slug: '' }))
      }
    }
  }

  const validateStep = (currentStep: number): boolean => {
    setErrorMessage('')
    const errors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!schoolName.trim()) {
        errors.schoolName = 'School name is required.'
      }
      if (!contactEmail.trim()) {
        errors.contactEmail = 'Public email is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
        errors.contactEmail = 'Please enter a valid email address (e.g. info@school.edu).'
      }
      if (!contactPhone.trim()) {
        errors.contactPhone = 'Contact phone number is required.'
      }
    }

    if (currentStep === 2) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
      if (!cleanSlug) {
        errors.slug = 'Website address (slug) is required.'
      } else if (cleanSlug.length < 3) {
        errors.slug = 'Website address must be at least 3 characters long.'
      } else if (cleanSlug !== slug) {
        errors.slug = 'Website address can only contain lowercase letters, numbers, and hyphens (no spaces or special symbols).'
      }
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please fix the highlighted errors before proceeding.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePublish = async () => {
    setErrorMessage('')
    if (!api.getAuthToken()) {
      setErrorMessage('You must be signed in to provision a school. Please sign in first.')
      return
    }

    if (!validateStep(1) || !validateStep(2)) {
      return
    }

    setIsPublishing(true)
    try {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        name: schoolName.trim(),
        slug: cleanSlug,
        templateId: templates[selectedTemplateIndex]?.name || 'Aster Academy',
        themePreset: 'theme-classic',
        primaryColor,
        principalName: principalName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        selectedPages: ['home', 'about', 'academics', 'admissions', 'teachers', 'contact'],
      }

      const res = await api.schools.onboarding(payload)
      const data = (res as any)?.data || res
      if (data?.id) {
        api.setActiveSchoolId(data.id)
        api.setActiveSchoolSlug(data.slug || cleanSlug)
      }
      notify(`School "${schoolName}" successfully registered & published!`)
      setView('overview')
    } catch (err: any) {
      console.error('[Onboarding] Error:', err)
      const msg = err?.message || ''
      if (msg.includes('already exists') || err?.status === 409) {
        setErrorMessage(
          `⚠️ The website address "${slug}" is already taken by another school. Please choose a different slug (e.g. "${slug}-academy" or "${slug}-school").`
        )
      } else {
        setErrorMessage(`⚠️ Registration failed: ${msg || 'Please check your connection and try again.'}`)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-head">
        <div className="brand-mark">
          <Icon name="layers" />
        </div>
        <strong>Register School: {schoolName}</strong>
        <Button kind="ghost" onClick={() => setView('overview')}>
          Save and exit
        </Button>
      </div>

      <div className="onboarding-body">
        <aside>
          <span>SETUP PROGRESS</span>
          <h2>Register your school</h2>
          <p>
            Complete these steps to provision your new public school website.
            All settings can be customized later in Studio.
          </p>
          {steps.map((x, i) => (
            <button
              key={x}
              type="button"
              className={
                step === i + 1 ? 'active' : step > i + 1 ? 'complete' : ''
              }
              onClick={() => {
                if (validateStep(step)) {
                  setStep(i + 1)
                }
              }}
            >
              <span>
                {step > i + 1 ? <Icon name="check" size={13} /> : i + 1}
              </span>
              <div>
                <small>STEP 0{i + 1}</small>
                <strong>{x}</strong>
              </div>
            </button>
          ))}
        </aside>

        <main>
          <div className="step-progress">
            <span>Step {step} of 5</span>
            <i>
              <b style={{ width: `${step * 20}%` }} />
            </i>
          </div>

          {/* Visible Error Banner */}
          {errorMessage && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '24px',
                color: '#991b1b',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                <span>⚠️</span>
                <span>Attention Required</span>
              </div>
              <div>{errorMessage}</div>
              {errorMessage.includes('already taken') && (
                <div style={{ marginTop: '4px' }}>
                  <Button
                    type="button"
                    onClick={() => {
                      setStep(2)
                      setErrorMessage('')
                    }}
                    style={{
                      background: '#b91c1c',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    Go to Step 2 to change URL
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <>
              <span className="eyebrow">TELL US ABOUT YOUR SCHOOL</span>
              <h1>Start with the essentials.</h1>
              <p>This information creates the foundation of your website.</p>
              <div className="logo-upload large">
                <div>{schoolName.slice(0, 2).toUpperCase() || 'SC'}</div>
                <span>
                  <strong>Upload school logo</strong>
                  <small>PNG, JPG or SVG · Recommended 512 × 512</small>
                  <button type="button" onClick={() => notify('Default logo assigned')}>
                    Choose image
                  </button>
                </span>
              </div>
              <div className="form-grid">
                <label>
                  School name <span style={{ color: '#ef4444' }}>*</span>
                  <input
                    value={schoolName}
                    onChange={(e) => handleSchoolNameChange(e.target.value)}
                    placeholder="e.g. Riverside Academy"
                    style={fieldErrors.schoolName ? { borderColor: '#ef4444' } : {}}
                  />
                  {fieldErrors.schoolName && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors.schoolName}
                    </small>
                  )}
                </label>
                <label>
                  School type
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value)}
                  >
                    <option value="Secondary School">Secondary School</option>
                    <option value="Primary & Secondary">Primary & Secondary</option>
                    <option value="College & Academy">College & Academy</option>
                  </select>
                </label>
                <label className="full">
                  School address
                  <input
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="e.g. 27 Lakeview Avenue, Dhaka"
                  />
                </label>
                <label>
                  Contact number <span style={{ color: '#ef4444' }}>*</span>
                  <input
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value)
                      if (fieldErrors.contactPhone) setFieldErrors((p) => ({ ...p, contactPhone: '' }))
                    }}
                    placeholder="+880 1712 000 000"
                    style={fieldErrors.contactPhone ? { borderColor: '#ef4444' } : {}}
                  />
                  {fieldErrors.contactPhone && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors.contactPhone}
                    </small>
                  )}
                </label>
                <label>
                  Public email <span style={{ color: '#ef4444' }}>*</span>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value)
                      if (fieldErrors.contactEmail) setFieldErrors((p) => ({ ...p, contactEmail: '' }))
                    }}
                    placeholder="info@school.edu"
                    style={fieldErrors.contactEmail ? { borderColor: '#ef4444' } : {}}
                  />
                  {fieldErrors.contactEmail && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors.contactEmail}
                    </small>
                  )}
                </label>
                <label>
                  Established year
                  <input
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(e.target.value)}
                    placeholder="1995"
                  />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className="eyebrow">CREATE YOUR IDENTITY</span>
              <h1>Make it unmistakably yours.</h1>
              <p>Choose a unique website address (slug), brand colors, and description.</p>
              <div className="form-grid">
                <label className="full">
                  Website name <span style={{ color: '#ef4444' }}>*</span>
                  <input
                    value={schoolName}
                    onChange={(e) => handleSchoolNameChange(e.target.value)}
                  />
                </label>
                <label className="full">
                  Website address (Slug) <span style={{ color: '#ef4444' }}>*</span>
                  <div className="slug-input" style={fieldErrors.slug ? { borderColor: '#ef4444' } : {}}>
                    <span>schoolcanvas.app/</span>
                    <input
                      value={slug}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        setSlug(val)
                        if (fieldErrors.slug) setFieldErrors((p) => ({ ...p, slug: '' }))
                      }}
                      placeholder="e.g. riverside-academy"
                    />
                  </div>
                  {fieldErrors.slug ? (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      {fieldErrors.slug}
                    </small>
                  ) : (
                    <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      Your public website URL will be: <strong>http://localhost:3000/{slug || 'your-school'}</strong>
                    </small>
                  )}
                </label>
                <label className="full">
                  Short school description
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <label>
                  Primary color
                  <div className="color-input">
                    <i style={{ background: primaryColor }} />
                    <input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </label>
                <label>
                  Accent color
                  <div className="color-input gold">
                    <i style={{ background: accentColor }} />
                    <input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                    />
                  </div>
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="eyebrow">CHOOSE A STARTING POINT</span>
              <h1>Select your first template.</h1>
              <p>
                Your content is independent from your design, so you can switch
                anytime.
              </p>
              <div className="onboard-templates">
                {templates.slice(0, 3).map((x, i) => (
                  <button
                    key={x.name}
                    type="button"
                    className={selectedTemplateIndex === i ? 'active' : ''}
                    onClick={() => setSelectedTemplateIndex(i)}
                  >
                    <div style={{ backgroundImage: `url(${x.image})` }}>
                      {selectedTemplateIndex === i && (
                        <span>
                          <Icon name="check" size={13} />
                        </span>
                      )}
                    </div>
                    <strong>{x.name}</strong>
                    <small>{x.category}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <span className="eyebrow">ADD THE BASICS</span>
              <h1>Give visitors a warm welcome.</h1>
              <p>Draft the key leadership and academic overview.</p>
              <div className="form-grid">
                <label className="full">
                  About your school
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <label>
                  Principal name
                  <input
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                  />
                </label>
                <label>
                  Principal designation
                  <input
                    value={principalDesignation}
                    onChange={(e) => setPrincipalDesignation(e.target.value)}
                  />
                </label>
                <label className="full">
                  Academic overview
                  <textarea
                    value={academicOverview}
                    onChange={(e) => setAcademicOverview(e.target.value)}
                  />
                </label>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <span className="eyebrow">READY TO SHARE</span>
              <h1>Your website is ready to launch.</h1>
              <p>
                Review your foundation, then provision and publish your brand new
                school website.
              </p>
              <div
                className="onboard-preview"
                style={{
                  backgroundImage: `linear-gradient(90deg,#0f274ddd,transparent),url(${heroImage})`,
                }}
              >
                <span>{schoolName.toUpperCase()}</span>
                <strong>
                  Shaping thinkers.
                  <br />
                  Building character.
                </strong>
                <small>{slug}.schoolcanvas.app</small>
              </div>
              <div className="ready-list">
                {[
                  `School profile: ${schoolName}`,
                  `Slug: ${slug}`,
                  `Template: ${templates[selectedTemplateIndex]?.name || 'Aster Academy'}`,
                  'Default pages (Home, About, Academics, Admissions, Teachers, Contact)',
                ].map((x) => (
                  <span key={x}>
                    <i>
                      <Icon name="check" size={12} />
                    </i>
                    {x}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="onboard-actions">
            <Button
              disabled={isPublishing}
              onClick={() => {
                setErrorMessage('')
                if (step > 1) setStep(step - 1)
              }}
            >
              {step === 1 ? 'Save draft' : 'Back'}
            </Button>
            <Button
              kind="primary"
              disabled={isPublishing}
              onClick={() => {
                if (step < 5) {
                  handleNext()
                } else {
                  handlePublish()
                }
              }}
            >
              {step === 5
                ? isPublishing
                  ? 'Provisioning school...'
                  : 'Publish website'
                : 'Continue'}
              <Icon name="arrow" size={14} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
