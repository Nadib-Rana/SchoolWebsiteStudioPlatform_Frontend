'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { HELP_GUIDES } from '@/config/help-guides'
import type { IconName, View } from '@/types/studio'

interface SearchItem {
  id: string
  view: View
  title: string
  location: string
  description: string
  icon: IconName
  keywords: string
}

const STUDIO_SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'overview',
    view: 'overview',
    title: 'Overview & Quick Launchpad',
    location: 'Overview',
    description: 'Website live status, quick metrics, and setup shortcuts.',
    icon: 'home',
    keywords: 'home dashboard stats launchpad overview',
  },
  {
    id: 'builder',
    view: 'builder',
    title: 'Website Builder & Live Editor',
    location: 'Workspace → Website Builder',
    description: 'Edit homepage hero, announcement bar, sections, and custom blocks.',
    icon: 'layout',
    keywords: 'builder homepage hero slider intro sections styles',
  },
  {
    id: 'templates',
    view: 'templates',
    title: 'Website Templates',
    location: 'Workspace → Templates',
    description: 'Switch visual themes without losing notices, teachers, or pages.',
    icon: 'layers',
    keywords: 'template theme modern classic academic',
  },
  {
    id: 'theme',
    view: 'theme',
    title: 'Theme Colors, Fonts & Design',
    location: 'Workspace → Theme Customization',
    description: 'Customize primary navy, accent gold, fonts, and button radius.',
    icon: 'settings',
    keywords: 'colors fonts typography palette accent primary secondary theme',
  },
  {
    id: 'pages',
    view: 'pages',
    title: 'Pages Manager',
    location: 'Manage → Pages',
    description: 'Create, publish, draft, and organize public website pages.',
    icon: 'file',
    keywords: 'create page slug banner meta seo page builder',
  },
  {
    id: 'content-info',
    view: 'content',
    title: 'School Profile, Logo, Address & Principal',
    location: 'Manage → Content Management',
    description: 'Edit school name, logo, favicon, cover photo, motto, mission, and principal bio.',
    icon: 'layers',
    keywords: 'school info logo favicon cover address phone email principal mission vision',
  },
  {
    id: 'content-erp-social',
    view: 'content',
    title: 'ERP Login Button & Footer Social Links',
    location: 'Content Management → School information',
    description: 'Set ERP Login URL/label and Facebook, YouTube, Instagram, LinkedIn, X links for Header & Footer.',
    icon: 'external',
    keywords: 'erp login footer header facebook youtube instagram linkedin twitter social profile portal button link',
  },
  {
    id: 'settings-erp-social',
    view: 'settings',
    title: 'ERP Login & Social Profile Links (Settings)',
    location: 'Settings → School profile',
    description: 'Manage ERP Login portal URL and public social links stored in your school database.',
    icon: 'settings',
    keywords: 'erp login footer header facebook youtube social links school profile',
  },
  {
    id: 'teachers',
    view: 'teachers',
    title: 'Teachers & Faculty Directory',
    location: 'Manage → Teachers',
    description: 'Manage teacher profiles, photos, designations, or sync from ERP.',
    icon: 'users',
    keywords: 'teachers faculty staff educators directory sync erp',
  },
  {
    id: 'governing-body',
    view: 'governing-body',
    title: 'Governing Body, Managing Committee & Advisory Board',
    location: 'Manage → Governing Body',
    description: 'Add Chairman/committee members, customize card styles & colors, and toggle On/Off.',
    icon: 'users',
    keywords: 'governing body managing committee smc advisory board trustees chairman spotlight card style colors portrait horizontal executive minimal on off',
  },
  {
    id: 'academics',
    view: 'academics',
    title: 'Academic Programs Page Editor',
    location: 'Manage → Academics',
    description: 'Edit /academics hero title, division cards, curriculum, grades, subjects, facilities & honors.',
    icon: 'file',
    keywords: 'academic programs curriculum grades subjects facilities achievements honors primary middle senior division',
  },
  {
    id: 'admissions',
    view: 'admissions',
    title: 'Admissions Pipeline, Fees, Payment & PDF Slip',
    location: 'Manage → Admissions',
    description: 'Review student applications, class fees, online payment gateways, and A4 PDF confirmation slips.',
    icon: 'check',
    keywords: 'admission apply payment pdf receipt status slip bkash nagad sslcommerz stripe fee photo track',
  },
  {
    id: 'inquiries',
    view: 'inquiries',
    title: 'Contact Inquiries & Lead Inbox',
    location: 'Manage → Inquiries',
    description: 'Read parent inquiries from Contact Us page and track follow-up notes.',
    icon: 'help',
    keywords: 'contact inquiry lead inbox message parent question',
  },
  {
    id: 'notices',
    view: 'notices',
    title: 'Notices, Circulars & PDF Downloads',
    location: 'Manage → Notices',
    description: 'Publish notices, pin circulars, upload exam routine PDFs, and populate Download Center.',
    icon: 'bell',
    keywords: 'notice circular bulletin pdf download ticker routine syllabus holiday',
  },
  {
    id: 'events',
    view: 'events',
    title: 'School Events Calendar',
    location: 'Manage → Events',
    description: 'Schedule annual sports, seminars, and cultural events with date & venue.',
    icon: 'calendar',
    keywords: 'events calendar sports function ceremony schedule',
  },
  {
    id: 'gallery',
    view: 'gallery',
    title: 'Photo Gallery & Albums',
    location: 'Manage → Gallery',
    description: 'Create campus photo albums and upload event highlights.',
    icon: 'image',
    keywords: 'gallery photos albums campus pictures',
  },
  {
    id: 'navigation',
    view: 'navigation',
    title: 'Header & Footer Navigation Menus',
    location: 'Manage → Navigation',
    description: 'Add, reorder, or link Governing Body, Academics, Admissions, and custom URLs.',
    icon: 'menu',
    keywords: 'navigation menu header footer links navbar presets governing body',
  },
  {
    id: 'media',
    view: 'media',
    title: 'Media Library',
    location: 'Optimize → Media Library',
    description: 'Upload and reuse school images, logos, and PDF documents.',
    icon: 'image',
    keywords: 'media upload files images photos assets storage',
  },
  {
    id: 'seo',
    view: 'seo',
    title: 'SEO & Social Sharing Manager',
    location: 'Optimize → SEO Manager',
    description: 'Set Google search meta title, description, keywords, and OpenGraph preview.',
    icon: 'search',
    keywords: 'seo google meta description og image keywords analytics',
  },
  {
    id: 'domains',
    view: 'domains',
    title: 'Custom Domain Management',
    location: 'Optimize → Domain Management',
    description: 'Connect your school custom domain with DNS verification and SSL.',
    icon: 'globe',
    keywords: 'domain custom url dns cname ssl',
  },
  {
    id: 'integrations',
    view: 'integrations',
    title: 'School ERP Integration (x-website-key & Webhooks)',
    location: 'Optimize → Integrations',
    description: 'Connect live School ERP key, test connection, view sync logs, and copy webhook URL.',
    icon: 'plug',
    keywords: 'erp api key x-website-key webhook hmac alumni verify sync history live connection',
  },
  {
    id: 'analytics',
    view: 'analytics',
    title: 'Website Visitor Analytics',
    location: 'Optimize → Analytics',
    description: 'Monitor daily page views, unique visitors, and top school pages.',
    icon: 'chart',
    keywords: 'analytics visitors traffic views chart reports',
  },
  {
    id: 'audit-logs',
    view: 'audit-logs',
    title: 'Audit Logs & Activity Timeline',
    location: 'Optimize → Audit Logs',
    description: 'Inspect who published, updated, or modified school content and roles.',
    icon: 'clock',
    keywords: 'audit logs activity security history csv',
  },
  {
    id: 'publishing',
    view: 'publishing',
    title: 'Publishing, Snapshots & Rollback',
    location: 'Optimize → Publishing',
    description: 'Publish new website versions and restore previous snapshots.',
    icon: 'sparkle',
    keywords: 'publish release version snapshot restore backup',
  },
  {
    id: 'settings-website',
    view: 'settings',
    title: 'Website Preferences, Maintenance, WhatsApp & Toggles',
    location: 'Settings → Website',
    description: 'Toggle Public Admissions, Governing Body, Notice Ticker, WhatsApp/Call buttons & Maintenance Mode.',
    icon: 'settings',
    keywords: 'settings website maintenance mode whatsapp call notice ticker toggle admissions governing body',
  },
  {
    id: 'help',
    view: 'help',
    title: 'Help Center & Bilingual Guides',
    location: 'Optimize → Help Center',
    description: 'Step-by-step guides in English and বাংলা for every feature.',
    icon: 'help',
    keywords: 'help guide manual instructions bangla english tutorial',
  },
]

export function StudioTopbarSearch() {
  const { setView } = useStudio()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const guideTextByView = useMemo(() => {
    const map = new Map<string, string>()
    HELP_GUIDES.forEach((g) => {
      const text = [
        g.title.en,
        g.title.bn,
        g.summary.en,
        g.summary.bn,
        ...g.steps.flatMap((s) => [s.title.en, s.title.bn, s.detail.en, s.detail.bn]),
      ]
        .join(' ')
        .toLowerCase()
      map.set(g.view, `${map.get(g.view) || ''} ${text}`)
    })
    return map
  }, [])

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) {
      return STUDIO_SEARCH_ITEMS.slice(0, 8)
    }
    const tokens = q.split(/\s+/).filter(Boolean)
    return STUDIO_SEARCH_ITEMS.filter((item) => {
      const haystack = `${item.title} ${item.location} ${item.description} ${item.keywords} ${
        guideTextByView.get(item.view) || ''
      }`.toLowerCase()
      return tokens.every((tok) => haystack.includes(tok))
    }).slice(0, 10)
  }, [query, guideTextByView])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  const handleSelect = (item: SearchItem) => {
    setView(item.view)
    setOpen(false)
    setMobileOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setMobileOpen(false)
      ;(e.target as HTMLInputElement).blur()
      return
    }
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results[activeIndex] || results[0]
      if (selected) handleSelect(selected)
    }
  }

  const renderDropdown = () => (
    <div
      role="listbox"
      aria-label="Quick Studio navigation results"
      className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto"
    >
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {query.trim()
            ? `Matching items (${results.length})`
            : 'Quick Jump to Pages & Settings'}
        </span>
        <span className="text-[11px] text-slate-400">↑↓ Navigate · Enter Open</span>
      </div>

      {results.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-slate-500">
          No matching section found for &ldquo;{query}&rdquo;. Try &ldquo;Governing Body&rdquo;, &ldquo;ERP Login&rdquo;, &ldquo;Academics&rdquo;, or &ldquo;Admissions&rdquo;.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {results.map((item, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  isActive ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon name={item.icon} size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-[13px] font-semibold text-slate-900 truncate">
                      {item.title}
                    </strong>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {item.location}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div ref={containerRef} className="relative flex items-center mx-2 md:mx-4 md:flex-1 md:max-w-md">
      {/* Desktop / Tablet Search Input */}
      <div className="hidden md:flex items-center w-full relative">
        <span className="absolute left-3 text-slate-400 pointer-events-none">
          <Icon name="search" size={15} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search pages, ERP Login, Advisory Board, Academics..."
          aria-label="Search studio pages and settings"
          className="w-full h-9 pl-9 pr-16 rounded-lg border border-slate-200 bg-slate-50/80 text-[13px] text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <Icon name="close" size={13} />
          </button>
        ) : (
          <kbd className="hidden lg:inline-block absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded">
            Ctrl K
          </kbd>
        )}

        {open && renderDropdown()}
      </div>

      {/* Mobile Compact Search Trigger */}
      <div className="md:hidden">
        <button
          type="button"
          className={mobileOpen ? 'icon-button active' : 'icon-button'}
          aria-label="Quick search pages and settings"
          onClick={() => {
            setMobileOpen((prev) => !prev)
            setOpen(true)
            setTimeout(() => mobileInputRef.current?.focus(), 20)
          }}
        >
          <Icon name="search" size={16} />
        </button>

        {mobileOpen && (
          <div className="fixed left-3 right-3 top-16 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3">
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
              <Icon name="search" size={15} />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, ERP Login, Academics..."
                className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close search"
                className="text-slate-400 p-0.5"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            <div className="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left py-2.5 px-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded"
                >
                  <div className="min-w-0">
                    <strong className="block text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </strong>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {item.location}
                    </span>
                  </div>
                  <Icon name="arrow" size={13} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
