'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'

interface PublicAdmissionFormProps {
  schoolSlug: string
  schoolName: string
  allowAdmissions?: boolean
}

type TabMode = 'apply' | 'track'
type Step = 1 | 2 | 3

export function PublicAdmissionForm({
  schoolSlug,
  schoolName,
  allowAdmissions = true,
}: PublicAdmissionFormProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('apply')

  // --- Application Form State ---
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: 'Male',
    applyingForGrade: 'Grade 1',
    previousSchool: '',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    declaration: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [submissionResult, setSubmissionResult] = useState<{
    applicationNumber: string
    studentName: string
    status: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // --- Tracking State ---
  const [trackAppNumber, setTrackAppNumber] = useState('')
  const [trackPhone, setTrackPhone] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [trackError, setTrackError] = useState<string | null>(null)
  const [trackResult, setTrackResult] = useState<{
    applicationNumber: string
    schoolName: string
    studentName: string
    applyingForGrade: string
    status: string
    notes?: string
    submittedAt: string
    lastUpdatedAt: string
  } | null>(null)

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
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

      if (res.data) {
        setSubmissionResult({
          applicationNumber: res.data.applicationNumber,
          studentName: res.data.studentName,
          status: res.data.status,
        })
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to submit admission application. Please verify details and try again.'
      setApplyError(message)
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
      setTrackError('Please provide your admission application reference number.')
      return
    }

    setIsTracking(true)
    setTrackError(null)
    setTrackResult(null)

    try {
      const res = await api.admissions.track(trackAppNumber.trim(), trackPhone.trim() || undefined)
      if (res.data) {
        setTrackResult(res.data)
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Application record not found. Please verify your reference number and phone.'
      setTrackError(message)
    } finally {
      setIsTracking(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Application Received',
        }
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Under Review',
        }
      case 'SHORTLISTED':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Shortlisted for Assessment',
        }
      case 'INTERVIEW_SCHEDULED':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Interview Scheduled',
        }
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Offer of Admission Accepted',
        }
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Application Unsuccessful',
        }
      case 'ENROLLED':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-500',
          label: 'Officially Enrolled',
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
          label: status,
        }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/70 p-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'apply'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Icon name="check" size={16} />
          Online Admission Application
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'track'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Icon name="search" size={16} />
          Track Application Status
        </button>
      </div>

      {/* --- TAB 1: APPLY FOR ADMISSION --- */}
      {activeTab === 'apply' && (
        <div className="p-8 sm:p-10">
          {!allowAdmissions ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-2xl font-bold">
                !
              </div>
              <h3 className="text-xl font-bold text-slate-900">Admissions Currently Closed</h3>
              <p className="text-slate-600 max-w-md mx-auto mt-2 text-sm leading-relaxed">
                Public online admissions for {schoolName} are currently closed for the upcoming session. Please contact the administrative office for waitlist inquiries.
              </p>
            </div>
          ) : submissionResult ? (
            /* Application Success Screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Icon name="check" size={32} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Successfully Registered
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-3">
                Welcome to {schoolName}, {submissionResult.studentName}!
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">
                Your admission application has been recorded in the school registry. Keep your reference number below to track review milestones, interview schedules, and admission offers.
              </p>

              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto">
                <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Official Application Number
                </span>
                <div className="text-3xl font-mono font-extrabold text-slate-900 mt-1 tracking-wider">
                  {submissionResult.applicationNumber}
                </div>
                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleCopyApplicationNumber}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 active:scale-95 transition"
                  >
                    <Icon name="copy" size={14} />
                    {copied ? 'Copied to Clipboard!' : 'Copy Reference Number'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackAppNumber(submissionResult.applicationNumber)
                      setActiveTab('track')
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition"
                  >
                    Track Progress <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <div>
              {/* Stepper Progress */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                {[
                  { num: 1, label: 'Student Details' },
                  { num: 2, label: 'Guardian Info' },
                  { num: 3, label: 'Review & Submit' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        step === s.num
                          ? 'bg-slate-900 text-white shadow-md'
                          : step > s.num
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > s.num ? <Icon name="check" size={16} /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        step === s.num ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {applyError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-3">
                  <Icon name="close" size={16} />
                  <span>{applyError}</span>
                </div>
              )}

              {/* Step 1: Student Information */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        required
                        placeholder="e.g. Liam Vance"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Applying For Grade / Year *
                      </label>
                      <select
                        name="applyingForGrade"
                        value={formData.applyingForGrade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                      >
                        <option value="Kindergarten">Kindergarten</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Previous School Attended (Optional)
                      </label>
                      <input
                        type="text"
                        name="previousSchool"
                        placeholder="e.g. Riverdale Elementary"
                        value={formData.previousSchool}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      Next: Guardian Information <Icon name="arrow" size={15} />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Guardian Information */}
              {step === 2 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Guardian Full Name *
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        required
                        placeholder="e.g. Arthur Vance"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Relationship to Student *
                      </label>
                      <select
                        name="guardianRelationship"
                        value={formData.guardianRelationship}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                        <option value="Relative">Relative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        required
                        placeholder="e.g. +1 (555) 345-6789"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Email Address *
                      </label>
                      <input
                        type="email"
                        name="guardianEmail"
                        required
                        placeholder="e.g. arthur.vance@example.com"
                        value={formData.guardianEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Residential Address *
                      </label>
                      <textarea
                        name="address"
                        rows={3}
                        required
                        placeholder="Street address, City, State/Province, Postal Code"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                    >
                      Back to Student Info
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
                    >
                      Next: Review & Submit <Icon name="arrow" size={15} />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Review & Submit */}
              {step === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 divide-y divide-slate-200/80 text-sm">
                    <div className="pb-4">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                        Student Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-800">Name:</span> {formData.studentName}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Grade:</span> {formData.applyingForGrade}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Date of Birth:</span> {formData.dateOfBirth}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Gender:</span> {formData.gender}
                        </div>
                        {formData.previousSchool && (
                          <div className="col-span-2">
                            <span className="font-semibold text-slate-800">Previous School:</span> {formData.previousSchool}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 pb-4">
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">
                        Guardian Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-800">Guardian:</span> {formData.guardianName} ({formData.guardianRelationship})
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Phone:</span> {formData.guardianPhone}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-slate-800">Email:</span> {formData.guardianEmail}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-slate-800">Address:</span> {formData.address}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="declaration"
                          checked={formData.declaration}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I declare that the information provided in this admission form is true and complete to the best of my knowledge. I understand that any false or misleading statements may lead to cancellation of this application or subsequent enrollment.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                    >
                      Back to Guardian Info
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.declaration}
                      className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application <Icon name="check" size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: TRACK APPLICATION --- */}
      {activeTab === 'track' && (
        <div className="p-8 sm:p-10">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Application Status Portal
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Lookup Your Admission Progress
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Enter your reference code (e.g. ADM-2026-1024) to check your review status in real time.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Application Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ADM-2026-8491"
                  value={trackAppNumber}
                  onChange={(e) => setTrackAppNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Guardian Phone (Optional Verification)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 345-6789"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              {trackError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                  <Icon name="close" size={15} />
                  <span>{trackError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isTracking}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isTracking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching Registry...
                  </>
                ) : (
                  <>
                    Check Status <Icon name="search" size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Application Result Details */}
            {trackResult && (
              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                      Application Reference
                    </span>
                    <h4 className="text-lg font-mono font-bold text-slate-900">
                      {trackResult.applicationNumber}
                    </h4>
                  </div>
                  {(() => {
                    const badge = getStatusBadge(trackResult.status)
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    )
                  })()}
                </div>

                <div className="py-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-semibold text-slate-900">{trackResult.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grade Level:</span>
                    <span className="font-semibold text-slate-900">{trackResult.applyingForGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Institution:</span>
                    <span className="font-semibold text-slate-900">{trackResult.schoolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Submitted On:</span>
                    <span className="text-slate-700">
                      {new Date(trackResult.submittedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {trackResult.notes && (
                  <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Admissions Committee Note
                    </span>
                    <p className="text-sm text-amber-900 leading-relaxed">{trackResult.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
