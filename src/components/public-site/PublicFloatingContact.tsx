'use client'

interface PublicFloatingContactProps {
  schoolName: string
  phone?: string | null
  whatsapp?: string | null
  showWhatsapp?: boolean
  showCall?: boolean
}

function sanitizePhoneDigits(raw?: string | null): string {
  if (!raw) return ''
  return raw.replace(/[^\d]/g, '')
}

function sanitizeWhatsappDigits(raw?: string | null): string {
  if (!raw) return ''
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  // Bangladesh local 11-digit mobile starting with 01 -> prefix international code 88
  if (digits.length === 11 && digits.startsWith('01')) {
    return `88${digits}`
  }
  if (digits.startsWith('008801')) {
    return digits.slice(2)
  }
  return digits
}

export function PublicFloatingContact({
  schoolName,
  phone,
  whatsapp,
  showWhatsapp = true,
  showCall = true,
}: PublicFloatingContactProps) {
  const rawWhatsapp = whatsapp || phone
  const waDigits = showWhatsapp ? sanitizeWhatsappDigits(rawWhatsapp) : ''
  const telValue = showCall && phone ? phone.replace(/[^\d+]/g, '') : ''

  if (!waDigits && !telValue) return null

  const waMessage = encodeURIComponent(
    `Hello ${schoolName}, I would like to inquire about admissions and school information.`,
  )
  const waHref = waDigits ? `https://wa.me/${waDigits}?text=${waMessage}` : ''

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 print:hidden"
      aria-label="Quick Contact Actions"
    >
      {telValue && (
        <a
          href={`tel:${telValue}`}
          title={`Call ${schoolName}`}
          aria-label={`Call ${schoolName}`}
          className="group flex items-center gap-2 rounded-full bg-white text-slate-800 border border-slate-200 shadow-lg hover:shadow-xl px-3.5 py-2.5 transition-all hover:-translate-y-0.5"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: 'var(--navy, #102f58)' }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="hidden sm:inline text-xs font-bold pr-1">
            Call Office
          </span>
        </a>
      )}

      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          title={`WhatsApp ${schoolName}`}
          aria-label={`Chat on WhatsApp with ${schoolName}`}
          className="group flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg shadow-emerald-900/20 hover:shadow-xl px-4 py-2.5 transition-all hover:-translate-y-0.5"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L0 24l6.33-1.66a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42zM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.84 9.84 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.91-9.89 2.65 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.9 7c0 5.46-4.44 9.89-9.89 9.89zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          </svg>
          <span className="text-xs font-bold">WhatsApp</span>
        </a>
      )}
    </div>
  )
}

