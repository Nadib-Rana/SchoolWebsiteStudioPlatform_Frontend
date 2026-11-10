'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'
import type { SeoConfigData } from './seo.types'

interface SeoFormTabProps {
  seo: SeoConfigData
  onChange: (updates: Partial<SeoConfigData>) => void
  onSave: () => Promise<void>
  isSaving: boolean
}

export function SeoFormTab({ seo, onChange, onSave, isSaving }: SeoFormTabProps) {
  const [keywordInput, setKeywordInput] = useState('')

  const handleAddKeyword = () => {
    const val = keywordInput.trim()
    if (!val || seo.metaKeywords.includes(val)) return
    onChange({ metaKeywords: [...seo.metaKeywords, val] })
    setKeywordInput('')
  }

  const handleRemoveKeyword = (index: number) => {
    onChange({ metaKeywords: seo.metaKeywords.filter((_, i) => i !== index) })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Search Engine & Social Metadata</h3>
          <p className="text-xs text-slate-500">Configure homepage tags, social card images, and analytics.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
        >
          {isSaving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <div className="flex justify-between mb-1">
            <label className="font-bold text-slate-700">Page Meta Title</label>
            <span className="text-slate-400 font-mono">{seo.siteTitle.length}/60 chars</span>
          </div>
          <input
            type="text"
            value={seo.siteTitle}
            onChange={(e) => onChange({ siteTitle: e.target.value })}
            placeholder="e.g. Northfield High School | Inspiring Excellence"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">School Tagline</label>
          <input
            type="text"
            value={seo.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="e.g. Inspiring Excellence in Education Since 1984"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="font-bold text-slate-700">Meta Description</label>
            <span className="text-slate-400 font-mono">{seo.metaDescription.length}/160 chars</span>
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => onChange({ metaDescription: e.target.value })}
            placeholder="Provide a compelling 1-2 sentence overview of your school..."
            className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Social OpenGraph Card Image (1200×630)</label>
          <div className="space-y-2">
            <input
              type="text"
              value={seo.ogImageUrl}
              onChange={(e) => onChange({ ogImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/... or upload banner"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <ImageUploadControl
              value={seo.ogImageUrl}
              onChange={(url) => onChange({ ogImageUrl: url || '' })}
              label="Select or upload OpenGraph social image"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Target Keywords</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword() } }}
              placeholder="Add keyword (e.g. AP Program, Secondary School)..."
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seo.metaKeywords.map((kw, i) => (
              <span key={kw + i} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                {kw}
                <button type="button" onClick={() => handleRemoveKeyword(i)} className="text-slate-400 hover:text-slate-600">
                  <Icon name="close" size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Google Analytics ID</label>
            <input
              type="text"
              value={seo.googleAnalyticsId}
              onChange={(e) => onChange({ googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Search Console Tag</label>
            <input
              type="text"
              value={seo.searchConsoleTag}
              onChange={(e) => onChange({ searchConsoleTag: e.target.value })}
              placeholder="google-site-verification=..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
