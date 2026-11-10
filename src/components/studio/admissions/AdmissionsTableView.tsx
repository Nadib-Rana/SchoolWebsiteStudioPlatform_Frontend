'use client'

import type { AdmissionItem } from './admission.types'
import { getAdmissionStatusBadge } from './admission.types'

interface AdmissionsTableViewProps {
  applications: AdmissionItem[]
  loading: boolean
  onOpenDetail: (app: AdmissionItem) => void
}

export function AdmissionsTableView({
  applications,
  loading,
  onOpenDetail,
}: AdmissionsTableViewProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading admission applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          No admission applications found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Reference No.</th>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Guardian</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs">
                    {app.applicationNumber}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {app.studentName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {app.applyingForGrade}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 text-xs">{app.guardianName}</div>
                    <div className="text-slate-500 text-xs">{app.guardianPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getAdmissionStatusBadge(
                        app.status,
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(app)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
                    >
                      View & Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
