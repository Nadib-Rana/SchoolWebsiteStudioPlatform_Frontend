'use client'

import { Icon } from '@/components/common/Icon'
import {
  formatFeeCurrency,
  getPaymentStatusBadge,
  type ErpFeeConfig,
  type SubmissionResult,
} from './admission-form.types'
import { AdmissionPaymentPanel } from './AdmissionPaymentPanel'

interface AdmissionSuccessScreenProps {
  schoolSlug: string
  schoolName: string
  submissionResult: SubmissionResult
  feeConfig?: ErpFeeConfig | null
  applicantIdentifier: string
  applyingForGrade?: string
  photoUrl?: string | null
  copied: boolean
  paymentBanner?: { type: 'success' | 'error' | 'info'; text: string } | null
  onPaymentComplete: (update: {
    paymentStatus: string
    paymentMethod?: string
    transactionId?: string
    feeAmount?: number
    paidAt?: string
  }) => void
  onCopy: () => void
  onTrack: (appNum: string) => void
  onPrintReceipt: () => void
}

export function AdmissionSuccessScreen({
  schoolSlug,
  schoolName,
  submissionResult,
  feeConfig,
  applicantIdentifier,
  applyingForGrade,
  photoUrl,
  copied,
  paymentBanner,
  onPaymentComplete,
  onCopy,
  onTrack,
  onPrintReceipt,
}: AdmissionSuccessScreenProps) {
  const feeAmount = Number(submissionResult.feeAmount ?? 0)
  const paymentStatus = (submissionResult.paymentStatus || 'NOT_REQUIRED').toUpperCase()
  const paymentBadge = getPaymentStatusBadge(paymentStatus)
  const needsPayment =
    paymentStatus === 'PENDING' &&
    feeAmount > 0 &&
    Boolean(
      feeConfig &&
        ((feeConfig.allowOnlinePayment && feeConfig.activeGateways?.length > 0) ||
          feeConfig.allowManualPayment),
    )

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 mx-auto mb-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
        <Icon name="check" size={32} />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        {paymentStatus === 'PAID'
          ? 'Application & Fee Payment Confirmed'
          : 'Application Successfully Registered'}
      </span>
      <h2 className="text-2xl font-bold text-slate-900 mt-3">
        Welcome to {schoolName}, {submissionResult.studentName}!
      </h2>
      <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">
        {needsPayment
          ? 'Your application is registered. Please complete your admission form fee payment below to finalize processing.'
          : 'Your admission application has been recorded in the school registry. Keep your reference number below to track review milestones, interview schedules, and admission offers.'}
      </p>

      {paymentBanner && (
        <div
          className={`mt-5 max-w-xl mx-auto p-3.5 rounded-xl text-sm border text-left ${
            paymentBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : paymentBanner.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          {paymentBanner.text}
        </div>
      )}

      <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl max-w-xl mx-auto">
        <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
          Official Application Number
        </span>
        <div className="text-3xl font-mono font-extrabold text-slate-900 mt-1 tracking-wider">
          {submissionResult.applicationNumber}
        </div>

        {(feeAmount > 0 || (submissionResult.paymentStatus && paymentStatus !== 'NOT_REQUIRED')) && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-slate-600">
              Admission Fee:{' '}
              <strong className="text-slate-900">
                {formatFeeCurrency(feeAmount, submissionResult.currency)}
              </strong>
              {submissionResult.paymentMethod && (
                <span className="ml-2 text-slate-500">
                  · {submissionResult.paymentMethod}
                </span>
              )}
              {submissionResult.transactionId && (
                <span className="ml-2 font-mono text-slate-600">
                  (TrxID: {submissionResult.transactionId})
                </span>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${paymentBadge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
              {paymentBadge.label}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={onPrintReceipt}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 text-white rounded-xl shadow-sm hover:opacity-95 active:scale-95 transition"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <Icon name="download" size={14} />
            Download / Print Receipt (PDF)
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition"
          >
            <Icon name="copy" size={14} />
            {copied ? 'Copied to Clipboard!' : 'Copy Reference Number'}
          </button>
          <button
            type="button"
            onClick={() => onTrack(submissionResult.applicationNumber)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-sm hover:bg-slate-800 transition"
          >
            Track Progress <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>

      {needsPayment && feeConfig && (
        <div className="max-w-xl mx-auto">
          <AdmissionPaymentPanel
            schoolSlug={schoolSlug}
            applicationNumber={submissionResult.applicationNumber}
            identifier={applicantIdentifier}
            studentName={submissionResult.studentName}
            applyingForGrade={applyingForGrade}
            feeAmount={feeAmount}
            currency={submissionResult.currency || feeConfig.currency}
            photoUrl={photoUrl || submissionResult.photoUrl}
            feeConfig={feeConfig}
            onPaymentComplete={onPaymentComplete}
          />
        </div>
      )}
    </div>
  )
}
