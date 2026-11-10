'use client'

import { Button } from '@/components/common/Button'
import { useStudio } from '@/context/StudioContext'

interface AuthFooterProps {
  mode: 'login' | 'register'
  onModeChange: (m: 'login' | 'register') => void
}

export function AuthFooter({ mode, onModeChange }: AuthFooterProps) {
  const { notify } = useStudio()

  return (
    <>
      <div className="or">
        <span />
        or continue with
        <span />
      </div>

      <Button
        type="button"
        onClick={() =>
          notify(
            'Google OAuth is not configured. Please use your email and password.',
          )
        }
      >
        <b>G</b> Continue with Google
      </Button>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {mode === 'login' ? (
          <>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Don’t have an account yet?{' '}
            </span>
            <button
              type="button"
              onClick={() => onModeChange('register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Already have an account?{' '}
            </span>
            <button
              type="button"
              onClick={() => onModeChange('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>

      <small className="legal">
        By signing in or registering, you agree to the Terms of Service and
        Privacy Policy.
      </small>
    </>
  )
}
