'use client'

import { Icon } from '@/components/common/Icon'
import type { AdmissionFormData, ErpClassOption } from './admission-form.types'

interface AdmissionStepStudentProps {
  formData: AdmissionFormData
  classes: ErpClassOption[]
  isLoadingClasses: boolean
  isErpConnected: boolean
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onClassSelect: (classId: string) => void
  onNext: (e: React.FormEvent) => void
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 text-sm transition shadow-xs'

export function AdmissionStepStudent({
  formData,
  classes,
  isLoadingClasses,
  isErpConnected,
  handleInputChange,
  onClassSelect,
  onNext,
}: AdmissionStepStudentProps) {
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
                  </option>
                ))
              )}
            </select>
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

          <div className="sm:col-span-2">
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
