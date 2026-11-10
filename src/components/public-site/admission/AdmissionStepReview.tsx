'use client'

import { Icon } from '@/components/common/Icon'
import type { AdmissionFormData } from './admission-form.types'

interface AdmissionStepReviewProps {
  formData: AdmissionFormData
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export function AdmissionStepReview({
  formData,
  handleInputChange,
  onBack,
  onSubmit,
  isSubmitting,
}: AdmissionStepReviewProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onClick={onBack}
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
  )
}
