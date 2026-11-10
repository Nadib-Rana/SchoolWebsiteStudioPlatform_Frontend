'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

interface SignInFormProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}: SignInFormProps) {
  const { notify } = useStudio()

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email address
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Password
        <div className="password">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: '4px',
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name="eye" size={16} />
          </button>
        </div>
      </label>

      <div className="remember">
        <label>
          <input type="checkbox" defaultChecked /> Remember me
        </label>
        <button
          type="button"
          onClick={() =>
            notify('Password reset OTP service is available on the backend.')
          }
        >
          Forgot password?
        </button>
      </div>

      <Button kind="primary" type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in to Studio'}{' '}
        <Icon name="arrow" size={15} />
      </Button>
    </form>
  )
}
