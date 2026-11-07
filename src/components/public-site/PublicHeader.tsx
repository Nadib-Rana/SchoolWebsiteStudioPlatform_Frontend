'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

export interface PublicHeaderProps {
  schoolSlug?: string
  schoolName?: string
  motto?: string
  logoUrl?: string
  navigation?: Array<{ label: string; url: string }>
  setPage?: (p: string) => void
}

export function PublicHeader({
  schoolSlug,
  schoolName = 'Northfield High School',
  motto = 'Learn · Lead · Serve',
  logoUrl,
  navigation,
  setPage,
}: PublicHeaderProps) {
  const defaultNav = [
    { label: 'About', path: '/about', page: 'About School' },
    { label: 'Academics', path: '/academics', page: 'Academic Programs' },
    { label: 'Faculty', path: '/teachers', page: 'Teachers & Faculty' },
    { label: 'Notices', path: '/notices', page: 'Notices' },
    { label: 'Events', path: '/events', page: 'Events' },
    { label: 'Gallery', path: '/gallery', page: 'Photo Gallery' },
    { label: 'Contact', path: '/contact', page: 'Contact Us' },
  ]

  const navItems = navigation && navigation.length > 0
    ? navigation.map((n) => ({
        label: n.label,
        path: n.url.startsWith('/') ? n.url : `/${n.url}`,
        page: n.label,
      }))
    : defaultNav

  const initial = (schoolName || 'N').charAt(0).toUpperCase()

  return (
    <header className="public-header">
      {schoolSlug ? (
        <Link href={`/${schoolSlug}`} className="public-logo logo-button">
          {logoUrl ? (
            <img src={logoUrl} alt={schoolName} className="header-logo-img" />
          ) : (
            <span>{initial}</span>
          )}
          <div>
            <strong>{schoolName}</strong>
            <small>{motto}</small>
          </div>
        </Link>
      ) : (
        <button
          type="button"
          className="public-logo logo-button"
          onClick={() => setPage && setPage('Home')}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={schoolName} className="header-logo-img" />
          ) : (
            <span>{initial}</span>
          )}
          <div>
            <strong>{schoolName}</strong>
            <small>{motto}</small>
          </div>
        </button>
      )}

      <nav>
        {navItems.map((item) =>
          schoolSlug ? (
            <Link
              key={item.label}
              href={`/${schoolSlug}${item.path === '/' ? '' : item.path}`}
              className="public-nav-link"
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => setPage && setPage(item.page)}
            >
              {item.label}
            </button>
          )
        )}
      </nav>

      {schoolSlug ? (
        <Link href={`/${schoolSlug}/admissions`} className="admission-button">
          Apply for admission <Icon name="arrow" size={15} />
        </Link>
      ) : (
        <button
          type="button"
          className="admission-button"
          onClick={() => setPage && setPage('Admission Information')}
        >
          Apply for admission <Icon name="arrow" size={15} />
        </button>
      )}

      <button type="button" className="public-menu" aria-label="Open mobile menu">
        <Icon name="menu" />
      </button>
    </header>
  )
}
