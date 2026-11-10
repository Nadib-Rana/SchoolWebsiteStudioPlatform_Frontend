'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

interface SignUpFormProps {
  firstName: string
  setFirstName: (name: string) => void
  lastName: string
  setLastName: (name: string) => void
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function SignUpForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <label>
          First name
          <input
            type="text"
            placeholder="e.g. Nadib"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last name
          <input
            type="text"
            placeholder="e.g. Rana"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>

      <label>
        Your login email address <span style={{ color: '#ef4444' }}>*</span>
        <input
          type="email"
          required
          placeholder="name@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Create your login password <span style={{ color: '#ef4444' }}>*</span>
        <div className="password">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="At least 6 characters"
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
        <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          This is the password you will use whenever you sign in to your Studio.
        </small>
      </label>

      <Button kind="primary" type="submit" disabled={loading} style={{ marginTop: '16px' }}>
        {loading ? 'Creating account...' : 'Create Account & Continue'}{' '}
        <Icon name="arrow" size={15} />
      </Button>
    </form>
  )
}
