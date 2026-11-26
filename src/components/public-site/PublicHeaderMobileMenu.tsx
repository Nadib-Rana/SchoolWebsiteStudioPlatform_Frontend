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
  erpLoginUrl?: string
  erpLoginLabel?: string
  setPage?: (p: string) => void
  onClose: () => void
}

export function PublicHeaderMobileMenu({
  navItems,
  schoolSlug,
  isDark,
  headerBg,
  erpLoginUrl,
  erpLoginLabel,
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
        setPage ? (
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
              setPage(n.page)
              onClose()
            }}
          >
            {n.label}
          </button>
        ) : (
          <Link
            key={n.path}
            href={
              schoolSlug
                ? n.path === '/'
                  ? `/${schoolSlug}`
                  : `/${schoolSlug}${n.path}`
                : n.path
            }
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
        )
      )}

      {erpLoginUrl && (
        <a
          href={erpLoginUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            marginTop: '4px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            background: 'var(--accent, #e3ad3f)',
            color: '#0f172a',
          }}
        >
          {erpLoginLabel?.trim() || 'ERP Login'} →
        </a>
      )}
    </div>
  )
}
