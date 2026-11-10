'use client'

import Link from 'next/link'

export interface PublicFooterProps {
  schoolSlug?: string
  schoolName?: string
  motto?: string
  address?: string
  phone?: string
  email?: string
  copyright?: string
  footerStyle?: {
    bg?: string
    align?: string
    padding?: string
    border?: boolean
    shadow?: string
    hideOnMobile?: boolean
    customClass?: string
  }
  setPage?: (p: string) => void
}

export function PublicFooter({
  schoolSlug,
  schoolName = 'Northfield High School',
  motto = 'Learn · Lead · Serve',
  address = '27 Lakeview Avenue, Dhaka',
  phone = '+880 2 555 0142',
  email = 'hello@northfield.edu',
  copyright,
  footerStyle,
  setPage,
}: PublicFooterProps) {
  const initial = (schoolName || 'N').charAt(0).toUpperCase()

  const links = [
    { label: 'About', path: '/about', page: 'About School' },
    { label: 'Academics', path: '/academics', page: 'Academic Programs' },
    { label: 'Admissions', path: '/admissions', page: 'Admission Information' },
    { label: 'Notices', path: '/notices', page: 'Notices' },
    { label: 'Contact', path: '/contact', page: 'Contact Us' },
  ]

  return (
    <footer
      className={`public-footer ${footerStyle?.customClass || ''}`}
      style={{
        background: footerStyle?.bg || 'var(--navy, #102f58)',
        paddingTop:
          footerStyle?.padding === 'compact'
            ? '35px'
            : footerStyle?.padding === 'spacious'
            ? '85px'
            : '60px',
        paddingBottom:
          footerStyle?.padding === 'compact'
            ? '35px'
            : footerStyle?.padding === 'spacious'
            ? '85px'
            : '60px',
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
      <div className="public-logo">
        <span style={{ width: '37px', height: '37px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px' }}>{initial}</span>
        <div>
          <strong style={{ color: '#ffffff' }}>{schoolName}</strong>
          <small style={{ color: '#facc15' }}>{motto}</small>
        </div>
      </div>
      <p style={{ color: '#cbd5e1' }}>
        {address}
        <br />
        {phone} · {email}
      </p>
      <div>
        {links.map((link) =>
          schoolSlug ? (
            <Link key={link.label} href={`/${schoolSlug}${link.path}`} style={{ color: '#e2e8f0' }}>
              {link.label}
            </Link>
          ) : (
            <button
              key={link.label}
              type="button"
              className="text-button"
              style={{ color: '#e2e8f0' }}
              onClick={() => setPage && setPage(link.page)}
            >
              {link.label}
            </button>
          )
        )}
      </div>
      {copyright && (
        <div style={{ width: '100%', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          {copyright}
        </div>
      )}
    </footer>
  )
}
