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

export function AdmissionStepStudent({
  formData,
  classes,
  isLoadingClasses,
  isErpConnected,
  handleInputChange,
  onClassSelect,
  onNext,
}: AdmissionStepStudentProps) {
  return (
    <form onSubmit={onNext} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            required
            placeholder="e.g. Arafat"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            required
            placeholder="e.g. Rahman"
            value={formData.lastName}
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
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Applicant Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. 01711000000"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Applicant Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. student@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Applying For Class / Grade *{' '}
            {isErpConnected && (
              <span className="ml-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Live ERP
              </span>
            )}
          </label>
          <select
            name="appliedClassId"
            required
            disabled={isLoadingClasses}
            value={formData.appliedClassId || formData.applyingForGrade}
            onChange={(e) => onClassSelect(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white disabled:opacity-60"
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
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Blood Group (Optional)
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="sm:col-span-2">
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
  )
}
