'use client'

import { Icon } from '@/components/common/Icon'

export interface PublicHeaderProps {
  setPage: (p: string) => void
}

export function PublicHeader({ setPage }: PublicHeaderProps) {
  return (
    <header className="public-header">
      <button
        type="button"
        className="public-logo logo-button"
        onClick={() => setPage('Home')}
      >
        <span>N</span>
        <div>
          <strong>Northfield High School</strong>
          <small>Learn · Lead · Serve</small>
        </div>
      </button>

      <nav>
        <button type="button" onClick={() => setPage('About School')}>
          About
        </button>
        <button type="button" onClick={() => setPage('Academic Programs')}>
          Academics
        </button>
        <button type="button" onClick={() => setPage('Teachers & Faculty')}>
          Community
        </button>
        <button type="button" onClick={() => setPage('Events')}>
          News & events
        </button>
        <button type="button" onClick={() => setPage('Contact Us')}>
          Contact
        </button>
      </nav>

      <button
        type="button"
        className="admission-button"
        onClick={() => setPage('Admission Information')}
      >
        Apply for admission <Icon name="arrow" size={15} />
      </button>

      <button type="button" className="public-menu" aria-label="Open mobile menu">
        <Icon name="menu" />
      </button>
    </header>
  )
}
