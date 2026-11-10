'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import {
  type PublicHeaderProps,
  isDarkColor,
  DEFAULT_HEADER_NAV,
} from './header-helpers'
import { PublicHeaderLogo } from './PublicHeaderLogo'
import { PublicHeaderMobileMenu } from './PublicHeaderMobileMenu'
import { PublicLanguageSelector } from './PublicLanguageSelector'
import { usePublicTranslation } from '@/lib/i18n/usePublicTranslation'

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
  const { t } = usePublicTranslation()

  const navItems =
    navigation && navigation.length > 0
      ? navigation.map((n) => ({
          label: n.label,
          path: n.url.startsWith('/') ? n.url : `/${n.url}`,
          page: n.label,
        }))
      : DEFAULT_HEADER_NAV

  const isDark = isDarkColor(headerStyle?.bg)

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
          {t('btn_apply', applyButtonText || 'Apply now')} <Icon name="arrow" size={15} />
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
          {t('btn_apply', applyButtonText || 'Apply now')} <Icon name="arrow" size={15} />
        </button>
      )}

      <PublicLanguageSelector isDark={isDark} />

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
