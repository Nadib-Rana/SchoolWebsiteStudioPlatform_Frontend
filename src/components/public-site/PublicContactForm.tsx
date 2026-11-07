'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { SchoolProfileData } from '@/lib/public-site'

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

  const address =
    profile?.address || '27 Lakeview Avenue, Riverdale, NY 10471'
  const phone = profile?.phone || '+1 (555) 234-5678'
  const email = profile?.email || 'admissions@northfieldhigh.edu'
  const officeHours =
    profile?.officeHours || 'Monday – Friday · 8:00 AM – 4:30 PM'

  return (
    <section className="contact-content max-w-6xl mx-auto px-6 py-12">
      {/* School Office Contact Info */}
      <div>
        <span className="section-kicker">SCHOOL OFFICE & CAMPUS</span>
        <h2>Visit or contact {schoolName}.</h2>
        <p className="whitespace-pre-line leading-relaxed text-slate-700">
          {address}
        </p>

        <p className="mt-4">
          <strong>Direct Telephone</strong>
          <br />
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="text-blue-900 hover:underline font-medium"
          >
            {phone}
          </a>
        </p>

        {profile?.emergencyPhone && (
          <p className="mt-2 text-rose-700">
            <strong>Emergency Hotline</strong>
            <br />
            {profile.emergencyPhone}
          </p>
        )}

        <p className="mt-4">
          <strong>Official Email</strong>
          <br />
          <a
            href={`mailto:${email}`}
            className="text-blue-900 hover:underline font-medium"
          >
            {email}
          </a>
        </p>

        <p className="mt-4">
          <strong>Office & Visiting Hours</strong>
          <br />
          <span className="text-slate-600">{officeHours}</span>
        </p>
      </div>

      {/* Interactive Contact Inquiry Form */}
      {isSubmitted ? (
        <div className="contact-success bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={24} />
          </div>
          <strong className="text-xl font-serif text-slate-900 block mb-2">
            Thank you for getting in touch.
          </strong>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            Your inquiry has been directly delivered to the {schoolName} administration team. We will review your message and reply within 1–2 business days.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: 'General enquiry',
                message: '',
              })
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors"
          >
            Send another inquiry
          </button>
        </div>
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
