'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { ContactInquiryItem } from './inquiry.types'
import { getInquiryStatusBadge } from './inquiry.types'
import { InquiryFilterBar } from './InquiryFilterBar'
import { InquiryDetailModal } from './InquiryDetailModal'

export function InquiriesManager() {
  const { notify } = useStudio()
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const loadInquiries = useCallback(async () => {
    try {
      const res = await api.inquiries.list()
      const data = res?.data || res
      if (Array.isArray(data)) setInquiries(data)
    } catch {
      notify('Unable to load inquiries from server')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void loadInquiries()
  }, [loadInquiries])

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: inquiries.length }
    for (const item of inquiries) {
      map[item.status] = (map[item.status] || 0) + 1
    }
    return map
  }, [inquiries])

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.phone && item.phone.toLowerCase().includes(q))
      return matchStatus && matchSearch
    })
  }, [inquiries, filterStatus, searchQuery])

  const handleUpdate = async (data: {
    status: string
    responseNotes?: string
    replyMessage?: string
    sendEmailReply?: boolean
  }) => {
    if (!selectedInquiry) return
    setIsUpdating(true)
    try {
      await api.inquiries.update(selectedInquiry.id, data)
      notify(
        data.sendEmailReply
          ? `Reply dispatched to ${selectedInquiry.email}`
          : `Inquiry status updated to ${data.status}`,
      )
      setSelectedInquiry(null)
      await loadInquiries()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update inquiry'
      notify(msg)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete contact inquiry from ${name}?`)) return
    try {
      await api.inquiries.delete(id)
      notify('Inquiry deleted successfully')
      await loadInquiries()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete'
      notify(msg)
    }
  }

  return (
    <div className="space-y-6">
      <InquiryFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onRefresh={loadInquiries}
        counts={counts}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No inquiries found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInquiries.map((item) => {
              const isNew = item.status === 'NEW'
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedInquiry(item)}
                  className="p-4 hover:bg-slate-50/70 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isNew ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`} />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {item.fullName}
                        </strong>
                        <span className="text-[11px] text-slate-400 font-mono truncate">{item.email}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${getInquiryStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 truncate">{item.subject}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0 justify-end">
                    <span className="text-[11px] text-slate-400 mr-2">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedInquiry(item)
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                    >
                      Review & Reply
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item.id, item.fullName)
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Delete inquiry"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  )
}
