'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import {
  type PublicHeaderProps,
  isDarkColor,
  DEFAULT_HEADER_NAV,
  getHeaderInlineStyle,
} from './header-helpers'
import { PublicHeaderLogo } from './PublicHeaderLogo'
import { PublicHeaderMobileMenu } from './PublicHeaderMobileMenu'
import { PublicApplyButton } from './PublicApplyButton'

export type { PublicHeaderProps }

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems =
    navigation && navigation.length > 0
      ? navigation.map((n) => ({
          label: n.label,
          path: n.url.startsWith('/') ? n.url : `/${n.url}`,
          page: n.label,
        }))
      : DEFAULT_HEADER_NAV

  const bg = headerStyle?.bg || 'var(--header-bg, #ffffff)'
  const isDark = isDarkColor(bg)

  return (
    <header
      className={`public-header ${headerStyle?.customClass || ''}`}
      style={getHeaderInlineStyle(headerStyle, isDark)}
    >
      <PublicHeaderLogo
        schoolSlug={schoolSlug}
        schoolName={schoolName}
        motto={motto}
        logoUrl={logoUrl}
        logoLetter={logoLetter}
        isDark={isDark}
        setPage={setPage}
      />

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
          setPage ? (
            <button
              key={item.label}
              type="button"
              onClick={() => setPage(item.page)}
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
          ) : (
            <Link
              key={item.label}
              href={
                schoolSlug
                  ? `/${schoolSlug}${item.path === '/' ? '' : item.path}`
                  : item.path
              }
              className="public-nav-link"
              style={{
                color: isDark ? '#f8fafc' : '#1e293b',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      <PublicApplyButton
        schoolSlug={schoolSlug}
        isDark={isDark}
        setPage={setPage}
        applyButtonText={applyButtonText}
      />

      <button
        type="button"
        className="public-menu"
        aria-label="Toggle mobile menu"
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
      </button>

      {mobileMenuOpen && (
        <PublicHeaderMobileMenu
          navItems={navItems}
          schoolSlug={schoolSlug}
          isDark={isDark}
          headerBg={headerStyle?.bg}
          setPage={setPage}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
