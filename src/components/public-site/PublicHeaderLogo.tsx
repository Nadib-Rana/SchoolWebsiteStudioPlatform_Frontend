'use client'

import Link from 'next/link'
import { useState } from 'react'

interface PublicHeaderLogoProps {
  schoolSlug?: string
  schoolName: string
  motto: string
  logoUrl?: string
  logoLetter?: string
  isDark: boolean
  setPage?: (p: string) => void
}

export function PublicHeaderLogo({
  schoolSlug,
  schoolName,
  motto,
  logoUrl,
  logoLetter,
  isDark,
  setPage,
}: PublicHeaderLogoProps) {
  const [imgError, setImgError] = useState(false)
  const initial = logoLetter || (schoolName || 'N').charAt(0).toUpperCase()

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

  if (setPage) {
    return (
      <button
        type="button"
        onClick={() => setPage('Home')}
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
    )
  }

  if (schoolSlug) {
    return (
      <Link href={`/${schoolSlug}`} style={{ textDecoration: 'none' }}>
        {logoMarkup}
      </Link>
    )
  }

  return (
    <div style={{ textAlign: 'left' }}>
      {logoMarkup}
    </div>
  )
}
