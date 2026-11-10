'use client'

import { Icon } from '@/components/common/Icon'
import type { SeoConfigData, SeoAuditCheck } from './seo.types'

interface SeoAuditScoreCardProps {
  seo: SeoConfigData
}

export function SeoAuditScoreCard({ seo }: SeoAuditScoreCardProps) {
  const checks: SeoAuditCheck[] = [
    {
      id: 'title',
      label: 'Page Title Optimization',
      status: seo.siteTitle.length >= 35 && seo.siteTitle.length <= 65 ? 'passed' : seo.siteTitle.length > 0 ? 'warning' : 'failed',
      score: seo.siteTitle.length >= 35 && seo.siteTitle.length <= 65 ? 25 : seo.siteTitle.length > 0 ? 15 : 0,
      maxScore: 25,
      tip: `${seo.siteTitle.length}/60 chars (optimal: 35-65)`,
    },
    {
      id: 'desc',
      label: 'Meta Description Length',
      status: seo.metaDescription.length >= 90 && seo.metaDescription.length <= 165 ? 'passed' : seo.metaDescription.length > 20 ? 'warning' : 'failed',
      score: seo.metaDescription.length >= 90 && seo.metaDescription.length <= 165 ? 25 : seo.metaDescription.length > 20 ? 15 : 0,
      maxScore: 25,
      tip: `${seo.metaDescription.length}/160 chars (optimal: 90-165)`,
    },
    {
      id: 'og',
      label: 'Social OpenGraph Image',
      status: seo.ogImageUrl ? 'passed' : 'warning',
      score: seo.ogImageUrl ? 20 : 0,
      maxScore: 20,
      tip: seo.ogImageUrl ? 'Social preview image set' : 'Add custom 1200x630 banner',
    },
    {
      id: 'keywords',
      label: 'Search Target Keywords',
      status: seo.metaKeywords.length >= 3 ? 'passed' : seo.metaKeywords.length >= 1 ? 'warning' : 'failed',
      score: seo.metaKeywords.length >= 3 ? 15 : seo.metaKeywords.length >= 1 ? 8 : 0,
      maxScore: 15,
      tip: `${seo.metaKeywords.length} keywords indexed`,
    },
    {
      id: 'technical',
      label: 'Sitemap & Crawler Indexing',
      status: seo.sitemapEnabled && seo.isIndexed ? 'passed' : 'warning',
      score: seo.sitemapEnabled && seo.isIndexed ? 15 : 8,
      maxScore: 15,
      tip: seo.sitemapEnabled ? 'XML sitemap generator active' : 'Enable sitemap for crawlers',
    },
  ]

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0)
  const scoreBadgeColor =
    totalScore >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : totalScore >= 65
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">SEO Health Audit</h4>
          <p className="text-xs text-slate-500">Automated search optimization score for Google & Bing.</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border font-bold text-sm flex items-center gap-1.5 ${scoreBadgeColor}`}>
          <span>{totalScore}/100</span>
          <span className="text-[11px] font-semibold">
            {totalScore >= 85 ? 'Excellent' : totalScore >= 65 ? 'Good' : 'Needs Review'}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {checks.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.status === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <Icon name={item.status === 'passed' ? 'check' : item.status === 'warning' ? 'clock' : 'close'} size={10} />
              </span>
              <span className="font-semibold text-slate-800">{item.label}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{item.tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
