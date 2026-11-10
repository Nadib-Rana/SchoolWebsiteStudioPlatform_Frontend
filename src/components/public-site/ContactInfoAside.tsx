'use client'

import type { SchoolProfileData } from '@/lib/public-site'

interface ContactInfoAsideProps {
  schoolName: string
  profile?: SchoolProfileData
}

export function ContactInfoAside({
  schoolName,
  profile,
}: ContactInfoAsideProps) {
  const address =
    profile?.address || '27 Lakeview Avenue, Riverdale, NY 10471'
  const phone = profile?.phone || '+1 (555) 234-5678'
  const email = profile?.email || 'admissions@northfieldhigh.edu'
  const officeHours =
    profile?.officeHours || 'Monday – Friday · 8:00 AM – 4:30 PM'

  return (
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
  )
}
