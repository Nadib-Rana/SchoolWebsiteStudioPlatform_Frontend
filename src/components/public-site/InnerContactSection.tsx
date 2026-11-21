'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { PublicSiteData } from '@/lib/public-site'

interface InnerContactSectionProps {
  siteData?: PublicSiteData | null
}

export function InnerContactSection({ siteData }: InnerContactSectionProps) {
  const [contactSent, setContactSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const schoolName = siteData?.school?.name || 'Our School'
  const schoolSlug = siteData?.school?.slug || api.getActiveSchoolSlug()
  const address = siteData?.profile?.address || 'Campus Main Road'
  const phone = siteData?.profile?.phone || 'Contact office for phone'
  const email = siteData?.profile?.email || 'admissions@school.edu'
  const officeHours =
    siteData?.profile?.officeHours || 'Sunday–Thursday · 8:00 AM–4:00 PM'

  return (
    <section className="contact-content">
      <div>
        <span className="section-kicker">SCHOOL OFFICE</span>
        <h2>Visit or contact {schoolName}.</h2>
        <p>{address}</p>
        <p>
          <strong>Phone</strong>
          <br />
          {phone}
        </p>
        <p>
          <strong>Email</strong>
          <br />
          {email}
        </p>
        <p>
          <strong>Office hours</strong>
          <br />
          {officeHours}
        </p>
      </div>
      {contactSent ? (
        <div className="contact-success">
          <span>
            <Icon name="check" />
          </span>
          <strong>Thank you for getting in touch.</strong>
          <p>
            Your message has been received. The school office will respond
            within two working days.
          </p>
          <button type="button" onClick={() => setContactSent(false)}>
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setIsSubmitting(true)
            setSubmitError(null)
            const target = e.currentTarget
            const nameInput = target.elements[0] as HTMLInputElement
            const emailInput = target.elements[1] as HTMLInputElement
            const selectEl = target.elements[2] as HTMLSelectElement
            const messageInput = target.elements[3] as HTMLTextAreaElement

            try {
              await api.publicSite.submitInquiry({
                schoolSlug,
                fullName: nameInput?.value || 'Website Visitor',
                email: emailInput?.value || 'visitor@example.com',
                subject: selectEl?.value || 'General inquiry',
                message: messageInput?.value || 'No message provided',
              })
              setContactSent(true)
            } catch (err: unknown) {
              setSubmitError(
                err instanceof Error
                  ? err.message
                  : 'Unable to send your message right now. Please try again.',
              )
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <label>
            Your name
            <input required placeholder="Full name" />
          </label>
          <label>
            Email address
            <input required type="email" placeholder="name@example.com" />
          </label>
          <label>
            How can we help?
            <select defaultValue="General enquiry">
              <option>General enquiry</option>
              <option>Admissions</option>
            </select>
          </label>
          <label>
            Message
            <textarea required placeholder="Write your message" />
          </label>
          {submitError && (
            <p style={{ color: '#b91c1c', fontSize: '13px', margin: 0 }}>
              {submitError}
            </p>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </form>
      )}
    </section>
  )
}
