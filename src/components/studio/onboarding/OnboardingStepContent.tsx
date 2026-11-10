'use client'

interface OnboardingStepContentProps {
  description: string
  setDescription: (val: string) => void
  principalName: string
  setPrincipalName: (val: string) => void
  principalDesignation: string
  setPrincipalDesignation: (val: string) => void
  academicOverview: string
  setAcademicOverview: (val: string) => void
}

export function OnboardingStepContent({
  description,
  setDescription,
  principalName,
  setPrincipalName,
  principalDesignation,
  setPrincipalDesignation,
  academicOverview,
  setAcademicOverview,
}: OnboardingStepContentProps) {
  return (
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
  )
}
