'use client'

interface OnboardingStepIdentityProps {
  schoolName: string
  onSchoolNameChange: (val: string) => void
  slug: string
  setSlug: (val: string) => void
  description: string
  setDescription: (val: string) => void
  primaryColor: string
  setPrimaryColor: (val: string) => void
  accentColor: string
  setAccentColor: (val: string) => void
  fieldErrors: Record<string, string>
  clearFieldError: (key: string) => void
}

export function OnboardingStepIdentity({
  schoolName,
  onSchoolNameChange,
  slug,
  setSlug,
  description,
  setDescription,
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  fieldErrors,
  clearFieldError,
}: OnboardingStepIdentityProps) {
  return (
    <>
      <span className="eyebrow">CREATE YOUR IDENTITY</span>
      <h1>Make it unmistakably yours.</h1>
      <p>Choose a unique website address (slug), brand colors, and description.</p>
      <div className="form-grid">
        <label className="full">
          Website name <span style={{ color: '#ef4444' }}>*</span>
          <input
            value={schoolName}
            onChange={(e) => onSchoolNameChange(e.target.value)}
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
                if (fieldErrors.slug) clearFieldError('slug')
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
              Your public website URL will be:{' '}
              <strong>http://localhost:3000/{slug || 'your-school'}</strong>
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
  )
}
