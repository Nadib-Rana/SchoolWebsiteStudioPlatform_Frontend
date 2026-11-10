'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { SchoolProfileData } from '@/lib/public-site'
import { ContactInfoAside } from './ContactInfoAside'
import { ContactSuccessMessage } from './ContactSuccessMessage'

interface PublicContactFormProps {
  schoolSlug: string
  schoolName: string
  profile?: SchoolProfileData
}

export function PublicContactForm({
  schoolSlug,
  schoolName,
  profile,
}: PublicContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General enquiry',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      await api.publicSite.submitInquiry({
        schoolSlug,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      })
      setIsSubmitted(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to send your message. Please check your network and try again.'
      setErrorMsg(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: 'General enquiry',
      message: '',
    })
  }

  return (
    <section className="contact-content max-w-6xl mx-auto px-6 py-12">
      <ContactInfoAside schoolName={schoolName} profile={profile} />

      {isSubmitted ? (
        <ContactSuccessMessage schoolName={schoolName} onReset={handleReset} />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Your Full Name *
            </span>
            <input
              required
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Email Address *
            </span>
            <input
              required
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Contact Phone (Optional)
            </span>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Subject & Purpose
            </span>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
            >
              <option value="General enquiry">General enquiry</option>
              <option value="Admissions & Enrollment">Admissions & Enrollment</option>
              <option value="Campus Tour Request">Campus Tour Request</option>
              <option value="Academic Programs">Academic Programs</option>
              <option value="Fees & Scholarships">Fees & Scholarships</option>
              <option value="Parent Association">Parent Association</option>
            </select>
          </label>

          <label className="block mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Message *
            </span>
            <textarea
              required
              rows={4}
              placeholder="How can our school team help you?"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg bg-blue-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-950 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </form>
      )}
    </section>
  )
}
