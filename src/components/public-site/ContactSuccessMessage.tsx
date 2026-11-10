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
    <div className="contact-success bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
        <Icon name="check" size={24} />
      </div>
      <strong className="text-xl font-serif text-slate-900 block mb-2">
        Thank you for getting in touch.
      </strong>
      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
        Your inquiry has been directly delivered to the {schoolName} administration team. We will review your message and reply within 1–2 business days.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors"
      >
        Send another inquiry
      </button>
    </div>
  )
}
