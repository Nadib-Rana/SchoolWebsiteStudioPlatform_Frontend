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
  allowAdmissions?: boolean
}

const INQUIRY_TOPICS = [
  'General enquiry',
  'Admissions & Enrollment',
  'Campus Tour Request',
  'Academic Programs',
  'Fees & Scholarships',
  'Parent Association',
]

export function PublicContactForm({
  schoolSlug,
  schoolName,
  profile,
  allowAdmissions = true,
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

  const address =
    profile?.address || '27 Lakeview Avenue, Riverdale, NY 10471'
  const phone = profile?.phone || '+1 (555) 234-5678'
  const email = profile?.email || 'admissions@northfieldhigh.edu'
  const officeHours =
    profile?.officeHours || 'Sunday – Thursday · 8:00 AM – 4:00 PM'

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Quick-Connect Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <a
          href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-4"
        >
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Call Office
            </span>
            <strong className="text-sm font-bold text-slate-900 group-hover:text-blue-800 block mt-0.5 truncate">
              {phone}
            </strong>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Direct phone support
            </span>
          </div>
        </a>

        <a
          href={`mailto:${email}`}
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-4"
        >
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Email Us
            </span>
            <strong className="text-sm font-bold text-slate-900 group-hover:text-blue-800 block mt-0.5 truncate">
              {email}
            </strong>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Official admissions & info
            </span>
          </div>
        </a>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Office Hours
            </span>
            <strong className="text-sm font-bold text-slate-900 block mt-0.5 truncate">
              {officeHours}
            </strong>
            <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
              ● Open for inquiries
            </span>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${schoolName}, ${address}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-4"
        >
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Campus Location
            </span>
            <strong className="text-sm font-bold text-slate-900 group-hover:text-blue-800 block mt-0.5 truncate">
              {address}
            </strong>
            <span className="text-xs text-blue-700 font-semibold mt-0.5 block">
              Get Google Maps directions ↗
            </span>
          </div>
        </a>
      </div>

      {/* Main Split Grid: Left Campus & Map Aside + Right Interactive Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <ContactInfoAside
            schoolSlug={schoolSlug}
            schoolName={schoolName}
            profile={profile}
            allowAdmissions={allowAdmissions}
          />
        </div>

        <div className="lg:col-span-7">
          {isSubmitted ? (
            <ContactSuccessMessage schoolName={schoolName} onReset={handleReset} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 block">
                    DIRECT MESSAGE DESK
                  </span>
                  <h3
                    className="text-2xl font-bold text-slate-900 mt-1"
                    style={{ fontFamily: 'var(--font-heading, serif)' }}
                  >
                    Send Us an Inquiry
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Replies within 1 business day
                </span>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Quick Topic Pills */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
                  What can we help you with?
                </span>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TOPICS.map((topic) => {
                    const active = formData.subject === topic
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setFormData({ ...formData, subject: topic })}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        style={
                          active
                            ? {
                                background: 'var(--navy, #102f58)',
                                borderColor: 'var(--navy, #102f58)',
                              }
                            : undefined
                        }
                      >
                        {topic}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Your Full Name *
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Kamal Rahman"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Phone / Mobile Number
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. 01711-000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Department / Subject
                  </span>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                  >
                    {INQUIRY_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Your Message or Question *
                </span>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your question about admissions, campus tour scheduling, fees, or academic programs..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all resize-y"
                />
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Strictly confidential school communication
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: 'var(--navy, #102f58)' }}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}{' '}
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
