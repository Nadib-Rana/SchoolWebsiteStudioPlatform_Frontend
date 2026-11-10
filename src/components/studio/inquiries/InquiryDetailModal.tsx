'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/common/Icon'
import type { ContactInquiryItem } from './inquiry.types'
import { getInquiryStatusBadge } from './inquiry.types'

interface InquiryDetailModalProps {
  inquiry: ContactInquiryItem | null
  onClose: () => void
  onUpdate: (data: {
    status: string
    responseNotes?: string
    replyMessage?: string
    sendEmailReply?: boolean
  }) => Promise<void>
  isUpdating: boolean
}

export function InquiryDetailModal({
  inquiry,
  onClose,
  onUpdate,
  isUpdating,
}: InquiryDetailModalProps) {
  const [status, setStatus] = useState<string>('READ')
  const [responseNotes, setResponseNotes] = useState<string>('')
  const [sendEmailReply, setSendEmailReply] = useState<boolean>(false)
  const [replyMessage, setReplyMessage] = useState<string>('')

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status === 'NEW' ? 'READ' : inquiry.status)
      setResponseNotes(inquiry.responseNotes || '')
      setSendEmailReply(false)
      setReplyMessage(`Dear ${inquiry.fullName},\n\nThank you for reaching out to our school regarding "${inquiry.subject}". `)
    }
  }, [inquiry])

  if (!inquiry) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate({
      status: sendEmailReply ? 'RESPONDED' : status,
      responseNotes: responseNotes.trim() || undefined,
      replyMessage: sendEmailReply ? replyMessage.trim() : undefined,
      sendEmailReply,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getInquiryStatusBadge(inquiry.status)}`}>
                {inquiry.status}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(inquiry.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{inquiry.subject}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Sender details */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong className="text-slate-800 text-sm block">{inquiry.fullName}</strong>
            <span className="text-slate-500 font-mono">{inquiry.email}</span>
            {inquiry.phone && <span className="text-slate-500 ml-2">· {inquiry.phone}</span>}
          </div>
        </div>

        {/* Message body */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inquiry Message</label>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="NEW">NEW</option>
                <option value="READ">READ</option>
                <option value="RESPONDED">RESPONDED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Internal Staff Notes</label>
              <input
                type="text"
                placeholder="e.g. Followed up by phone; requested brochure"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Quick Email Reply */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendEmailReply}
                onChange={(e) => setSendEmailReply(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-blue-900">
                Send email reply directly to {inquiry.email}
              </span>
            </label>

            {sendEmailReply && (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response to the sender..."
                  className="w-full p-3 bg-white border border-blue-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-blue-700 block">
                  This message will be dispatched from your school&apos;s verified mail relay.
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdating && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{sendEmailReply ? 'Send Reply & Save' : 'Save Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
