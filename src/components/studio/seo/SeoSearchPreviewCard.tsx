'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SeoConfigData } from './seo.types'

interface SeoSearchPreviewCardProps {
  seo: SeoConfigData
}

export function SeoSearchPreviewCard({ seo }: SeoSearchPreviewCardProps) {
  const [tab, setTab] = useState<'google' | 'social'>('google')

  const displayUrl =
    seo.canonicalUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/northfield-high`
      : 'https://nadib.ashyshop.com/northfield-high')
  const domainHost = displayUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Preview</span>
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('google')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition ${
              tab === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Snippet
          </button>
          <button
            type="button"
            onClick={() => setTab('social')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition ${
              tab === 'social' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Card (OG)
          </button>
        </div>
      </div>

      {tab === 'google' ? (
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1.5 font-sans">
          <div className="flex items-center gap-2 text-xs text-emerald-800">
            {seo.schoolFavicon && (
              <Image
                src={seo.schoolFavicon}
                alt="Favicon"
                width={16}
                height={16}
                unoptimized
                className="w-4 h-4 rounded-full object-cover"
              />
            )}
            <span className="text-[12px] text-slate-700 font-mono truncate">{domainHost}</span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-500 text-[11px]">home</span>
          </div>
          <h3 className="text-base text-blue-700 hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
            {seo.siteTitle || 'School Website Title'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {seo.metaDescription || 'Add a descriptive summary of your school to display in Google search results.'}
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-xs">
          <div className="relative w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
            {seo.ogImageUrl ? (
              <Image
                src={seo.ogImageUrl}
                alt="Social Card Banner"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="text-center p-4 text-white/80 space-y-1">
                <span className="text-3xl block">🏫</span>
                <span className="text-xs font-semibold block">{seo.schoolName || 'SchoolCanvas'}</span>
                <span className="text-[10px] text-slate-400">1200 × 630 OpenGraph Banner</span>
              </div>
            )}
          </div>
          <div className="p-3.5 bg-white border-t border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
              {domainHost.toUpperCase()}
            </span>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
              {seo.siteTitle || 'School Website Title'}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {seo.metaDescription || 'School description appears when shared on social media.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
