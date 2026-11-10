'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import type { CreatedSchoolInfo } from './onboarding.types'

interface OnboardingSuccessScreenProps {
  createdSchool: CreatedSchoolInfo
}

export function OnboardingSuccessScreen({ createdSchool }: OnboardingSuccessScreenProps) {
  const navigateToDashboard = () => {
    if (createdSchool.id) {
      api.setActiveSchoolId(createdSchool.id)
      api.setActiveSchoolSlug(createdSchool.slug)
    }
    window.location.href = '/'
  }

  return (
    <div
      className="onboarding-page"
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="onboarding-head">
        <div className="brand-mark">
          <Icon name="layers" />
        </div>
        <strong>School Registration Complete</strong>
        <Button kind="primary" onClick={navigateToDashboard}>
          Go to Studio Dashboard
        </Button>
      </div>

      <div
        style={{
          maxWidth: '680px',
          width: 'calc(100% - 32px)',
          margin: '60px auto',
          background: '#fff',
          padding: '48px 36px',
          borderRadius: '16px',
          boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            background: '#dcfce7',
            color: '#16a34a',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 20px',
            fontSize: '36px',
            boxShadow: '0 0 0 8px #f0fdf4',
          }}
        >
          ✓
        </div>
        <span
          style={{
            fontSize: '12px',
            color: '#16a34a',
            fontWeight: 800,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
          }}
        >
          SCHOOL CREATED & LIVE
        </span>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            margin: '12px 0 8px',
            color: '#0f172a',
            letterSpacing: '-0.8px',
          }}
        >
          {createdSchool.name} is Live!
        </h1>
        <p
          style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 28px',
          }}
        >
          Your school has been provisioned on the platform. All 6 initial
          pages, theme configuration, and navigation have been published.
        </p>

        <div
          style={{
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            border: '1px solid #cbd5e1',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <small
              style={{
                color: '#64748b',
                fontSize: '11px',
                fontWeight: 700,
                display: 'block',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              PUBLIC WEBSITE URL
            </small>
            <strong style={{ fontSize: '15px', color: '#1e293b' }}>
              http://localhost:3000/{createdSchool.slug}
            </strong>
          </div>
          <Button
            kind="ghost"
            onClick={() => window.open(`/${createdSchool.slug}`, '_blank')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Visit Public Site</span>
            <Icon name="external" size={14} />
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button onClick={() => window.open(`/${createdSchool.slug}`, '_blank')}>
            View Public Website
          </Button>
          <Button kind="primary" onClick={navigateToDashboard}>
            Open Studio Dashboard →
          </Button>
        </div>
      </div>
    </div>
  )
}
