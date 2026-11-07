'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@/components/common/Icon'

export interface PublicHeaderProps {
  schoolSlug?: string
  schoolName?: string
  motto?: string
  logoUrl?: string
  logoLetter?: string
  navigation?: Array<{ label: string; url: string }>
  setPage?: (p: string) => void
  applyButtonText?: string
  headerStyle?: {
    bg?: string
    align?: string
    padding?: string
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    customClass?: string
  }
}

function isDarkColor(hex?: string): boolean {
  if (!hex || hex === 'transparent' || hex === '#ffffff' || hex === '#fff') return false
  const clean = hex.replace('#', '')
  let r = 255,
    g = 255,
    b = 255
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16)
    g = parseInt(clean.substring(2, 4), 16)
    b = parseInt(clean.substring(4, 6), 16)
  }
  return (r * 299 + g * 587 + b * 114) / 1000 < 145
}

export function PublicHeader({
  schoolSlug,
  schoolName = 'Northfield High School',
  motto = 'Learn · Lead · Serve',
  logoUrl,
  logoLetter,
  navigation,
  setPage,
  applyButtonText,
  headerStyle,
}: PublicHeaderProps) {
  const [imgError, setImgError] = useState(false)

  const defaultNav = [
    { label: 'About', path: '/about', page: 'About School' },
    { label: 'Academics', path: '/academics', page: 'Academic Programs' },
    { label: 'Faculty', path: '/teachers', page: 'Teachers & Faculty' },
    { label: 'Notices', path: '/notices', page: 'Notices' },
    { label: 'Events', path: '/events', page: 'Events' },
    { label: 'Gallery', path: '/gallery', page: 'Photo Gallery' },
    { label: 'Contact', path: '/contact', page: 'Contact Us' },
  ]

  const navItems =
    navigation && navigation.length > 0
      ? navigation.map((n) => ({
          label: n.label,
          path: n.url.startsWith('/') ? n.url : `/${n.url}`,
          page: n.label,
        }))
      : defaultNav

  const initial = logoLetter || (schoolName || 'N').charAt(0).toUpperCase()
  const isDark = isDarkColor(headerStyle?.bg)

  const logoMarkup = (
    <div className="public-logo logo-button" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={schoolName}
          className="header-logo-img"
          onError={() => setImgError(true)}
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
      ) : (
        <span
          style={{
            width: '38px',
            height: '38px',
            background: isDark ? '#e3ad3f' : '#102f58',
            color: isDark ? '#0f172a' : '#ffffff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: '18px',
            borderRadius: '6px',
            fontFamily: 'inherit',
          }}
        >
          {initial}
        </span>
      )}
      <div style={{ textAlign: 'left' }}>
        <strong
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: 700,
            color: isDark ? '#ffffff' : '#0f172a',
          }}
        >
          {schoolName}
        </strong>
        <small
          style={{
            display: 'block',
            fontSize: '11px',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: isDark ? '#facc15' : '#b1842d',
            marginTop: '2px',
          }}
        >
          {motto}
        </small>
      </div>
    </div>
  )

  return (
    <header
      className={`public-header ${headerStyle?.customClass || ''}`}
      style={{
        background: headerStyle?.bg || '#ffffff',
        paddingTop:
          headerStyle?.padding === 'compact'
            ? '8px'
            : headerStyle?.padding === 'spacious'
            ? '24px'
            : '14px',
        paddingBottom:
          headerStyle?.padding === 'compact'
            ? '8px'
            : headerStyle?.padding === 'spacious'
            ? '24px'
            : '14px',
        borderBottom: headerStyle?.border
          ? '2px solid #2563eb'
          : isDark
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid #e6e9ee',
        ...(headerStyle?.shadow === 'subtle'
          ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
          : headerStyle?.shadow === 'card'
          ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      {schoolSlug ? (
        <Link href={`/${schoolSlug}`} style={{ textDecoration: 'none' }}>
          {logoMarkup}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setPage && setPage('Home')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {logoMarkup}
        </button>
      )}

      <nav
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '2vw',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {navItems.map((item) =>
          schoolSlug ? (
            <Link
              key={item.label}
              href={`/${schoolSlug}${item.path === '/' ? '' : item.path}`}
              className="public-nav-link"
              style={{
                color: isDark ? '#f8fafc' : '#1e293b',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => setPage && setPage(item.page)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                font: 'inherit',
                color: isDark ? '#f8fafc' : '#1e293b',
                padding: '6px 0',
              }}
            >
              {item.label}
            </button>
          )
        )}
      </nav>

      {schoolSlug ? (
        <Link
          href={`/${schoolSlug}/admissions`}
          className="admission-button"
          style={{
            background: isDark ? '#e3ad3f' : '#102f58',
            color: isDark ? '#0f172a' : '#ffffff',
            textDecoration: 'none',
            borderRadius: '6px',
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: '13px',
          }}
        >
          {applyButtonText || 'Apply now'} <Icon name="arrow" size={15} />
        </Link>
      ) : (
        <button
          type="button"
          className="admission-button"
          style={{
            background: isDark ? '#e3ad3f' : '#102f58',
            color: isDark ? '#0f172a' : '#ffffff',
            borderRadius: '6px',
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
          }}
          onClick={() => setPage && setPage('Admission Information')}
        >
          {applyButtonText || 'Apply now'} <Icon name="arrow" size={15} />
        </button>
      )}

      <button type="button" className="public-menu" aria-label="Open mobile menu">
        <Icon name="menu" />
      </button>
    </header>
  )
}
