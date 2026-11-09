'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

import { useState } from 'react'
import { api } from '@/lib/api-client'

export function Login() {
  const { setView, notify } = useStudio()
  const [email, setEmail] = useState('admin@northfield.edu')
  const [password, setPassword] = useState('Admin@12345')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.auth.login(email, password)
      notify(`Welcome back, ${res.data?.user?.firstName || 'Admin'}!`)
      setView('overview')
    } catch (err: any) {
      const msg = err?.message || 'Invalid email or password'
      setError(msg)
      notify(msg)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div className="brand auth-brand">
          <div className="brand-mark">
            <Icon name="layers" size={20} />
          </div>
          <div>
            <strong>SchoolCanvas</strong>
            <small>Website Studio</small>
          </div>
        </div>
        <div>
          <span>WEBSITES THAT INSPIRE TRUST</span>
          <h1>Build a school website your community is proud of.</h1>
          <p>
            Create, manage, and publish an exceptional digital home for your
            school—without writing code.
          </p>
          <div className="auth-quote">
            <p>
              “Our new website finally reflects the quality and warmth of our
              school.”
            </p>
            <span>Farhana Noor · Principal, Northfield High</span>
          </div>
        </div>
        <small>Trusted by growing school communities</small>
      </div>

      <div className="auth-form">
        <div>
          <span className="mobile-auth-logo">
            <Icon name="layers" /> SchoolCanvas
          </span>
          <small>WELCOME BACK</small>
          <h2>Sign in to your studio</h2>
          <p>Manage your school website and keep your community connected.</p>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
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

            <Button
              kind="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in to Studio'}{' '}
              <Icon name="arrow" size={15} />
            </Button>
          </form>

          <div className="or">
            <span />
            or continue with
            <span />
          </div>

          <Button
            type="button"
            onClick={() =>
              notify('Google OAuth is not configured. Please use your email and password.')
            }
          >
            <b>G</b> Continue with Google
          </Button>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Want to set up a new school?{' '}
            </span>
            <button
              type="button"
              onClick={() => setView('onboarding')}
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
              Register New School
            </button>
          </div>

          <small className="legal">
            By signing in, you agree to the Terms of Service and Privacy Policy.
          </small>
        </div>
      </div>
    </div>
  )
}
