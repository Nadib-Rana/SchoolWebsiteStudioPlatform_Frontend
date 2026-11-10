'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface PublicApplyButtonProps {
  schoolSlug?: string
  isDark: boolean
  setPage?: (p: string) => void
  applyButtonText?: string
}

export function PublicApplyButton({
  schoolSlug,
  isDark,
  setPage,
  applyButtonText,
}: PublicApplyButtonProps) {
  const label = applyButtonText || 'Apply now'
  const btnStyle = {
    background: isDark ? '#e3ad3f' : '#102f58',
    color: isDark ? '#0f172a' : '#ffffff',
    borderRadius: '6px',
    padding: '8px 18px',
    fontWeight: 700,
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
  }

  if (setPage) {
    return (
      <button
        type="button"
        className="admission-button"
        style={btnStyle}
        onClick={() => setPage('Admission Information')}
      >
        {label} <Icon name="arrow" size={15} />
      </button>
    )
  }

  if (schoolSlug) {
    return (
      <Link
        href={`/${schoolSlug}/admissions`}
        className="admission-button"
        style={btnStyle}
      >
        {label} <Icon name="arrow" size={15} />
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="admission-button"
      style={btnStyle}
    >
      {label} <Icon name="arrow" size={15} />
    </button>
  )
}
