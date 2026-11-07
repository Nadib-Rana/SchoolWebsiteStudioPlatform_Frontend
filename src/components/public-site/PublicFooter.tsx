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
    <footer className="public-footer">
      <div className="public-logo">
        <span>{initial}</span>
        <div>
          <strong>{schoolName}</strong>
          <small>{motto}</small>
        </div>
      </div>
      <p>
        {address}
        <br />
        {phone} · {email}
      </p>
      <div>
        {links.map((link) =>
          schoolSlug ? (
            <Link key={link.label} href={`/${schoolSlug}${link.path}`}>
              {link.label}
            </Link>
          ) : (
            <button
              key={link.label}
              type="button"
              className="text-button"
              onClick={() => setPage && setPage(link.page)}
            >
              {link.label}
            </button>
          )
        )}
      </div>
      {copyright && (
        <div style={{ width: '100%', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', opacity: 0.75, textAlign: 'center' }}>
          {copyright}
        </div>
      )}
    </footer>
  )
}
