'use client'

import { Icon } from '@/components/common/Icon'

interface ContactSuccessMessageProps {
  schoolName: string
  mailtoUrl?: string
  onReset: () => void
}

export function ContactSuccessMessage({
  schoolName,
  mailtoUrl,
  onReset,
}: ContactSuccessMessageProps) {
  return (
    <div className="bg-white border border-teal-200 p-10 sm:p-12 rounded-2xl shadow-md text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-5 shadow-2xs">
        <Icon name="check" size={30} />
      </div>
      <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full mb-2">
        Inquiry Prepared & Logged
      </span>
      <strong
        className="text-2xl sm:text-3xl font-normal text-slate-900 block mb-3"
        style={{ fontFamily: "var(--font-heading, 'DM Serif Display', serif)" }}
      >
        Thank you for reaching out!
      </strong>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed mb-7">
        Your inquiry has been recorded for{' '}
        <span className="font-semibold text-slate-800">{schoolName}</span> and your email app has been opened with your pre-filled message.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {mailtoUrl && (
          <a
            href={mailtoUrl}
            style={{
              background:
                'linear-gradient(135deg, var(--navy, #0b2545) 0%, #0d6e6e 100%)',
            }}
            className="px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-sm"
          >
            Open Email App Again ↗
          </a>
        )}
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Send Another Inquiry
        </button>
      </div>
    </div>
  )
}
