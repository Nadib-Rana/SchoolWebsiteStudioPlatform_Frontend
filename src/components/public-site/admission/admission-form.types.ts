export type TabMode = 'apply' | 'track'
export type Step = 1 | 2 | 3

export type PaymentGatewayId =
  | 'BKASH'
  | 'NAGAD'
  | 'SSLCOMMERZ'
  | 'SHURJOPAY'
  | 'SONALIPAY'
  | 'STRIPE'
  | string

export interface ErpClassOption {
  id: string
  name: string
  section?: string
  capacity?: number
  admissionFee?: number
}

export interface ErpFeeConfig {
  source?: 'ERP' | 'LOCAL'
  erpConnected?: boolean
  enabled: boolean
  currency: string
  defaultFee: number
  classFees: Record<string, number>
  allowOnlinePayment: boolean
  allowManualPayment: boolean
  manualInstructions?: string
  activeGateways: PaymentGatewayId[]
}

export interface PayOnlineResponse {
  gateway: PaymentGatewayId
  applicationNumber: string
  feeAmount: number
  currency: string
  redirectUrl: string
  transactionId: string
  mode?: string
}

export interface VerifyPaymentResponse {
  verified: boolean
  applicationNumber?: string
  paymentStatus: string
  paymentMethod?: string
  transactionId?: string
  feeAmount?: number
  paidAt?: string
}

export interface ManualPaymentResponse {
  paymentStatus: string
  feeAmount?: number
  transactionId?: string
  paymentMethod?: string
}

export interface PendingPaymentSession {
  schoolSlug: string
  applicationNumber: string
  identifier: string
  gateway: PaymentGatewayId
  transactionId: string
  studentName?: string
  applyingForGrade?: string
  feeAmount?: number
  currency?: string
  photoUrl?: string | null
}

export interface AdmissionFormData {
  firstName: string
  lastName: string
  studentName: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  bloodGroup: string
  birthRegistrationNo: string
  applyingForGrade: string
  appliedClassId: string
  previousSchool: string
  fatherName: string
  motherName: string
  guardianName: string
  guardianRelationship: string
  guardianPhone: string
  guardianEmail: string
  address: string
  presentAddress: string
  permanentAddress: string
  sameAsPresentAddress: boolean
  documentsUrl: string
  photoUrl: string
  declaration: boolean
}

export interface SubmissionResult {
  source?: 'ERP' | 'ERP_PENDING_SYNC' | 'LOCAL'
  queued?: boolean
  applicationNumber: string
  studentName: string
  status: string
  feeAmount?: number
  paymentStatus?: string
  currency?: string
  photoUrl?: string | null
  paymentMethod?: string | null
  transactionId?: string | null
  paymentNote?: string | null
  paidAt?: string | null
}

export interface TrackResult {
  source?: 'ERP' | 'LOCAL'
  applicationNumber: string
  schoolName: string
  studentName: string
  applyingForGrade: string
  status: string
  interviewDate?: string | null
  notes?: string
  feeAmount?: number
  paymentStatus?: string
  paymentMethod?: string | null
  transactionId?: string | null
  paymentNote?: string | null
  paidAt?: string | null
  currency?: string
  photoUrl?: string | null
  submittedAt: string
  lastUpdatedAt: string
}

export function formatFeeCurrency(amount?: number, currency = 'BDT'): string {
  const num = Number(amount ?? 0)
  if (!Number.isFinite(num) || num <= 0) return 'Free'
  const upper = (currency || 'BDT').toUpperCase()
  const symbol =
    upper === 'BDT'
      ? '৳'
      : upper === 'USD'
      ? '$'
      : upper === 'EUR'
      ? '€'
      : upper === 'GBP'
      ? '£'
      : `${upper} `
  return `${symbol}${num.toLocaleString()}`
}

export function getPaymentStatusBadge(status?: string) {
  switch ((status || 'NOT_REQUIRED').toUpperCase()) {
    case 'PAID':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Paid',
      }
    case 'UNDER_VERIFICATION':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Under Verification',
      }
    case 'PENDING':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Payment Pending',
      }
    case 'WAIVED':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        label: 'Fee Waived',
      }
    case 'NOT_REQUIRED':
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: 'No Fee Required',
      }
  }
}

export function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', label: 'Pending Review' }
    case 'SUBMITTED':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Application Received' }
    case 'UNDER_REVIEW':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Under Review' }
    case 'SHORTLISTED':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'Shortlisted for Assessment' }
    case 'INTERVIEW_SCHEDULED':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', label: 'Interview Scheduled' }
    case 'APPROVED':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Approved' }
    case 'ACCEPTED':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Offer of Admission Accepted' }
    case 'REJECTED':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', label: 'Application Unsuccessful' }
    case 'CONVERTED':
    case 'ENROLLED':
      return { bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500', label: 'Enrolled as Student' }
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500', label: status }
  }
}
