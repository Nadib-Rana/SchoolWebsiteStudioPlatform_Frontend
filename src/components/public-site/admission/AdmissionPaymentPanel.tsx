'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import {
  formatFeeCurrency,
  type ErpFeeConfig,
  type PaymentGatewayId,
  type PendingPaymentSession,
} from './admission-form.types'

export const PENDING_PAYMENT_STORAGE_KEY = 'admission_pending_payment'

const GATEWAY_META: Record<
  string,
  { label: string; bg: string; hover: string }
> = {
  BKASH: {
    label: 'Pay with bKash',
    bg: '#e2136e',
    hover: '#c80e5f',
  },
  NAGAD: {
    label: 'Pay with Nagad',
    bg: '#f26522',
    hover: '#d95316',
  },
  SSLCOMMERZ: {
    label: 'Pay with SSLCommerz',
    bg: '#234495',
    hover: '#1b3576',
  },
  SHURJOPAY: {
    label: 'Pay with ShurjoPay',
    bg: '#0ea5e9',
    hover: '#0284c7',
  },
  SONALIPAY: {
    label: 'Pay with SonaliPay',
    bg: '#047857',
    hover: '#065f46',
  },
  STRIPE: {
    label: 'Pay with Card (Stripe)',
    bg: '#4f46e5',
    hover: '#4338ca',
  },
}

const MANUAL_METHODS = [
  { id: 'BKASH', label: 'bKash' },
  { id: 'NAGAD', label: 'Nagad' },
  { id: 'ROCKET', label: 'Rocket' },
  { id: 'UPAY', label: 'Upay' },
  { id: 'BANK', label: 'Bank Transfer' },
]

interface AdmissionPaymentPanelProps {
  schoolSlug: string
  applicationNumber: string
  identifier: string
  studentName?: string
  applyingForGrade?: string
  feeAmount: number
  currency?: string
  photoUrl?: string | null
  feeConfig: ErpFeeConfig
  onPaymentComplete: (update: {
    paymentStatus: string
    paymentMethod?: string
    transactionId?: string
    feeAmount?: number
    paidAt?: string
  }) => void
}

export function AdmissionPaymentPanel({
  schoolSlug,
  applicationNumber,
  identifier,
  studentName,
  applyingForGrade,
  feeAmount,
  currency = 'BDT',
  photoUrl,
  feeConfig,
  onPaymentComplete,
}: AdmissionPaymentPanelProps) {
  const [activeGateway, setActiveGateway] = useState<string | null>(null)
  const [manualMethod, setManualMethod] = useState('BKASH')
  const [transactionId, setTransactionId] = useState('')
  const [paymentNote, setPaymentNote] = useState('')
  const [isSubmittingManual, setIsSubmittingManual] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canPayOnline =
    feeConfig.allowOnlinePayment &&
    Array.isArray(feeConfig.activeGateways) &&
    feeConfig.activeGateways.length > 0
  const canPayManual = feeConfig.allowManualPayment

  if (!canPayOnline && !canPayManual) {
    return null
  }

  const handlePayOnline = async (gateway: PaymentGatewayId) => {
    if (!identifier.trim()) {
      setError('Applicant or guardian phone number is required to initiate payment.')
      return
    }
    setError(null)
    setActiveGateway(gateway)
    try {
      const origin = window.location.origin
      const pathnameClean = window.location.pathname.replace(/\/+$/, '')
      const isAdmissionsPath = pathnameClean.endsWith('/admissions')
      const callbackPath = isAdmissionsPath
        ? `${pathnameClean}/payment-callback`
        : `/${encodeURIComponent(schoolSlug)}/admissions/payment-callback`
      const callbackBaseUrl = `${origin}${callbackPath}`

      const res = await api.admissions.payOnline(schoolSlug, {
        applicationNumber,
        identifier: identifier.trim(),
        gateway,
        callbackBaseUrl,
      })
      const data = res?.data
      if (!data?.redirectUrl) {
        throw new Error('Payment gateway did not return a checkout URL.')
      }

      const pendingSession: PendingPaymentSession = {
        schoolSlug,
        applicationNumber: data.applicationNumber || applicationNumber,
        identifier: identifier.trim(),
        gateway: data.gateway || gateway,
        transactionId: data.transactionId || '',
        studentName,
        applyingForGrade,
        feeAmount: data.feeAmount ?? feeAmount,
        currency: data.currency || currency,
        photoUrl: photoUrl || undefined,
      }

      try {
        window.sessionStorage.setItem(
          PENDING_PAYMENT_STORAGE_KEY,
          JSON.stringify(pendingSession),
        )
      } catch {
        // Retry without embedded Data URI photo if sessionStorage quota is exceeded
        try {
          const compactSession = { ...pendingSession, photoUrl: undefined }
          window.sessionStorage.setItem(
            PENDING_PAYMENT_STORAGE_KEY,
            JSON.stringify(compactSession),
          )
        } catch {
          // Ignore storage errors; callback URL carries fallback parameters
        }
      }

      window.location.assign(data.redirectUrl)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to initiate online payment right now.',
      )
      setActiveGateway(null)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionId.trim()) {
      setError('Please enter your Payment Transaction ID (TrxID).')
      return
    }
    if (!identifier.trim()) {
      setError('Applicant or guardian phone number is required.')
      return
    }
    setError(null)
    setIsSubmittingManual(true)
    try {
      const res = await api.admissions.payManual(schoolSlug, {
        applicationNumber,
        identifier: identifier.trim(),
        paymentMethod: manualMethod,
        transactionId: transactionId.trim(),
        paymentNote: paymentNote.trim() || undefined,
      })
      const data = res?.data
      onPaymentComplete({
        paymentStatus: data?.paymentStatus || 'UNDER_VERIFICATION',
        paymentMethod: data?.paymentMethod || manualMethod,
        transactionId: data?.transactionId || transactionId.trim(),
        feeAmount: data?.feeAmount ?? feeAmount,
      })
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit manual payment details.',
      )
    } finally {
      setIsSubmittingManual(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white text-left overflow-hidden shadow-sm">
      <div
        className="px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3"
        style={{ background: 'var(--navy, #102f58)' }}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
            Admission Fee Payment Required
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Application #{applicationNumber}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-slate-300 block">
            Payable Fee
          </span>
          <strong className="text-xl font-extrabold text-white">
            {formatFeeCurrency(feeAmount, currency)}
          </strong>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <Icon name="close" size={14} />
            <span>{error}</span>
          </div>
        )}

        {canPayOnline && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Pay Online Instantly
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any payment gateway below to complete your admission fee securely.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feeConfig.activeGateways.map((gw) => {
                const key = String(gw).toUpperCase()
                const meta = GATEWAY_META[key] || {
                  label: `Pay with ${key}`,
                  bg: '#0f172a',
                  hover: '#1e293b',
                }
                const isLoading = activeGateway === key
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={Boolean(activeGateway) || isSubmittingManual}
                    onClick={() => handlePayOnline(key)}
                    className="px-4 py-3 rounded-xl text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: meta.bg }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        {meta.label} <Icon name="arrow" size={14} />
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {canPayOnline && canPayManual && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OR Pay Manually
            </span>
          </div>
        )}

        {canPayManual && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Manual MFS / Bank Transfer Verification
              </h4>
              {feeConfig.manualInstructions && (
                <div className="mt-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed whitespace-pre-line">
                  {feeConfig.manualInstructions}
                </div>
              )}
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  >
                    {MANUAL_METHODS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9K4M2P7Q1X"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sender Number / Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sent from 01711000000"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingManual || Boolean(activeGateway)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingManual ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Payment Reference...
                  </>
                ) : (
                  <>
                    Submit Transaction ID for Verification <Icon name="check" size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

