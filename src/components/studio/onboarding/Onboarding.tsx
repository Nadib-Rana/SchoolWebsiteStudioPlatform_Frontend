'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useOnboardingForm } from './useOnboardingForm'
import { OnboardingSuccessScreen } from './OnboardingSuccessScreen'
import { OnboardingSidebar } from './OnboardingSidebar'
import { OnboardingStepSchoolInfo } from './OnboardingStepSchoolInfo'
import { OnboardingStepIdentity } from './OnboardingStepIdentity'
import { OnboardingStepTemplate } from './OnboardingStepTemplate'
import { OnboardingStepContent } from './OnboardingStepContent'
import { OnboardingStepReview } from './OnboardingStepReview'

export function Onboarding() {
  const form = useOnboardingForm()

  if (form.isSuccess && form.createdSchool) {
    return <OnboardingSuccessScreen createdSchool={form.createdSchool} />
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-head">
        <div className="brand-mark"><Icon name="layers" /></div>
        <strong>Register School: {form.schoolName}</strong>
        <Button kind="ghost" onClick={form.handleExit}>Save and exit</Button>
      </div>

      <div className="onboarding-body">
        <OnboardingSidebar
          step={form.step}
          onStepClick={(s) => { if (form.validateStep(form.step)) form.setStep(s) }}
        />

        <main>
          <div className="step-progress">
            <span>Step {form.step} of 5</span>
            <i><b style={{ width: `${form.step * 20}%` }} /></i>
          </div>

          {form.errorMessage && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px 18px', marginBottom: '24px', color: '#991b1b', fontSize: '13px' }}>
              <div style={{ fontWeight: 600 }}>⚠️ Attention Required</div>
              <div>{form.errorMessage}</div>
            </div>
          )}

          {form.step === 1 && (
            <OnboardingStepSchoolInfo
              schoolName={form.schoolName} onSchoolNameChange={form.handleSchoolNameChange}
              schoolType={form.schoolType} setSchoolType={form.setSchoolType}
              schoolAddress={form.schoolAddress} setSchoolAddress={form.setSchoolAddress}
              contactPhone={form.contactPhone} setContactPhone={form.setContactPhone}
              contactEmail={form.contactEmail} setContactEmail={form.setContactEmail}
              establishedYear={form.establishedYear} setEstablishedYear={form.setEstablishedYear}
              logoPreview={form.logoPreview} onLogoUpload={form.handleLogoUpload}
              fieldErrors={form.fieldErrors} clearFieldError={(k) => form.setFieldErrors((p) => ({ ...p, [k]: '' }))}
            />
          )}
          {form.step === 2 && (
            <OnboardingStepIdentity
              schoolName={form.schoolName} onSchoolNameChange={form.handleSchoolNameChange}
              slug={form.slug} setSlug={form.setSlug} description={form.description} setDescription={form.setDescription}
              primaryColor={form.primaryColor} setPrimaryColor={form.setPrimaryColor}
              accentColor={form.accentColor} setAccentColor={form.setAccentColor}
              fieldErrors={form.fieldErrors} clearFieldError={(k) => form.setFieldErrors((p) => ({ ...p, [k]: '' }))}
            />
          )}
          {form.step === 3 && (
            <OnboardingStepTemplate selectedTemplateIndex={form.selectedTemplateIndex} setSelectedTemplateIndex={form.setSelectedTemplateIndex} />
          )}
          {form.step === 4 && (
            <OnboardingStepContent
              description={form.description} setDescription={form.setDescription}
              principalName={form.principalName} setPrincipalName={form.setPrincipalName}
              principalDesignation={form.principalDesignation} setPrincipalDesignation={form.setPrincipalDesignation}
              academicOverview={form.academicOverview} setAcademicOverview={form.setAcademicOverview}
            />
          )}
          {form.step === 5 && (
            <OnboardingStepReview schoolName={form.schoolName} slug={form.slug} selectedTemplateIndex={form.selectedTemplateIndex} />
          )}

          <div className="onboard-actions">
            <Button disabled={form.isPublishing} onClick={() => { form.setErrorMessage(''); if (form.step > 1) form.setStep(form.step - 1) }}>
              {form.step === 1 ? 'Save draft' : 'Back'}
            </Button>
            <Button kind="primary" disabled={form.isPublishing} onClick={() => { if (form.step < 5) { if (form.validateStep(form.step)) form.setStep(form.step + 1) } else form.handlePublish() }}>
              {form.step === 5 ? (form.isPublishing ? 'Provisioning school...' : 'Publish website') : 'Continue'}
              <Icon name="arrow" size={14} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
