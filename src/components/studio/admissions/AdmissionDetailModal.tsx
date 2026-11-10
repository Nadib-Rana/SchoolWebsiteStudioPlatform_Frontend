'use client'

import { Icon } from '@/components/common/Icon'
import type { AdmissionItem } from './admission.types'

interface AdmissionDetailModalProps {
  app: AdmissionItem | null
  newStatus: string
  setNewStatus: (s: string) => void
  newNotes: string
  setNewNotes: (n: string) => void
  updatingStatus: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function AdmissionDetailModal({
  app,
  newStatus,
  setNewStatus,
  newNotes,
  setNewNotes,
  updatingStatus,
  onClose,
  onSubmit,
}: AdmissionDetailModalProps) {
  if (!app) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Admission Review
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-mono">
              {app.applicationNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="py-6 space-y-6 text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Student Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block text-xs">Full Name:</span>
                <strong className="text-sm font-semibold">{app.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Applying Grade:</span>
                <strong className="text-sm font-semibold">{app.applyingForGrade}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Date of Birth:</span>
                <span>{new Date(app.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Gender:</span>
                <span>{app.gender}</span>
              </div>
              {app.previousSchool && (
                <div className="col-span-2">
                  <span className="text-slate-500 block text-xs">Previous School:</span>
                  <span>{app.previousSchool}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Guardian & Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block text-xs">Guardian Name:</span>
                <strong className="text-sm font-semibold">{app.guardianName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Relationship:</span>
                <span>{app.guardianRelationship}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Phone:</span>
                <a href={`tel:${app.guardianPhone}`} className="text-blue-600 underline">
                  {app.guardianPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Email:</span>
                <a href={`mailto:${app.guardianEmail}`} className="text-blue-600 underline">
                  {app.guardianEmail}
                </a>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-xs">Residential Address:</span>
                <span>{app.address}</span>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Update Application Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
              >
                <option value="SUBMITTED">SUBMITTED (Received)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="INTERVIEW_SCHEDULED">INTERVIEW SCHEDULED</option>
                <option value="ACCEPTED">ACCEPTED (Offer Sent)</option>
                <option value="REJECTED">REJECTED (Unsuccessful)</option>
                <option value="ENROLLED">ENROLLED (Confirmed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Committee Notes / Instructions (Visible to Applicant on Tracking Portal)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Interview scheduled for Friday at 10:00 AM in Campus Hall Room 102. Please bring original birth certificate."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingStatus}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {updatingStatus ? 'Saving...' : 'Update Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
