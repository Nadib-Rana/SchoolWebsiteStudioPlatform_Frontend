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
    <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Editorial Column: Address, Direct Contacts & Map */}
        <div className="lg:col-span-5">
          <ContactInfoAside
            schoolSlug={schoolSlug}
            schoolName={schoolName}
            profile={profile}
            allowAdmissions={allowAdmissions}
          />
        </div>

        {/* Right Column: Single Clean Inquiry Form */}
        <div className="lg:col-span-7">
          {isSubmitted ? (
            <ContactSuccessMessage schoolName={schoolName} onReset={handleReset} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm"
            >
              <div className="mb-7">
                <span className="section-kicker">INQUIRY FORM</span>
                <h3
                  className="text-2xl sm:text-3xl font-normal text-slate-900 mt-1"
                  style={{
                    fontFamily: "var(--font-heading, 'DM Serif Display', serif)",
                    color: 'var(--navy, #102f58)',
                  }}
                >
                  Send us a message.
                </h3>
                <p className="text-sm text-slate-500 mt-1.5">
                  Complete the form below and our office will respond within 1–2 working days.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Full Name *
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. 01711-000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Subject / Purpose
                  </span>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
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
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Message *
                </span>
                <textarea
                  required
                  rows={5}
                  placeholder="How can our school team help you?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors resize-y"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ background: 'var(--navy, #102f58)' }}
                className="w-full py-3.5 px-6 rounded-lg text-white font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}{' '}
                <Icon name="arrow" size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
