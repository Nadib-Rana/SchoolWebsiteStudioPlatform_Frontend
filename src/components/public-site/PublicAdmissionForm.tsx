'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import {
  type TabMode,
  type Step,
  type AdmissionFormData,
  type SubmissionResult,
  type TrackResult,
} from './admission/admission-form.types'
import { AdmissionNavTabs } from './admission/AdmissionNavTabs'
import { AdmissionStepStudent } from './admission/AdmissionStepStudent'
import { AdmissionStepGuardian } from './admission/AdmissionStepGuardian'
import { AdmissionStepReview } from './admission/AdmissionStepReview'
import { AdmissionSuccessScreen } from './admission/AdmissionSuccessScreen'
import { AdmissionTrackingTab } from './admission/AdmissionTrackingTab'
import { AdmissionStepperHeader } from './admission/AdmissionStepperHeader'

interface PublicAdmissionFormProps {
  schoolSlug: string
  schoolName: string
  allowAdmissions?: boolean
}

export function PublicAdmissionForm({
  schoolSlug,
  schoolName,
  allowAdmissions = true,
}: PublicAdmissionFormProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('apply')
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<AdmissionFormData>({
    studentName: '', dateOfBirth: '', gender: 'Male', applyingForGrade: 'Grade 1',
    previousSchool: '', guardianName: '', guardianRelationship: 'Father',
    guardianPhone: '', guardianEmail: '', address: '', declaration: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [copied, setCopied] = useState(false)

  const [trackAppNumber, setTrackAppNumber] = useState('')
  const [trackPhone, setTrackPhone] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackError, setTrackError] = useState<string | null>(null)
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setApplyError(null)
    if (step === 1) {
      if (!formData.studentName.trim() || !formData.dateOfBirth || !formData.applyingForGrade) {
        setApplyError('Please fill in all required student details before proceeding.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.guardianName.trim() || !formData.guardianPhone.trim() || !formData.guardianEmail.trim() || !formData.address.trim()) {
        setApplyError('Please fill in all required guardian contact details before proceeding.')
        return
      }
      setStep(3)
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.declaration) {
      setApplyError('Please confirm the declaration checkbox before submitting your application.')
      return
    }
    setIsSubmitting(true)
    setApplyError(null)
    try {
      const res = await api.admissions.apply({
        schoolSlug,
        studentName: formData.studentName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        applyingForGrade: formData.applyingForGrade,
        previousSchool: formData.previousSchool || undefined,
        guardianName: formData.guardianName,
        guardianRelationship: formData.guardianRelationship,
        guardianPhone: formData.guardianPhone,
        guardianEmail: formData.guardianEmail,
        address: formData.address,
      })
      if (res.data) setSubmissionResult(res.data)
    } catch (err: unknown) {
      setApplyError(err instanceof Error ? err.message : 'Unable to submit admission application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyApplicationNumber = () => {
    if (!submissionResult?.applicationNumber) return
    navigator.clipboard.writeText(submissionResult.applicationNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackAppNumber.trim()) return setTrackError('Please provide your admission application reference number.')
    if (!trackPhone.trim()) return setTrackError('Please provide guardian contact phone number for verification.')
    setIsTracking(true)
    setTrackError(null)
    setTrackResult(null)
    try {
      const res = await api.admissions.track(trackAppNumber.trim(), trackPhone.trim())
      if (res.data) setTrackResult(res.data)
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : 'Application record not found.')
    } finally {
      setIsTracking(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <AdmissionNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'apply' && (
        <div className="p-8 sm:p-10">
          {!allowAdmissions ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl font-bold">!</div>
              <h3 className="text-xl font-bold text-slate-900">Admissions Currently Closed</h3>
              <p className="text-slate-600 max-w-md mx-auto mt-2 text-sm leading-relaxed">
                Public online admissions for {schoolName} are currently closed. Please contact the administrative office.
              </p>
            </div>
          ) : submissionResult ? (
            <AdmissionSuccessScreen
              schoolName={schoolName}
              submissionResult={submissionResult}
              copied={copied}
              onCopy={handleCopyApplicationNumber}
              onTrack={(num) => { setTrackAppNumber(num); setActiveTab('track') }}
            />
          ) : (
            <div>
              <AdmissionStepperHeader step={step} />
              {applyError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-3">
                  <Icon name="close" size={16} />
                  <span>{applyError}</span>
                </div>
              )}
              {step === 1 && <AdmissionStepStudent formData={formData} handleInputChange={handleInputChange} onNext={handleNextStep} />}
              {step === 2 && <AdmissionStepGuardian formData={formData} handleInputChange={handleInputChange} onNext={handleNextStep} onBack={() => setStep(1)} />}
              {step === 3 && <AdmissionStepReview formData={formData} handleInputChange={handleInputChange} onBack={() => setStep(2)} onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />}
            </div>
          )}
        </div>
      )}

      {activeTab === 'track' && (
        <AdmissionTrackingTab
          trackAppNumber={trackAppNumber}
          setTrackAppNumber={setTrackAppNumber}
          trackPhone={trackPhone}
          setTrackPhone={setTrackPhone}
          isTracking={isTracking}
          trackError={trackError}
          trackResult={trackResult}
          onTrackSubmit={handleTrackSubmit}
        />
      )}
    </div>
  )
}
