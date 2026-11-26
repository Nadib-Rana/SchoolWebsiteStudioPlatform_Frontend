'use client'

import { useRef, useState } from 'react'
import { Icon } from '@/components/common/Icon'
import {
  formatFeeCurrency,
  type AdmissionFormData,
  type ErpClassOption,
  type ErpFeeConfig,
} from './admission-form.types'
import { compressStudentPhoto } from './photo-compress'

interface AdmissionStepStudentProps {
  formData: AdmissionFormData
  classes: ErpClassOption[]
  isLoadingClasses: boolean
  isErpConnected: boolean
  feeConfig?: ErpFeeConfig | null
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onClassSelect: (classId: string) => void
  onPhotoChange: (photoUrl: string) => void
  onNext: (e: React.FormEvent) => void
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 text-sm transition shadow-xs'

export function AdmissionStepStudent({
  formData,
  classes,
  isLoadingClasses,
  isErpConnected,
  feeConfig,
  handleInputChange,
  onClassSelect,
  onPhotoChange,
  onNext,
}: AdmissionStepStudentProps) {
  const selectedClassObj = classes.find((c) => c.id === formData.appliedClassId)
  const rawClassFee =
    selectedClassObj?.admissionFee !== undefined
      ? selectedClassObj.admissionFee
      : feeConfig?.classFees && formData.appliedClassId in feeConfig.classFees
        ? feeConfig.classFees[formData.appliedClassId]
        : feeConfig?.enabled
          ? feeConfig.defaultFee
          : undefined
  const showFeeBadge =
    isErpConnected &&
    (selectedClassObj?.admissionFee !== undefined || Boolean(feeConfig?.enabled))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoError(null)
    setIsCompressingPhoto(true)
    try {
      const compressed = await compressStudentPhoto(file)
      onPhotoChange(compressed)
    } catch (err: unknown) {
      setPhotoError(err instanceof Error ? err.message : 'Unable to process photo.')
    } finally {
      setIsCompressingPhoto(false)
    }
  }

  const selectGender = (gender: string) => {
    handleInputChange({
      target: { name: 'gender', value: gender, type: 'text' },
    } as any)
  }

  return (
    <form onSubmit={onNext} className="space-y-6">
      {/* Personal Info Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Student Personal Information</h4>
            <p className="text-xs text-slate-500 mt-0.5">Enter the applicant&apos;s legal name and basic details.</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Step 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="e.g. Arafat"
              value={formData.firstName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              required
              placeholder="e.g. Rahman"
              value={formData.lastName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'MALE', label: 'Male' },
                { val: 'FEMALE', label: 'Female' },
                { val: 'OTHER', label: 'Other' },
              ].map((g) => {
                const active = formData.gender === g.val
                return (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => selectGender(g.val)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                      active
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    style={
                      active
                        ? { background: 'var(--navy, #102f58)' }
                        : undefined
                    }
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Applicant Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="e.g. 01711000000"
              value={formData.phone}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Applicant Email <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. student@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/70">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Student Passport Photo <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-xs text-slate-400">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Applicant preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="image" size={24} />
              )}
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/webp,image/jpeg,image/png"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isCompressingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition disabled:opacity-50"
                >
                  {isCompressingPhoto
                    ? 'Compressing...'
                    : formData.photoUrl
                    ? 'Change Photo'
                    : 'Upload Photo'}
                </button>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoError(null)
                      onPhotoChange('')
                    }}
                    className="px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Optional · Passport-size photo (WebP/JPG/PNG, auto-resized to 512px for Student Profile &amp; Smart ID Card).
              </p>
              {photoError && (
                <p className="text-xs font-medium text-rose-600">{photoError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Selection Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Academic Placement</h4>
            <p className="text-xs text-slate-500 mt-0.5">Select the target class and optional background details.</p>
          </div>
          {isErpConnected && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live ERP Classes
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Applying For Class / Grade <span className="text-rose-500">*</span>
            </label>
            <select
              name="appliedClassId"
              required
              disabled={isLoadingClasses}
              value={formData.appliedClassId || formData.applyingForGrade}
              onChange={(e) => onClassSelect(e.target.value)}
              className={`${INPUT_CLASS} disabled:opacity-60`}
            >
              {isLoadingClasses ? (
                <option value="">Loading available classes...</option>
              ) : (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                    {cls.section ? ` (${cls.section})` : ''}
                    {cls.admissionFee !== undefined
                      ? ` — ${formatFeeCurrency(cls.admissionFee, feeConfig?.currency)}`
                      : ''}
                  </option>
                ))
              )}
            </select>
            {showFeeBadge && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <span>Admission Form Fee:</span>
                <strong
                  className={
                    Number(rawClassFee ?? 0) > 0
                      ? 'text-slate-900'
                      : 'text-emerald-700'
                  }
                >
                  {formatFeeCurrency(rawClassFee, feeConfig?.currency)}
                </strong>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Blood Group <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            >
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Birth Registration No <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="birthRegistrationNo"
              placeholder="e.g. 20122691234567890"
              value={formData.birthRegistrationNo}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Previous School Attended <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="previousSchool"
              placeholder="e.g. Riverdale Elementary School"
              value={formData.previousSchool}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-7 py-3 text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-2 shadow-sm"
          style={{ background: 'var(--navy, #102f58)' }}
        >
          Continue to Guardian Info <Icon name="arrow" size={15} />
        </button>
      </div>
    </form>
  )
}
