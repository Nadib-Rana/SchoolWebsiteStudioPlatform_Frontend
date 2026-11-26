'use client'

import { Icon } from '@/components/common/Icon'
import type { AdmissionFormData } from './admission-form.types'

interface AdmissionStepGuardianProps {
  formData: AdmissionFormData
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onNext: (e: React.FormEvent) => void
  onBack: () => void
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-800 text-sm transition shadow-xs'

export function AdmissionStepGuardian({
  formData,
  handleInputChange,
  onNext,
  onBack,
}: AdmissionStepGuardianProps) {
  return (
    <form onSubmit={onNext} className="space-y-6">
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Parent / Legal Guardian Contact</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              We will use these details for interview updates and admission notifications.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Step 2 of 3</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Father&apos;s Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="fatherName"
              placeholder="e.g. Kamal Rahman"
              value={formData.fatherName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mother&apos;s Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="motherName"
              placeholder="e.g. Fatema Begum"
              value={formData.motherName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Guardian Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="guardianName"
              required
              placeholder="e.g. Kamal Rahman"
              value={formData.guardianName}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Relationship to Student <span className="text-rose-500">*</span>
            </label>
            <select
              name="guardianRelationship"
              value={formData.guardianRelationship}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Parents">Parents</option>
              <option value="Legal Guardian">Legal Guardian</option>
              <option value="Relative">Relative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="guardianPhone"
              required
              placeholder="e.g. 01711000001"
              value={formData.guardianPhone}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="guardianEmail"
              required
              placeholder="e.g. parent@example.com"
              value={formData.guardianEmail}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Present Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="presentAddress"
              rows={2}
              required
              placeholder="House/Street, Area, City, Postal Code"
              value={formData.presentAddress || formData.address}
              onChange={handleInputChange}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Permanent Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="sameAsPresentAddress"
                  checked={formData.sameAsPresentAddress}
                  onChange={handleInputChange}
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />
                <span>Same as Present Address</span>
              </label>
            </div>
            <textarea
              name="permanentAddress"
              rows={2}
              disabled={formData.sameAsPresentAddress}
              placeholder="Village/Street, Upazila, District"
              value={
                formData.sameAsPresentAddress
                  ? formData.presentAddress || formData.address
                  : formData.permanentAddress
              }
              onChange={handleInputChange}
              className={`${INPUT_CLASS} disabled:bg-slate-100 disabled:text-slate-500`}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-between items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
        >
          ← Back to Student Info
        </button>
        <button
          type="submit"
          className="px-7 py-3 text-white text-sm font-semibold rounded-xl hover:opacity-95 transition flex items-center gap-2 shadow-sm"
          style={{ background: 'var(--navy, #102f58)' }}
        >
          Review & Submit <Icon name="arrow" size={15} />
        </button>
      </div>
    </form>
  )
}
