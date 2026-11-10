'use client'

import type { AdmissionItem } from './admission.types'
import { getAdmissionStatusBadge } from './admission.types'

interface AdmissionsPipelineViewProps {
  applications: AdmissionItem[]
  onOpenDetail: (app: AdmissionItem) => void
  onAdvanceStage: (app: AdmissionItem, nextStage: string) => void
}

const PIPELINE_STAGES = [
  { key: 'SUBMITTED', title: 'New Submissions', next: 'UNDER_REVIEW', nextLabel: 'Review →', color: 'border-blue-400' },
  { key: 'UNDER_REVIEW', title: 'Under Review', next: 'INTERVIEW_SCHEDULED', nextLabel: 'Interview →', color: 'border-amber-400' },
  { key: 'INTERVIEW_SCHEDULED', title: 'Interview / Shortlist', next: 'ACCEPTED', nextLabel: 'Accept →', color: 'border-indigo-400' },
  { key: 'ACCEPTED', title: 'Accepted', next: 'ENROLLED', nextLabel: 'Enroll →', color: 'border-emerald-400' },
  { key: 'ENROLLED', title: 'Enrolled', next: '', nextLabel: '', color: 'border-teal-400' },
]

export function AdmissionsPipelineView({
  applications,
  onOpenDetail,
  onAdvanceStage,
}: AdmissionsPipelineViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {PIPELINE_STAGES.map((stage) => {
        const stageApps = applications.filter((a) => a.status === stage.key)
        return (
          <div
            key={stage.key}
            className={`bg-slate-50/80 rounded-xl border-t-4 ${stage.color} border-slate-200 p-3 flex flex-col min-w-[210px] shadow-xs`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-bold text-xs text-slate-700 tracking-wide">{stage.title}</span>
              <span className="bg-slate-200/80 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {stageApps.length}
              </span>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[620px] pr-0.5">
              {stageApps.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
                  No applications
                </div>
              ) : (
                stageApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onOpenDetail(app)}
                    className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        {app.applicationNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getAdmissionStatusBadge(app.status)}`}>
                        {app.applyingForGrade}
                      </span>
                    </div>

                    <strong className="block text-slate-900 text-xs group-hover:text-blue-600 transition truncate">
                      {app.studentName}
                    </strong>

                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {app.guardianName} · {app.guardianPhone}
                    </div>

                    {stage.next ? (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAdvanceStage(app, stage.next)
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition"
                        >
                          {stage.nextLabel}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
