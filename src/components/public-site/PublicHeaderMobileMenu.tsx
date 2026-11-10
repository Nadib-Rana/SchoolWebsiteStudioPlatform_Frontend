'use client'

import Link from 'next/link'

interface NavItem {
  label: string
  path: string
  page: string
}

interface PublicHeaderMobileMenuProps {
  navItems: NavItem[]
  schoolSlug?: string
  isDark: boolean
  headerBg?: string
  setPage?: (p: string) => void
  onClose: () => void
}

export function PublicHeaderMobileMenu({
  navItems,
  schoolSlug,
  isDark,
  headerBg,
  setPage,
  onClose,
}: PublicHeaderMobileMenuProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: headerBg || (isDark ? '#091b35' : '#ffffff'),
        color: isDark ? '#ffffff' : '#1e293b',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 100,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {navItems.map((n) =>
        schoolSlug ? (
          <Link
            key={n.path}
            href={n.path === '/' ? `/${schoolSlug}` : `/${schoolSlug}${n.path}`}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={onClose}
          >
            {n.label}
          </Link>
        ) : (
          <button
            key={n.label}
            type="button"
            style={{
              border: 'none',
              background: 'transparent',
              textAlign: 'left',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              cursor: 'pointer',
            }}
            onClick={() => {
              setPage && setPage(n.page)
              onClose()
            }}
          >
            {n.label}
          </button>
        )
      )}
    </div>
  )
}
