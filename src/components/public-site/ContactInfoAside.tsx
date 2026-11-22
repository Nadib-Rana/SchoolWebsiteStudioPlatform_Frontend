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
  const mapQuery = encodeURIComponent(`${schoolName}, ${address}`)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
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
        We welcome inquiries from prospective parents, current families, and visitors. Reach our administrative office directly or send a message using the form.
      </p>

      {/* Clean Editorial Directory List (No boxy cards) */}
      <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200 text-sm">
        <div className="py-4 flex items-start justify-between gap-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Address
            </dt>
            <dd className="text-slate-800 font-medium mt-1 whitespace-pre-line leading-relaxed">
              {address}
            </dd>
          </div>
          <a
            href={mapExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-800 hover:underline shrink-0 mt-1"
          >
            Directions ↗
          </a>
        </div>

        <div className="py-4 flex items-start justify-between gap-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Telephone & Reception
            </dt>
            <dd className="mt-1">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="text-slate-900 font-semibold hover:text-blue-800 hover:underline"
              >
                {phone}
              </a>
              {profile?.emergencyPhone && (
                <span className="block text-xs text-rose-700 mt-0.5">
                  Emergency: {profile.emergencyPhone}
                </span>
              )}
            </dd>
          </div>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:underline shrink-0 mt-1"
            >
              WhatsApp ↗
            </a>
          )}
        </div>

        <div className="py-4">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Email
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${email}`}
              className="text-slate-900 font-semibold hover:text-blue-800 hover:underline break-all"
            >
              {email}
            </a>
          </dd>
        </div>

        <div className="py-4">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Office & Visiting Hours
          </dt>
          <dd className="text-slate-700 font-medium mt-1">{officeHours}</dd>
        </div>
      </dl>

      {/* Clean Integrated Map Preview */}
      <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48">
        <iframe
          title={`Campus Map for ${schoolName}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
