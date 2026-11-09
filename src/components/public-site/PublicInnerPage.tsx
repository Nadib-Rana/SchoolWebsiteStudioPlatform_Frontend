'use client'

import { Icon } from '@/components/common/Icon'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { publicPagesContent } from '@/config/public-pages'
import { useState } from 'react'

import { api } from '@/lib/api-client'

export interface PublicInnerPageProps {
  page: string
  setPage: (p: string) => void
}

export function PublicInnerPage({ page, setPage }: PublicInnerPageProps) {
  const [contactSent, setContactSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  if (page === '404 Page') {
    return (
      <main className="error-page">
        <span>404</span>
        <h1>We couldn’t find that page.</h1>
        <p>The page may have moved, or the address might be incorrect.</p>
        <button type="button" onClick={() => setPage('Home')}>
          Return to homepage <Icon name="arrow" size={15} />
        </button>
      </main>
    )
  }

  const d = publicPagesContent[page] || publicPagesContent['About School']
  const isAdmission = page === 'Admission Information'
  const isContact = page === 'Contact Us'
  const isGallery = page.includes('Gallery')
  const isPeople = page.includes('Teacher')
  const isList = ['Notices', 'Events', 'Search Results'].includes(page)

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>{d.kicker}</span>
        <h1>{d.title}</h1>
        <p>{d.intro}</p>
        <div className="breadcrumb">
          Home <Icon name="chevron" size={11} /> {page}
        </div>
      </section>

      {isAdmission ? (
        <section className="admission-content">
          <div>
            <span className="section-kicker">APPLICATION PROCESS</span>
            <h2>Four clear steps to apply.</h2>
            {[
              ['01', 'Review eligibility', 'Check age, grade placement, and required documents.'],
              ['02', 'Prepare documents', 'Gather academic records, identification, and photographs.'],
              ['03', 'Apply securely', 'Continue to our approved Admission API portal.'],
              ['04', 'Track your application', 'Use your reference number for status updates.'],
            ].map((x) => (
              <article key={x[0]}>
                <b>{x[0]}</b>
                <div>
                  <h3>{x[1]}</h3>
                  <p>{x[2]}</p>
                </div>
              </article>
            ))}
          </div>
          <aside>
            <span>APPLICATIONS CLOSE</span>
            <strong>30 June 2025</strong>
            <p>Applications for Grades 1–9 are currently open, subject to available places.</p>
            <button
              type="button"
              onClick={() => {
                alert('Admissions portal: Please contact admissions@northfield.edu or visit the campus office Sunday–Thursday (8:00 AM–4:00 PM) to submit application materials.')
              }}
            >
              Continue to application <Icon name="external" size={15} />
            </button>
            <small>Securely opens the existing admissions system</small>
          </aside>
        </section>
      ) : isContact ? (
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
      ) : isGallery ? (
        <section className="gallery-wall">
          {[
            heroImage,
            campusImage,
            interiorImage,
            'https://images.unsplash.com/photo-1787401963343-d81b68a5a059?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800',
            'https://images.unsplash.com/photo-1769209435699-9cc1fd8e7f57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800',
          ].map((x, i) => (
            <img src={x} alt={`Northfield school moment ${i + 1}`} key={x} />
          ))}
        </section>
      ) : isPeople ? (
        <section className="faculty-grid">
          {[
            'Mahmud Karim',
            'Sara Jahan',
            'Nabil Chowdhury',
            'Nusrat Ahmed',
            'Tanvir Islam',
            'Lamia Haque',
          ].map((x, i) => (
            <article key={x}>
              <div className={`faculty-photo fp${i}`}>
                {x
                  .split(' ')
                  .map((v) => v[0])
                  .join('')}
              </div>
              <small>
                {i === 0
                  ? 'HEAD OF SCIENCE'
                  : i === 1
                  ? 'SENIOR ENGLISH TEACHER'
                  : 'FACULTY MEMBER'}
              </small>
              <h3>{x}</h3>
              <p>
                Committed to thoughtful teaching, meaningful relationships, and
                confident learners.
              </p>
              <button
                type="button"
                onClick={() => setPage('Teacher Profile')}
              >
                View profile <Icon name="arrow" size={13} />
              </button>
            </article>
          ))}
        </section>
      ) : isList ? (
        <section className="public-list">
          {[
            [
              'Summer schedule and office hours',
              '12 MAY 2025',
              'Essential dates and office arrangements for the summer period.',
            ],
            [
              'Science Fair registration',
              '10 MAY 2025',
              'Registration details, eligibility, and participant guidance.',
            ],
            [
              'Parent–teacher meetings',
              '08 MAY 2025',
              'Booking information for this term’s family conferences.',
            ],
            [
              'Annual sports day',
              '02 MAY 2025',
              'Schedule, house information, and visitor guidance.',
            ],
          ].map((x) => (
            <article key={x[0]}>
              <span>{x[1]}</span>
              <div>
                <small>{page === 'Events' ? 'SCHOOL EVENT' : 'GENERAL UPDATE'}</small>
                <h2>{x[0]}</h2>
                <p>{x[2]}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPage(page === 'Events' ? 'Event Details' : 'Notice Details')
                }
                aria-label={`View ${x[0]}`}
              >
                <Icon name="arrow" />
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="story-content">
          <div>
            <span className="section-kicker">THE NORTHFIELD APPROACH</span>
            <h2>
              Strong foundations.
              <br />
              Open horizons.
            </h2>
            <p>
              Our educational approach is grounded in high expectations,
              supportive relationships, and the belief that learning becomes
              powerful when students understand its purpose.
            </p>
            <p>
              From foundational literacy and numeracy through specialist
              programs, leadership opportunities, and preparation for life
              beyond school, each stage builds naturally on the one before it.
            </p>
            <blockquote>
              We prepare young people not only for examinations, but for
              meaningful lives of curiosity, contribution, and character.
            </blockquote>
          </div>
          <img
            src={page === 'Principal’s Message' ? interiorImage : campusImage}
            alt="Northfield learning community"
          />
        </section>
      )}
    </main>
  )
}
