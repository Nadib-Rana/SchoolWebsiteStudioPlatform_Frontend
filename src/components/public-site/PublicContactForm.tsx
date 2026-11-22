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

interface FieldErrors {
  fullName?: string
  email?: string
  phone?: string
  message?: string
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const officialEmail = profile?.email || 'admissions@northfieldhigh.edu'
  const officialPhone = profile?.phone || '+1 (555) 234-5678'
  const address =
    profile?.address || '27 Lakeview Avenue, Riverdale, NY 10471'
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${schoolName}, ${address}`)}`

  const validateForm = (): boolean => {
    const errors: FieldErrors = {}
    const nameTrimmed = formData.fullName.trim()
    const emailTrimmed = formData.email.trim()
    const phoneTrimmed = formData.phone.trim()
    const msgTrimmed = formData.message.trim()

    if (nameTrimmed.length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (phoneTrimmed && !/^[0-9+\-\s()]{7,20}$/.test(phoneTrimmed)) {
      errors.phone = 'Please enter a valid phone number.'
    }
    if (msgTrimmed.length < 10) {
      errors.message = 'Please enter a detailed message (at least 10 characters).'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildMailtoLink = () => {
    const subjectLine = encodeURIComponent(
      `[${formData.subject}] Inquiry from ${formData.fullName.trim()} — ${schoolName}`,
    )
    const bodyLines = [
      `Dear ${schoolName} Administration,`,
      '',
      formData.message.trim(),
      '',
      '----------------------------------------',
      `Sender Name: ${formData.fullName.trim()}`,
      `Email: ${formData.email.trim()}`,
      ...(formData.phone.trim() ? [`Phone: ${formData.phone.trim()}`] : []),
      `Subject: ${formData.subject}`,
    ]
    const bodyEncoded = encodeURIComponent(bodyLines.join('\n'))
    return `mailto:${officialEmail}?subject=${subjectLine}&body=${bodyEncoded}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    const mailtoUrl = buildMailtoLink()
    setLastMailtoUrl(mailtoUrl)

    try {
      await api.publicSite.submitInquiry({
        schoolSlug,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim(),
      })
    } catch {
      // Best-effort database save; still open user's email app with pre-filled details
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
      if (typeof window !== 'undefined') {
        window.location.href = mailtoUrl
      }
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFieldErrors({})
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Interactive Contact Cards & Campus Map Card */}
        <div className="lg:col-span-5">
          <ContactInfoAside
            schoolSlug={schoolSlug}
            schoolName={schoolName}
            profile={profile}
            allowAdmissions={allowAdmissions}
          />
        </div>

        {/* Right Column: Responsive Validated Inquiry Form */}
        <div className="lg:col-span-7">
          {isSubmitted ? (
            <ContactSuccessMessage
              schoolName={schoolName}
              mailtoUrl={lastMailtoUrl}
              onReset={handleReset}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
              {/* Top Theme Primary & Accent Bar */}
              <div
                className="h-2 w-full"
                style={{
                  background:
                    'linear-gradient(90deg, var(--navy, #102f58) 0%, var(--accent, #e3ad3f) 100%)',
                }}
              />

              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-6 sm:p-9 lg:p-10"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
                  <div>
                    <span className="section-kicker">ONLINE INQUIRY FORM</span>
                    <h3
                      className="text-2xl sm:text-3xl font-normal text-slate-900 mt-1"
                      style={{
                        fontFamily:
                          "var(--font-heading, 'DM Serif Display', serif)",
                        color: 'var(--navy, #102f58)',
                      }}
                    >
                      Send us a message.
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Fill in your details below — submitting saves your inquiry and opens your email client pre-filled.
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold"
                    style={{ color: 'var(--navy, #102f58)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--navy, #102f58)' }}
                    />
                    1–2 Day Response
                  </span>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                    >
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="contact-full-name"
                      required
                      type="text"
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      placeholder="e.g. Kamal Rahman"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        if (fieldErrors.fullName) {
                          setFieldErrors({ ...fieldErrors, fullName: undefined })
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.fullName
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-teal-700 focus:ring-teal-600/30'
                      }`}
                    />
                    {fieldErrors.fullName && (
                      <p
                        role="alert"
                        className="text-xs text-rose-600 font-medium mt-1"
                      >
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      placeholder="e.g. 01711-000000"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        if (fieldErrors.phone) {
                          setFieldErrors({ ...fieldErrors, phone: undefined })
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.phone
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-teal-700 focus:ring-teal-600/30'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p
                        role="alert"
                        className="text-xs text-rose-600 font-medium mt-1"
                      >
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                    >
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (fieldErrors.email) {
                          setFieldErrors({ ...fieldErrors, email: undefined })
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.email
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-teal-700 focus:ring-teal-600/30'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p
                        role="alert"
                        className="text-xs text-rose-600 font-medium mt-1"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                    >
                      Department / Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/40 focus:bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-600/30 transition-all"
                    >
                      {INQUIRY_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                  >
                    Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    aria-invalid={Boolean(fieldErrors.message)}
                    placeholder="Write your question about admissions, campus tour scheduling, academic programs, or general inquiries..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (fieldErrors.message) {
                        setFieldErrors({ ...fieldErrors, message: undefined })
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y ${
                      fieldErrors.message
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-300 focus:border-teal-700 focus:ring-teal-600/30'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p
                      role="alert"
                      className="text-xs text-rose-600 font-medium mt-1"
                    >
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: 'var(--navy, #102f58)' }}
                  className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm tracking-wide hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Preparing & Sending...' : 'Send Message & Open Email'}{' '}
                  <Icon name="arrow" size={14} />
                </button>

                {/* Privacy Note & Structured Form Footer */}
                <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <p className="flex items-start sm:items-center gap-2 leading-relaxed">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--navy, #102f58)' }}
                      className="shrink-0 mt-0.5 sm:mt-0"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>
                      <strong>Privacy Note:</strong> Your details are kept confidential and used only by {schoolName} to respond to your inquiry.
                    </span>
                  </p>
                  <div
                    className="flex items-center gap-3 shrink-0 font-semibold"
                    style={{ color: 'var(--navy, #102f58)' }}
                  >
                    <a
                      href={`tel:${officialPhone.replace(/[^0-9+]/g, '')}`}
                      className="hover:underline"
                    >
                      Call
                    </a>
                    <span>·</span>
                    <a href={`mailto:${officialEmail}`} className="hover:underline">
                      Email
                    </a>
                    <span>·</span>
                    <a
                      href={mapExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
