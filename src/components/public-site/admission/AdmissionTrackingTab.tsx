'use client'

import { Icon } from '@/components/common/Icon'
import { getStatusBadge, type TrackResult } from './admission-form.types'

interface AdmissionTrackingTabProps {
  trackAppNumber: string
  setTrackAppNumber: (val: string) => void
  trackPhone: string
  setTrackPhone: (val: string) => void
  isTracking: boolean
  trackError: string | null
  trackResult: TrackResult | null
  onTrackSubmit: (e: React.FormEvent) => void
}

export function AdmissionTrackingTab({
  trackAppNumber,
  setTrackAppNumber,
  trackPhone,
  setTrackPhone,
  isTracking,
  trackError,
  trackResult,
  onTrackSubmit,
}: AdmissionTrackingTabProps) {
  return (
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

        <form onSubmit={onTrackSubmit} className="space-y-4">
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
              Guardian Phone Number *
            </label>
            <input
              type="tel"
              required
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
  )
}
