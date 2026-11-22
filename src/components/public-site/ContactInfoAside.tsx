'use client'

import type { SchoolProfileData } from '@/lib/public-site'

interface ContactInfoAsideProps {
  schoolSlug?: string
  schoolName: string
  profile?: SchoolProfileData
  allowAdmissions?: boolean
}

function formatWhatsappUrl(raw?: string | null, schoolName?: string): string {
  if (!raw) return ''
  let digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  if (digits.length === 11 && digits.startsWith('01')) {
    digits = `88${digits}`
  } else if (digits.startsWith('008801')) {
    digits = digits.slice(2)
  }
  const msg = encodeURIComponent(
    `Hello ${schoolName || 'School Office'}, I have a question regarding admissions and school information.`,
  )
  return `https://wa.me/${digits}?text=${msg}`
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
    profile?.officeHours || 'Sunday – Thursday · 8:00 AM – 4:00 PM'
  const whatsappRaw = profile?.socialLinks?.whatsapp || phone
  const waUrl = formatWhatsappUrl(whatsappRaw, schoolName)
  const cleanTel = phone.replace(/[^0-9+]/g, '')
  const mapQuery = encodeURIComponent(`${schoolName}, ${address}`)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <div className="space-y-6">
      {/* Editorial Intro */}
      <div>
        <span className="section-kicker">SCHOOL OFFICE & CAMPUS</span>
        <h2
          className="text-3xl sm:text-4xl font-normal text-slate-900 mt-2 mb-3 leading-tight"
          style={{
            fontFamily: "var(--font-heading, 'DM Serif Display', serif)",
            color: 'var(--navy, #102f58)',
          }}
        >
          Visit or contact {schoolName}.
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Connect directly with our administrative reception, admissions desk, or plan a visit to our campus during working hours.
        </p>
      </div>

      {/* 4 Interactive Contact Cards (Address, Phone, Email, Office Hours) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
        {/* 1. Address Card */}
        <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Campus Address
              </span>
              <a
                href={mapExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--navy, #102f58)' }}
                className="text-xs font-bold hover:underline shrink-0"
              >
                Get Directions ↗
              </a>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-1 whitespace-pre-line leading-snug">
              {address}
            </p>
          </div>
        </div>

        {/* 2. Phone Card */}
        <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Phone & Reception
              </span>
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={`tel:${cleanTel}`}
                  style={{ color: 'var(--navy, #102f58)' }}
                  className="text-xs font-bold hover:underline"
                >
                  Call Now ↗
                </a>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    WhatsApp ↗
                  </a>
                )}
              </div>
            </div>
            <a
              href={`tel:${cleanTel}`}
              className="text-sm font-bold text-slate-900 hover:underline block mt-1"
            >
              {phone}
            </a>
            {profile?.emergencyPhone && (
              <span className="block text-xs font-medium text-rose-700 mt-0.5">
                Emergency Hotline: {profile.emergencyPhone}
              </span>
            )}
          </div>
        </div>

        {/* 3. Email Card */}
        <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Email
              </span>
              <a
                href={`mailto:${email}`}
                style={{ color: 'var(--navy, #102f58)' }}
                className="text-xs font-bold hover:underline shrink-0"
              >
                Send Email ↗
              </a>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-sm font-bold text-slate-900 hover:underline block mt-1 break-all"
            >
              {email}
            </a>
          </div>
        </div>

        {/* 4. Office Hours Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-start gap-4">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Office & Visiting Hours
              </span>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100"
                style={{ color: 'var(--navy, #102f58)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--navy, #102f58)' }}
                />
                Campus Open
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              {officeHours}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Campus Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60">
          <div className="min-w-0">
            <strong className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Campus Location Map
            </strong>
            <span className="text-xs text-slate-500 truncate block">
              {address}
            </span>
          </div>
          <a
            href={mapExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--navy, #102f58)' }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 shadow-2xs"
          >
            Open Maps ↗
          </a>
        </div>
        <div className="w-full h-56 bg-slate-100">
          <iframe
            title={`Campus Map for ${schoolName}`}
            src={mapEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
