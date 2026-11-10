export interface AdmissionItem {
  id: string
  applicationNumber: string
  studentName: string
  dateOfBirth: string
  gender: string
  applyingForGrade: string
  previousSchool?: string
  guardianName: string
  guardianRelationship: string
  guardianPhone: string
  guardianEmail: string
  address: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export function getAdmissionStatusBadge(status: string): string {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'UNDER_REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'SHORTLISTED':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'INTERVIEW_SCHEDULED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'ACCEPTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'ENROLLED':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}
