export interface ContactInquiryItem {
  id: string
  schoolId: string
  fullName: string
  email: string
  phone?: string | null
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED'
  responseNotes?: string | null
  createdAt: string
  updatedAt: string
}

export function getInquiryStatusBadge(status: string) {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'READ':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'RESPONDED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'ARCHIVED':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}
