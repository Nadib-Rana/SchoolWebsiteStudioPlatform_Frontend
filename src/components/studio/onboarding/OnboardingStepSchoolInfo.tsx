'use client'

import { useRef } from 'react'

interface OnboardingStepSchoolInfoProps {
  schoolName: string
  onSchoolNameChange: (val: string) => void
  schoolType: string
  setSchoolType: (val: string) => void
  schoolAddress: string
  setSchoolAddress: (val: string) => void
  contactPhone: string
  setContactPhone: (val: string) => void
  contactEmail: string
  setContactEmail: (val: string) => void
  establishedYear: string
  setEstablishedYear: (val: string) => void
  logoPreview: string | null
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fieldErrors: Record<string, string>
  clearFieldError: (key: string) => void
}

export function OnboardingStepSchoolInfo({
  schoolName,
  onSchoolNameChange,
  schoolType,
  setSchoolType,
  schoolAddress,
  setSchoolAddress,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  establishedYear,
  setEstablishedYear,
  logoPreview,
  onLogoUpload,
  fieldErrors,
  clearFieldError,
}: OnboardingStepSchoolInfoProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <span className="eyebrow">TELL US ABOUT YOUR SCHOOL</span>
      <h1>Start with the essentials.</h1>
      <p>This information creates the foundation of your website.</p>
      <div className="logo-upload large">
        <input
          type="file"
          ref={logoInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onLogoUpload}
        />
        <div
          style={{
            backgroundImage: logoPreview ? `url(${logoPreview})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!logoPreview && (schoolName.slice(0, 2).toUpperCase() || 'SC')}
        </div>
        <span>
          <strong>Upload school logo</strong>
          <small>PNG, JPG or SVG · Recommended 512 × 512</small>
          <button type="button" onClick={() => logoInputRef.current?.click()}>
            {logoPreview ? 'Change logo' : 'Choose image'}
          </button>
        </span>
      </div>
      <div className="form-grid">
        <label>
          School name <span style={{ color: '#ef4444' }}>*</span>
          <input
            value={schoolName}
            onChange={(e) => onSchoolNameChange(e.target.value)}
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
          <select value={schoolType} onChange={(e) => setSchoolType(e.target.value)}>
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
              if (fieldErrors.contactPhone) clearFieldError('contactPhone')
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
              if (fieldErrors.contactEmail) clearFieldError('contactEmail')
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
  )
}
