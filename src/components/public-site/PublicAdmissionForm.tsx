'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import {
  type TabMode,
  type Step,
  type AdmissionFormData,
  type ErpClassOption,
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
import {
  printAdmissionReceipt,
  printTrackStatusSlip,
} from './admission/admission-receipt-print'

const FALLBACK_CLASSES: ErpClassOption[] = [
  { id: 'Kindergarten', name: 'Kindergarten' },
  { id: 'Grade 1', name: 'Grade 1' },
  { id: 'Grade 2', name: 'Grade 2' },
  { id: 'Grade 3', name: 'Grade 3' },
  { id: 'Grade 4', name: 'Grade 4' },
  { id: 'Grade 5', name: 'Grade 5' },
  { id: 'Grade 6', name: 'Grade 6' },
  { id: 'Grade 7', name: 'Grade 7' },
  { id: 'Grade 8', name: 'Grade 8' },
  { id: 'Grade 9', name: 'Grade 9' },
  { id: 'Grade 10', name: 'Grade 10' },
  { id: 'Grade 11', name: 'Grade 11' },
  { id: 'Grade 12', name: 'Grade 12' },
]

interface PublicAdmissionFormProps {
  schoolSlug: string
  schoolName: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  allowAdmissions?: boolean
}

export function PublicAdmissionForm({
  schoolSlug,
  schoolName,
  logoUrl,
  address,
  phone,
  email,
  allowAdmissions = true,
}: PublicAdmissionFormProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('apply')
  const [step, setStep] = useState<Step>(1)
  const [classes, setClasses] = useState<ErpClassOption[]>(FALLBACK_CLASSES)
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const [isErpConnected, setIsErpConnected] = useState(false)

  const [formData, setFormData] = useState<AdmissionFormData>({
    firstName: '',
    lastName: '',
    studentName: '',
    dateOfBirth: '',
    gender: 'MALE',
    phone: '',
    email: '',
    bloodGroup: '',
    applyingForGrade: 'Grade 1',
    appliedClassId: 'Grade 1',
    previousSchool: '',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    documentsUrl: '',
    photoUrl: '',
    declaration: false,
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

  useEffect(() => {
    let active = true
    const loadClasses = async () => {
      setIsLoadingClasses(true)
      try {
        const res = await api.admissions.getClasses(schoolSlug)
        const payload = res?.data
        if (active && payload && Array.isArray(payload.classes) && payload.classes.length > 0) {
          setClasses(payload.classes)
          setIsErpConnected(Boolean(payload.erpConnected))
          const first = payload.classes[0]
          setFormData((prev) => ({
            ...prev,
            appliedClassId: first.id,
            applyingForGrade: first.name,
          }))
        }
      } catch {
        // Fallback grades already populated
      } finally {
        if (active) setIsLoadingClasses(false)
      }
    }
    loadClasses()
    return () => {
      active = false
    }
  }, [schoolSlug])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleClassSelect = (classId: string) => {
    const selected = classes.find((c) => c.id === classId)
    setFormData((prev) => ({
      ...prev,
      appliedClassId: classId,
      applyingForGrade: selected ? selected.name : classId,
    }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setApplyError(null)
    if (step === 1) {
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.dateOfBirth ||
        !formData.phone.trim() ||
        !formData.applyingForGrade
      ) {
        setApplyError('Please fill in all required student details before proceeding.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (
        !formData.guardianName.trim() ||
        !formData.guardianPhone.trim() ||
        !formData.guardianEmail.trim() ||
        !formData.address.trim()
      ) {
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
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
      const res = await api.admissions.apply({
        schoolSlug,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        studentName: fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        applyingForGrade: formData.applyingForGrade,
        appliedClassId: formData.appliedClassId || undefined,
        previousSchool: formData.previousSchool.trim() || undefined,
        guardianName: formData.guardianName.trim(),
        guardianRelationship: formData.guardianRelationship,
        guardianPhone: formData.guardianPhone.trim(),
        guardianEmail: formData.guardianEmail.trim() || undefined,
        address: formData.address.trim(),
        documentsUrl: formData.documentsUrl.trim() || undefined,
        photoUrl: formData.photoUrl || undefined,
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
    if (!trackAppNumber.trim()) {
      return setTrackError('Please provide your admission application reference number.')
    }
    if (!trackPhone.trim()) {
      return setTrackError('Please provide your registered phone number or email for verification.')
    }
    setIsTracking(true)
    setTrackError(null)
    setTrackResult(null)
    try {
      const res = await api.admissions.track(
        trackAppNumber.trim(),
        trackPhone.trim(),
        schoolSlug,
      )
      if (res.data) setTrackResult(res.data)
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : 'Application record not found.')
    } finally {
      setIsTracking(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden">
      {/* Branded Admission Portal Header */}
      <div
        className="px-6 sm:px-10 py-6 text-white flex flex-wrap items-center justify-between gap-4"
        style={{
          background:
            'linear-gradient(135deg, var(--navy, #102f58) 0%, #0f172a 100%)',
        }}
      >
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] block"
            style={{ color: 'var(--accent, #e3ad3f)' }}
          >
            Official Online Admissions Portal
          </span>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
            Apply to {schoolName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-100">
            Session {new Date().getFullYear()}–{new Date().getFullYear() + 1}
          </span>
          {isErpConnected && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ERP Live
            </span>
          )}
        </div>
      </div>

      <AdmissionNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'apply' && (
        <div className="p-8 sm:p-10">
          {!allowAdmissions ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl font-bold">
                !
              </div>
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
              onPrintReceipt={() =>
                printAdmissionReceipt(
                  { schoolName, logoUrl, address, phone, email, schoolSlug },
                  submissionResult,
                  formData,
                )
              }
              onTrack={(num) => {
                setTrackAppNumber(num)
                setTrackPhone(formData.phone || formData.guardianPhone)
                setActiveTab('track')
              }}
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
              {step === 1 && (
                <AdmissionStepStudent
                  formData={formData}
                  classes={classes}
                  isLoadingClasses={isLoadingClasses}
                  isErpConnected={isErpConnected}
                  handleInputChange={handleInputChange}
                  onClassSelect={handleClassSelect}
                  onPhotoChange={(photoUrl) =>
                    setFormData((prev) => ({ ...prev, photoUrl }))
                  }
                  onNext={handleNextStep}
                />
              )}
              {step === 2 && (
                <AdmissionStepGuardian
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onNext={handleNextStep}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <AdmissionStepReview
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onBack={() => setStep(2)}
                  onSubmit={handleFinalSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
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
          onPrintStatus={(result) =>
            printTrackStatusSlip(
              { schoolName, logoUrl, address, phone, email, schoolSlug },
              result,
            )
          }
        />
      )}
    </div>
  )
}
