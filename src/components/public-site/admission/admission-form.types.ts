export type TabMode = 'apply' | 'track'
export type Step = 1 | 2 | 3

export interface AdmissionFormData {
  studentName: string
  dateOfBirth: string
  gender: string
  applyingForGrade: string
  previousSchool: string
  guardianName: string
  guardianRelationship: string
  guardianPhone: string
  guardianEmail: string
  address: string
  declaration: boolean
}

export interface SubmissionResult {
  applicationNumber: string
  studentName: string
  status: string
}

export interface TrackResult {
  applicationNumber: string
  schoolName: string
  studentName: string
  applyingForGrade: string
  status: string
  notes?: string
  submittedAt: string
  lastUpdatedAt: string
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'SUBMITTED':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Application Received' }
    case 'UNDER_REVIEW':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Under Review' }
    case 'SHORTLISTED':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'Shortlisted for Assessment' }
    case 'INTERVIEW_SCHEDULED':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', label: 'Interview Scheduled' }
    case 'ACCEPTED':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Offer of Admission Accepted' }
    case 'REJECTED':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', label: 'Application Unsuccessful' }
    case 'ENROLLED':
      return { bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500', label: 'Officially Enrolled' }
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500', label: status }
  }
}
