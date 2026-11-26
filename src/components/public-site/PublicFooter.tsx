'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import {
  normalizeExternalUrl,
  type SchoolSocialLinks,
} from '@/lib/social-links'

export interface PublicFooterProps {
  schoolSlug?: string
  schoolName?: string
  logoUrl?: string
  motto?: string
  address?: string
  phone?: string
  email?: string
  copyright?: string
  showAdmissions?: boolean
  showGoverningBody?: boolean
  socialLinks?: SchoolSocialLinks
  footerStyle?: {
    bg?: string
    textColor?: string
    align?: string
    padding?: string
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    isHidden?: boolean
    customId?: string
    customClass?: string
  }
  setPage?: (p: string) => void
}

function renderSocialIcon(key: string) {
  switch (key) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.3l.7-3H13v-1.5c0-.28.22-.5.5-.5z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9A28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.43 8.22 13.48 9.17 13.02 9.93V8.5H9.65C9.7 9.45 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    default:
      return <Icon name="globe" size={15} />
  }
}

export function PublicFooter({
  schoolSlug,
  schoolName = 'Northfield High School',
  logoUrl,
  motto = 'Learn · Lead · Serve',
  address = '27 Lakeview Avenue, Dhaka',
  phone = '+880 2 555 0142',
  email = 'hello@northfield.edu',
  copyright,
  showAdmissions = true,
  showGoverningBody = false,
  socialLinks,
  footerStyle,
  setPage,
}: PublicFooterProps) {
  if (footerStyle?.isHidden) {
    return null
  }
  const initial = (schoolName || 'N').charAt(0).toUpperCase()

  const allLinks = [
    { label: 'About', path: '/about', page: 'About School' },
    { label: 'Academics', path: '/academics', page: 'Academic Programs' },
    ...(showGoverningBody
      ? [{ label: 'Governing Body', path: '/governing-body', page: 'Governing Body' }]
      : []),
    { label: 'Admissions', path: '/admissions', page: 'Admission Information' },
    { label: 'Notices', path: '/notices', page: 'Notices' },
    { label: 'Downloads', path: '/downloads', page: 'Notices' },
    { label: 'Contact', path: '/contact', page: 'Contact Us' },
  ]
  const links = showAdmissions
    ? allLinks
    : allLinks.filter((link) => link.path !== '/admissions')

  const socialItems = [
    { key: 'facebook', label: 'Facebook', url: normalizeExternalUrl(socialLinks?.facebook) },
    { key: 'youtube', label: 'YouTube', url: normalizeExternalUrl(socialLinks?.youtube) },
    { key: 'instagram', label: 'Instagram', url: normalizeExternalUrl(socialLinks?.instagram) },
    { key: 'linkedin', label: 'LinkedIn', url: normalizeExternalUrl(socialLinks?.linkedin) },
    { key: 'twitter', label: 'X (Twitter)', url: normalizeExternalUrl(socialLinks?.twitter) },
    { key: 'website', label: 'Official Website', url: normalizeExternalUrl(socialLinks?.website) },
  ].filter((item): item is { key: string; label: string; url: string } => Boolean(item.url))

  const erpLoginUrl = normalizeExternalUrl(socialLinks?.erpLoginUrl)
  const erpLoginLabel = socialLinks?.erpLoginLabel?.trim() || 'ERP Login'

  return (
    <footer
      id={footerStyle?.customId || undefined}
      className={`public-footer ${footerStyle?.hideOnMobile ? 'hidden sm:grid' : ''} ${footerStyle?.customClass || ''}`}
      style={{
        background: footerStyle?.bg || 'var(--navy, #102f58)',
        paddingTop:
          footerStyle?.padding === 'compact'
            ? '35px'
            : footerStyle?.padding === 'spacious'
            ? '85px'
            : '54px',
        paddingBottom:
          footerStyle?.padding === 'compact'
            ? '35px'
            : footerStyle?.padding === 'spacious'
            ? '85px'
            : '42px',
        rowGap: '24px',
        columnGap: '28px',
        ...(footerStyle?.border
          ? { borderTop: '2px solid #2563eb' }
          : {}),
        ...(footerStyle?.shadow === 'subtle'
          ? { boxShadow: '0 -4px 15px rgba(0,0,0,0.06)' }
          : footerStyle?.shadow === 'card'
          ? { boxShadow: '0 -10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      <div>
        <div className="public-logo">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={schoolName}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain',
                background: '#ffffff',
                padding: '3px',
                flexShrink: 0,
              }}
            />
          ) : (
            <span
              style={{
                width: '38px',
                height: '38px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: footerStyle?.textColor || '#ffffff',
              }}
            >
              {initial}
            </span>
          )}
          <div>
            <strong style={{ color: footerStyle?.textColor || '#ffffff' }}>{schoolName}</strong>
            <small style={{ color: '#facc15' }}>{motto}</small>
          </div>
        </div>

        {socialItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            {socialItems.map((item) => (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${schoolName} ${item.label}`}
                title={item.label}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: footerStyle?.textColor || '#f8fafc',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                {renderSocialIcon(item.key)}
              </a>
            ))}
          </div>
        )}
      </div>

      <p style={{ color: footerStyle?.textColor || '#cbd5e1', margin: 0 }}>
        {address}
        <br />
        {phone} · {email}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px 18px',
            fontSize: '13px',
          }}
        >
          {links.map((link) =>
            schoolSlug ? (
              <Link
                key={link.label}
                href={`/${schoolSlug}${link.path}`}
                style={{ color: footerStyle?.textColor || '#e2e8f0', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                className="text-button"
                style={{ color: footerStyle?.textColor || '#e2e8f0' }}
                onClick={() => setPage && setPage(link.page)}
              >
                {link.label}
              </button>
            ),
          )}
        </div>

        {erpLoginUrl && (
          <a
            href={erpLoginUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'var(--accent, #e3ad3f)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {erpLoginLabel} <Icon name="external" size={14} />
          </a>
        )}
      </div>

      <div
        style={{
          gridColumn: '1 / -1',
          width: '100%',
          display: 'block',
          marginTop: '6px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          fontSize: '12px',
          color: footerStyle?.textColor || '#94a3b8',
          opacity: footerStyle?.textColor ? 0.85 : 1,
          textAlign: 'center',
        }}
      >
        {copyright || `© ${new Date().getFullYear()} ${schoolName}. All rights reserved.`}
      </div>
    </footer>
  )
}
