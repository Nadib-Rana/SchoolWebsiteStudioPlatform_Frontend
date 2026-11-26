'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import {
  type TabMode,
  type Step,
  type AdmissionFormData,
  type ErpClassOption,
  type ErpFeeConfig,
  type PendingPaymentSession,
  type SubmissionResult,
  type TrackResult,
} from './admission/admission-form.types'
import { PENDING_PAYMENT_STORAGE_KEY } from './admission/AdmissionPaymentPanel'
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
  const [feeConfig, setFeeConfig] = useState<ErpFeeConfig | null>(null)
  const [paymentBanner, setPaymentBanner] = useState<{
    type: 'success' | 'error' | 'info'
    text: string
  } | null>(null)
  const [pendingCallbackVerify, setPendingCallbackVerify] = useState<{
    applicationNumber: string
    gateway: string
    transactionId?: string
    valId?: string
    paymentID?: string
  } | null>(null)
  const [fallbackVerifyIdentifier, setFallbackVerifyIdentifier] = useState('')
  const [isVerifyingCallback, setIsVerifyingCallback] = useState(false)

  const [formData, setFormData] = useState<AdmissionFormData>({
    firstName: '',
    lastName: '',
    studentName: '',
    dateOfBirth: '',
    gender: 'MALE',
    phone: '',
    email: '',
    bloodGroup: '',
    birthRegistrationNo: '',
    applyingForGrade: 'Grade 1',
    appliedClassId: 'Grade 1',
    previousSchool: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    presentAddress: '',
    permanentAddress: '',
    sameAsPresentAddress: false,
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
    const loadAdmissionConfig = async () => {
      setIsLoadingClasses(true)
      try {
        const [classesSettled, feeSettled] = await Promise.allSettled([
          api.admissions.getClasses(schoolSlug),
          api.admissions.getFeeConfig(schoolSlug),
        ])
        if (!active) return

        if (classesSettled.status === 'fulfilled') {
          const payload = classesSettled.value?.data
          if (payload && Array.isArray(payload.classes) && payload.classes.length > 0) {
            setClasses(payload.classes)
            setIsErpConnected(Boolean(payload.erpConnected))
            const first = payload.classes[0]
            setFormData((prev) => ({
              ...prev,
              appliedClassId: first.id,
              applyingForGrade: first.name,
            }))
          }
        }

        if (feeSettled.status === 'fulfilled' && feeSettled.value?.data) {
          setFeeConfig(feeSettled.value.data)
        }
      } finally {
        if (active) setIsLoadingClasses(false)
      }
    }
    loadAdmissionConfig()
    return () => {
      active = false
    }
  }, [schoolSlug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('payCallback') !== '1') return

    const appParam = (params.get('app') || '').trim()
    const gatewayParam = (params.get('gateway') || '').trim().toUpperCase()
    const payStatus = (
      params.get('paymentStatus') ||
      params.get('status') ||
      params.get('Status') ||
      ''
    )
      .trim()
      .toLowerCase()
    const tranId = (params.get('tran_id') || params.get('transactionId') || '').trim()
    const valId = (params.get('val_id') || params.get('valId') || '').trim()
    const sessionId = (params.get('session_id') || '').trim()
    const orderId = (params.get('order_id') || '').trim()
    const paymentID = (params.get('paymentID') || '').trim()
    const token = (params.get('Token') || params.get('token') || '').trim()
    const nagadRef = (params.get('payment_ref_id') || '').trim()

    let savedSession: PendingPaymentSession | null = null
    try {
      const raw = window.sessionStorage.getItem(PENDING_PAYMENT_STORAGE_KEY)
      if (raw) {
        savedSession = JSON.parse(raw) as PendingPaymentSession
      }
    } catch {
      savedSession = null
    }

    try {
      window.history.replaceState({}, '', window.location.pathname)
    } catch {
      // Ignore history errors
    }

    const resolvedAppNumber = appParam || savedSession?.applicationNumber || ''
    const resolvedGateway = gatewayParam || savedSession?.gateway || ''
    if (!resolvedAppNumber) return

    setActiveTab('apply')
    setSubmissionResult({
      source: 'ERP',
      applicationNumber: resolvedAppNumber,
      studentName: savedSession?.studentName || 'Applicant',
      status: 'SUBMITTED',
      feeAmount: savedSession?.feeAmount ?? 0,
      paymentStatus: 'PENDING',
      currency: savedSession?.currency || 'BDT',
    })

    if (savedSession?.identifier) {
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || savedSession.identifier,
        applyingForGrade: savedSession.applyingForGrade || prev.applyingForGrade,
      }))
    }

    const isCancelled = payStatus === 'cancelled' || payStatus === 'cancel'
    const isFailed = payStatus === 'failed' || payStatus === 'failure' || isCancelled
    if (isFailed) {
      setPaymentBanner({
        type: 'error',
        text: isCancelled
          ? 'Online payment was cancelled. You can choose another gateway or submit a manual transaction ID below.'
          : 'Online payment could not be completed. Please retry below or use manual payment.',
      })
      return
    }

    let verifyTransactionId = tranId || savedSession?.transactionId || ''
    if (resolvedGateway === 'STRIPE' && sessionId) {
      verifyTransactionId = sessionId
    } else if (resolvedGateway === 'SHURJOPAY' && orderId) {
      verifyTransactionId = orderId
    } else if (resolvedGateway === 'SONALIPAY' && token) {
      verifyTransactionId = token
    } else if (resolvedGateway === 'BKASH' && !verifyTransactionId && paymentID) {
      verifyTransactionId = paymentID
    } else if (resolvedGateway === 'NAGAD' && nagadRef) {
      verifyTransactionId = nagadRef
    }

    const verifyPayload = {
      applicationNumber: resolvedAppNumber,
      gateway: resolvedGateway || 'SSLCOMMERZ',
      transactionId: verifyTransactionId || undefined,
      valId: valId || undefined,
      paymentID: paymentID || undefined,
    }

    if (!savedSession?.identifier) {
      setPendingCallbackVerify(verifyPayload)
      setPaymentBanner({
        type: 'info',
        text: 'Payment returned from gateway. Enter your registered phone number below to finalize verification.',
      })
      return
    }

    let cancelled = false
    const verify = async () => {
      setIsVerifyingCallback(true)
      setPaymentBanner({
        type: 'info',
        text: 'Verifying your online payment with the school ERP...',
      })
      try {
        const res = await api.admissions.verifyOnlinePayment(schoolSlug, {
          ...verifyPayload,
          identifier: savedSession!.identifier,
        })
        if (cancelled) return
        const data = res?.data
        try {
          window.sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY)
        } catch {}
        setSubmissionResult((prev) =>
          prev
            ? {
                ...prev,
                paymentStatus: data?.paymentStatus || 'PAID',
                paymentMethod: data?.paymentMethod || verifyPayload.gateway,
                transactionId: data?.transactionId || verifyPayload.transactionId || null,
                feeAmount: data?.feeAmount ?? prev.feeAmount,
                paidAt: data?.paidAt || new Date().toISOString(),
              }
            : prev,
        )
        setPaymentBanner({
          type: 'success',
          text: 'Payment verified and confirmed! Your admission fee receipt is ready.',
        })
      } catch (err: unknown) {
        if (cancelled) return
        setPaymentBanner({
          type: 'error',
          text:
            err instanceof Error
              ? err.message
              : 'Automatic payment verification failed. Please retry or use Track Application to check status.',
        })
      } finally {
        if (!cancelled) setIsVerifyingCallback(false)
      }
    }
    void verify()
    return () => {
      cancelled = true
    }
  }, [schoolSlug])

  const handleFallbackCallbackVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pendingCallbackVerify || !fallbackVerifyIdentifier.trim()) return
    setIsVerifyingCallback(true)
    setPaymentBanner(null)
    try {
      const res = await api.admissions.verifyOnlinePayment(schoolSlug, {
        ...pendingCallbackVerify,
        identifier: fallbackVerifyIdentifier.trim(),
      })
      const data = res?.data
      setPendingCallbackVerify(null)
      setSubmissionResult((prev) =>
        prev
          ? {
              ...prev,
              paymentStatus: data?.paymentStatus || 'PAID',
              paymentMethod: data?.paymentMethod || pendingCallbackVerify.gateway,
              transactionId:
                data?.transactionId || pendingCallbackVerify.transactionId || null,
              feeAmount: data?.feeAmount ?? prev.feeAmount,
              paidAt: data?.paidAt || new Date().toISOString(),
            }
          : prev,
      )
      setFormData((prev) => ({ ...prev, phone: prev.phone || fallbackVerifyIdentifier.trim() }))
      setPaymentBanner({
        type: 'success',
        text: 'Payment verified and confirmed! Your admission fee receipt is ready.',
      })
    } catch (err: unknown) {
      setPaymentBanner({
        type: 'error',
        text:
          err instanceof Error ? err.message : 'Unable to verify payment right now.',
      })
    } finally {
      setIsVerifyingCallback(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'sameAsPresentAddress') {
        setFormData((prev) => ({
          ...prev,
          sameAsPresentAddress: checked,
          permanentAddress: checked
            ? prev.presentAddress || prev.address
            : prev.permanentAddress,
        }))
        return
      }
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (name === 'presentAddress') {
      setFormData((prev) => ({
        ...prev,
        presentAddress: value,
        address: value,
        ...(prev.sameAsPresentAddress ? { permanentAddress: value } : {}),
      }))
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
      const resolvedPresent = (formData.presentAddress || formData.address).trim()
      if (
        !formData.guardianName.trim() ||
        !formData.guardianPhone.trim() ||
        !formData.guardianEmail.trim() ||
        !resolvedPresent
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
    setPaymentBanner(null)
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
      const resolvedPresent = (formData.presentAddress || formData.address).trim()
      const resolvedPermanent = formData.sameAsPresentAddress
        ? resolvedPresent
        : formData.permanentAddress.trim()
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
        birthRegistrationNo: formData.birthRegistrationNo.trim() || undefined,
        fatherName: formData.fatherName.trim() || undefined,
        motherName: formData.motherName.trim() || undefined,
        applyingForGrade: formData.applyingForGrade,
        appliedClassId: formData.appliedClassId || undefined,
        previousSchool: formData.previousSchool.trim() || undefined,
        guardianName: formData.guardianName.trim(),
        guardianRelationship: formData.guardianRelationship,
        guardianPhone: formData.guardianPhone.trim(),
        guardianEmail: formData.guardianEmail.trim() || undefined,
        address: resolvedPresent,
        presentAddress: resolvedPresent,
        permanentAddress: resolvedPermanent || undefined,
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
            <>
              {pendingCallbackVerify && (
                <form
                  onSubmit={handleFallbackCallbackVerify}
                  className="mb-6 max-w-xl mx-auto p-4 bg-sky-50 border border-sky-200 rounded-2xl text-left space-y-3"
                >
                  <p className="text-xs font-semibold text-sky-900">
                    Confirm Payment Verification for #{pendingCallbackVerify.applicationNumber}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Registered Phone or Email"
                      value={fallbackVerifyIdentifier}
                      onChange={(e) => setFallbackVerifyIdentifier(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-sky-300 bg-white text-sm text-slate-900"
                    />
                    <button
                      type="submit"
                      disabled={isVerifyingCallback}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50"
                    >
                      {isVerifyingCallback ? 'Verifying...' : 'Verify Payment'}
                    </button>
                  </div>
                </form>
              )}
              <AdmissionSuccessScreen
                schoolSlug={schoolSlug}
                schoolName={schoolName}
                submissionResult={submissionResult}
                feeConfig={feeConfig}
                applicantIdentifier={formData.phone || formData.guardianPhone || fallbackVerifyIdentifier}
                applyingForGrade={formData.applyingForGrade}
                copied={copied}
                paymentBanner={paymentBanner}
                onPaymentComplete={(update) => {
                  setSubmissionResult((prev) =>
                    prev ? { ...prev, ...update } : prev,
                  )
                  setPaymentBanner({
                    type: 'success',
                    text:
                      update.paymentStatus === 'UNDER_VERIFICATION'
                        ? 'Your transaction reference has been submitted and is now under verification by the school.'
                        : 'Admission fee payment confirmed!',
                  })
                }}
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
                  setTrackPhone(formData.phone || formData.guardianPhone || fallbackVerifyIdentifier)
                  setActiveTab('track')
                }}
              />
            </>
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
                  feeConfig={feeConfig}
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
              {step === 3 && (() => {
                const selCls = classes.find((c) => c.id === formData.appliedClassId)
                const selFee =
                  selCls?.admissionFee !== undefined
                    ? selCls.admissionFee
                    : feeConfig?.classFees && formData.appliedClassId in feeConfig.classFees
                      ? feeConfig.classFees[formData.appliedClassId]
                      : feeConfig?.enabled
                        ? feeConfig.defaultFee
                        : 0
                return (
                  <AdmissionStepReview
                    formData={formData}
                    feeConfig={feeConfig}
                    selectedClassFee={selFee}
                    handleInputChange={handleInputChange}
                    onBack={() => setStep(2)}
                    onSubmit={handleFinalSubmit}
                    isSubmitting={isSubmitting}
                  />
                )
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'track' && (
        <AdmissionTrackingTab
          schoolSlug={schoolSlug}
          feeConfig={feeConfig}
          trackAppNumber={trackAppNumber}
          setTrackAppNumber={setTrackAppNumber}
          trackPhone={trackPhone}
          setTrackPhone={setTrackPhone}
          isTracking={isTracking}
          trackError={trackError}
          trackResult={trackResult}
          onTrackSubmit={handleTrackSubmit}
          onPaymentComplete={(update) =>
            setTrackResult((prev) => (prev ? { ...prev, ...update } : prev))
          }
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
