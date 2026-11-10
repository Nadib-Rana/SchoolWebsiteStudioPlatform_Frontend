'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'

export function InnerContactSection() {
  const [contactSent, setContactSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <section className="contact-content">
      <div>
        <span className="section-kicker">SCHOOL OFFICE</span>
        <h2>Visit or contact Northfield.</h2>
        <p>
          27 Lakeview Avenue
          <br />
          Dhanmondi, Dhaka 1209
        </p>
        <p>
          <strong>Phone</strong>
          <br />
          +880 2 555 0142
        </p>
        <p>
          <strong>Email</strong>
          <br />
          hello@northfield.edu
        </p>
        <p>
          <strong>Office hours</strong>
          <br />
          Sunday–Thursday · 8:00 AM–4:00 PM
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
            const target = e.currentTarget
            const nameInput = target.elements[0] as HTMLInputElement
            const emailInput = target.elements[1] as HTMLInputElement
            const selectEl = target.elements[2] as HTMLSelectElement
            const messageInput = target.elements[3] as HTMLTextAreaElement

            try {
              await api.publicSite.submitInquiry({
                schoolSlug: 'northfield-high',
                fullName: nameInput?.value || 'Website Visitor',
                email: emailInput?.value || 'visitor@example.com',
                subject: selectEl?.value || 'General inquiry',
                message: messageInput?.value || 'No message provided',
              })
            } catch (err) {
              console.warn('Inquiry submission fallback:', err)
            } finally {
              setIsSubmitting(false)
              setContactSent(true)
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </form>
      )}
    </section>
  )
}
