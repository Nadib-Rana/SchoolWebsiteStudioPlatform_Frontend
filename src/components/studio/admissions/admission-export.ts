import type { AdmissionItem } from './admission.types'

export function exportAdmissionsToCsv(items: AdmissionItem[], schoolName = 'School') {
  if (!items || items.length === 0) return

  const headers = [
    'Reference No',
    'Student Name',
    'Date of Birth',
    'Gender',
    'Grade',
    'Guardian Name',
    'Relationship',
    'Phone',
    'Email',
    'Address',
    'Status',
    'Submission Date',
    'Notes',
  ]

  const rows = items.map((a) => [
    `"${a.applicationNumber || ''}"`,
    `"${(a.studentName || '').replace(/"/g, '""')}"`,
    `"${a.dateOfBirth || ''}"`,
    `"${a.gender || ''}"`,
    `"${a.applyingForGrade || ''}"`,
    `"${(a.guardianName || '').replace(/"/g, '""')}"`,
    `"${a.guardianRelationship || ''}"`,
    `"${a.guardianPhone || ''}"`,
    `"${a.guardianEmail || ''}"`,
    `"${(a.address || '').replace(/"/g, '""')}"`,
    `"${a.status || ''}"`,
    `"${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}"`,
    `"${(a.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  link.setAttribute('href', url)
  link.setAttribute('download', `${schoolName.toLowerCase().replace(/\s+/g, '_')}_admissions_${dateStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
