'use client'

import Link from 'next/link'
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
    `Hello ${schoolName || 'School Office'}, I have a question regarding admissions and campus information.`,
  )
  return `https://wa.me/${digits}?text=${msg}`
}

export function ContactInfoAside({
  schoolSlug,
  schoolName,
  profile,
  allowAdmissions = true,
}: ContactInfoAsideProps) {
  const address =
    profile?.address || '27 Lakeview Avenue, Riverdale, NY 10471'
  const phone = profile?.phone || '+1 (555) 234-5678'
  const email = profile?.email || 'admissions@northfieldhigh.edu'
  const officeHours =
    profile?.officeHours || 'Sunday – Thursday · 8:00 AM – 4:00 PM'
  const whatsappRaw = profile?.socialLinks?.whatsapp || phone
  const waUrl = formatWhatsappUrl(whatsappRaw, schoolName)
  const mapQuery = encodeURIComponent(`${schoolName}, ${address}`)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <div className="flex flex-col gap-6">
      {/* Branded Institutional Campus Card */}
      <div
        className="rounded-3xl p-7 sm:p-8 text-white shadow-xl relative overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, var(--navy, #102f58) 0%, #0b1e3b 100%)',
        }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
          style={{
            background: 'rgba(227, 173, 63, 0.18)',
            color: 'var(--accent, #e3ad3f)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--accent, #e3ad3f)' }}
          />
          Campus & Administration
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2"
          style={{ fontFamily: 'var(--font-heading, serif)' }}
        >
          Visit {schoolName}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Our campus welcome desk and admissions counselors are happy to guide parents and prospective students in person or over the phone.
        </p>

        <div className="space-y-4 border-t border-white/10 pt-5 text-sm">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Campus Location
              </span>
              <p className="text-white font-medium mt-0.5 leading-snug whitespace-pre-line">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Direct Reception & Helpline
              </span>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="text-white hover:text-amber-300 font-semibold mt-0.5 inline-block transition-colors"
              >
                {phone}
              </a>
              {profile?.emergencyPhone && (
                <span className="block text-xs text-rose-300 mt-0.5">
                  Emergency: {profile.emergencyPhone}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Official Email Desk
              </span>
              <a
                href={`mailto:${email}`}
                className="text-white hover:text-amber-300 font-semibold mt-0.5 inline-block break-all transition-colors"
              >
                {email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Office & Visiting Hours
              </span>
              <p className="text-white font-medium mt-0.5">{officeHours}</p>
            </div>
          </div>
        </div>

        {/* Instant Action Buttons */}
        <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-2.5">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs px-4 py-3 shadow-md transition-all"
            >
              <span>Chat on WhatsApp</span>
            </a>
          )}
          {allowAdmissions && schoolSlug && (
            <Link
              href={`/${schoolSlug}/admissions`}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs px-4 py-3 transition-all"
            >
              <span>Apply for Admission →</span>
            </Link>
          )}
        </div>
      </div>

      {/* Interactive Campus Map Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <strong className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Interactive Campus Map
            </strong>
            <span className="text-[11px] text-slate-500">
              Directions to {schoolName}
            </span>
          </div>
          <a
            href={mapExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Open Maps ↗
          </a>
        </div>
        <div className="w-full h-56 bg-slate-100 relative">
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
