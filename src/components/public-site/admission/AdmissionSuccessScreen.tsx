'use client'

import { Icon } from '@/components/common/Icon'
import type { SubmissionResult } from './admission-form.types'

interface AdmissionSuccessScreenProps {
  schoolName: string
  submissionResult: SubmissionResult
  copied: boolean
  onCopy: () => void
  onTrack: (appNum: string) => void
}

export function AdmissionSuccessScreen({
  schoolName,
  submissionResult,
  copied,
  onCopy,
  onTrack,
}: AdmissionSuccessScreenProps) {
  return (
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
            onClick={onCopy}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 active:scale-95 transition"
          >
            <Icon name="copy" size={14} />
            {copied ? 'Copied to Clipboard!' : 'Copy Reference Number'}
          </button>
          <button
            type="button"
            onClick={() => onTrack(submissionResult.applicationNumber)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition"
          >
            Track Progress <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
