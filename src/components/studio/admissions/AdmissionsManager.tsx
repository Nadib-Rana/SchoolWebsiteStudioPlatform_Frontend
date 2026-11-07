'use client'

import { useState, useEffect, useCallback } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import { useStudio } from '@/context/StudioContext'

interface AdmissionItem {
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

export function AdmissionsManager() {
  const { notify } = useStudio()
  const [applications, setApplications] = useState<AdmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<AdmissionItem | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [newNotes, setNewNotes] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let ignore = false
    const run = async () => {
      try {
        const res = await api.admissions.list(undefined, {
          status: filterStatus === 'ALL' ? undefined : filterStatus,
          search: searchQuery.trim() || undefined,
        })
        if (!ignore && res.data) {
          setApplications(res.data)
        }
      } catch {
        if (!ignore) {
          notify('Unable to load admission applications from server')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    void run()
    return () => {
      ignore = true
    }
  }, [filterStatus, searchQuery, refreshKey, notify])

  const refreshApplications = () => {
    setLoading(true)
    setRefreshKey((k) => k + 1)
  }

  const handleOpenDetail = (app: AdmissionItem) => {
    setSelectedApp(app)
    setNewStatus(app.status)
    setNewNotes(app.notes || '')
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApp) return
    setUpdatingStatus(true)
    try {
      await api.admissions.updateStatus(
        selectedApp.id,
        newStatus,
        newNotes.trim() || undefined
      )
      notify(`Application ${selectedApp.applicationNumber} updated to ${newStatus}`)
      setSelectedApp(null)
      refreshApplications()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      notify(msg)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search by student, guardian, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <Icon name="search" size={15} />
            </div>
          </div>
          <button
            type="button"
            onClick={refreshApplications}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
          >
            Filter
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            'ALL',
            'SUBMITTED',
            'UNDER_REVIEW',
            'SHORTLISTED',
            'INTERVIEW_SCHEDULED',
            'ACCEPTED',
            'REJECTED',
            'ENROLLED',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'All Applications' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
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
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(app)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Admission Review
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-mono">
                  {selectedApp.applicationNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="py-6 space-y-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Student Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-xs">Full Name:</span>
                    <strong className="text-sm font-semibold">{selectedApp.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Applying Grade:</span>
                    <strong className="text-sm font-semibold">{selectedApp.applyingForGrade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Date of Birth:</span>
                    <span>{new Date(selectedApp.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Gender:</span>
                    <span>{selectedApp.gender}</span>
                  </div>
                  {selectedApp.previousSchool && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block text-xs">Previous School:</span>
                      <span>{selectedApp.previousSchool}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Guardian & Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-xs">Guardian Name:</span>
                    <strong className="text-sm font-semibold">{selectedApp.guardianName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Relationship:</span>
                    <span>{selectedApp.guardianRelationship}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Phone:</span>
                    <a href={`tel:${selectedApp.guardianPhone}`} className="text-blue-600 underline">
                      {selectedApp.guardianPhone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Email:</span>
                    <a href={`mailto:${selectedApp.guardianEmail}`} className="text-blue-600 underline">
                      {selectedApp.guardianEmail}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-xs">Residential Address:</span>
                    <span>{selectedApp.address}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Update Application Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                  >
                    <option value="SUBMITTED">SUBMITTED (Received)</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW_SCHEDULED">INTERVIEW SCHEDULED</option>
                    <option value="ACCEPTED">ACCEPTED (Offer Sent)</option>
                    <option value="REJECTED">REJECTED (Unsuccessful)</option>
                    <option value="ENROLLED">ENROLLED (Confirmed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Committee Notes / Instructions (Visible to Applicant on Tracking Portal)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Interview scheduled for Friday at 10:00 AM in Campus Hall Room 102. Please bring original birth certificate."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {updatingStatus ? 'Saving...' : 'Update Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
