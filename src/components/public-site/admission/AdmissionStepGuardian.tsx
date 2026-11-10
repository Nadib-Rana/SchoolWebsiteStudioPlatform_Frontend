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

export function AdmissionStepGuardian({
  formData,
  handleInputChange,
  onNext,
  onBack,
}: AdmissionStepGuardianProps) {
  return (
    <form onSubmit={onNext} className="space-y-6">
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
          onClick={onBack}
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
  )
}
