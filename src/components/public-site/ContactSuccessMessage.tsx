'use client'

import { Icon } from '@/components/common/Icon'

interface ContactSuccessMessageProps {
  schoolName: string
  onReset: () => void
}

export function ContactSuccessMessage({
  schoolName,
  onReset,
}: ContactSuccessMessageProps) {
  return (
    <div className="bg-white border border-emerald-200 p-10 sm:p-12 rounded-3xl shadow-lg text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
        <Icon name="check" size={30} />
      </div>
      <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
        Inquiry Received
      </span>
      <strong
        className="text-2xl sm:text-3xl font-bold text-slate-900 block mb-3"
        style={{ fontFamily: 'var(--font-heading, serif)' }}
      >
        Thank you for reaching out!
      </strong>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
        Your message has been delivered directly to the{' '}
        <span className="font-semibold text-slate-800">{schoolName}</span>{' '}
        administration desk. Our team will review your inquiry and respond within 1–2 business days.
      </p>
      <button
        type="button"
        onClick={onReset}
        style={{ background: 'var(--navy, #102f58)' }}
        className="px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-md cursor-pointer"
      >
        Send Another Inquiry
      </button>
    </div>
  )
}
