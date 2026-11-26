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
import { normalizeExternalUrl } from '@/lib/social-links'
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
  showAdmissions = true,
  erpLoginUrl,
  erpLoginLabel,
  headerStyle,
}: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const safeErpUrl = normalizeExternalUrl(erpLoginUrl)
  const erpButtonText = erpLoginLabel?.trim() || 'ERP Login'

  const rawNavItems =
    navigation && navigation.length > 0
      ? navigation.map((n) => ({
          label: n.label,
          path: n.url.startsWith('/') ? n.url : `/${n.url}`,
          page: n.label,
        }))
      : DEFAULT_HEADER_NAV

  const navItems = showAdmissions
    ? rawNavItems
    : rawNavItems.filter(
        (item) => !item.path.toLowerCase().startsWith('/admissions'),
      )

  const bg = headerStyle?.bg || 'var(--header-bg, #ffffff)'
  const isDark = isDarkColor(bg)
  const navTextColor =
    headerStyle?.textColor || (isDark ? '#f8fafc' : '#1e293b')
  const navAlign = headerStyle?.align || 'right'
  const navMarginLeft = navAlign === 'left' ? '2.5vw' : 'auto'
  const navMarginRight =
    navAlign === 'left' || navAlign === 'center' ? 'auto' : '0'

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
          marginLeft: navMarginLeft,
          marginRight: navMarginRight,
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
                color: navTextColor,
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
                color: navTextColor,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      {showAdmissions && (
        <PublicApplyButton
          schoolSlug={schoolSlug}
          isDark={isDark}
          setPage={setPage}
          applyButtonText={applyButtonText}
        />
      )}

      {safeErpUrl && (
        <a
          href={safeErpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-85"
          style={{
            marginLeft: showAdmissions ? '10px' : '2vw',
            height: '36px',
            padding: '0 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            border: isDark
              ? '1px solid rgba(255,255,255,0.35)'
              : '1px solid var(--navy, #102f58)',
            background: isDark ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: isDark ? '#ffffff' : 'var(--navy, #102f58)',
          }}
        >
          {erpButtonText} <Icon name="external" size={13} />
        </a>
      )}

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
          erpLoginUrl={safeErpUrl}
          erpLoginLabel={erpButtonText}
          setPage={setPage}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}
