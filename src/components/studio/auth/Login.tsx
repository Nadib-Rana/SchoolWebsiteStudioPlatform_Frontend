'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useState } from 'react'

export function Login() {
  const { setView, notify } = useStudio()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Login form state
  const [email, setEmail] = useState('admin@northfield.edu')
  const [password, setPassword] = useState('Admin@12345')

  // Register form state
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

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

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!regEmail || !regPassword) {
      setError('Please provide email and password for your new account.')
      return
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await api.auth.register({
        email: regEmail.trim(),
        password: regPassword,
        firstName: regFirstName.trim() || undefined,
        lastName: regLastName.trim() || undefined,
      })

      // Auto login immediately
      const loginRes = await api.auth.login(regEmail.trim(), regPassword)
      notify(`Account created! Welcome, ${loginRes.data?.user?.firstName || 'Admin'}!`)
      // Direct them to onboarding to create their first school
      setView('onboarding')
    } catch (err: any) {
      const msg = err?.message || 'Registration failed'
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

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '20px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              style={{
                flex: 1,
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                background: mode === 'login' ? '#fff' : 'transparent',
                color: mode === 'login' ? '#1e293b' : '#64748b',
                boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              style={{
                flex: 1,
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                background: mode === 'register' ? '#fff' : 'transparent',
                color: mode === 'register' ? '#1e293b' : '#64748b',
                boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Create Account
            </button>
          </div>

          <small>
            {mode === 'login' ? 'WELCOME BACK' : 'START YOUR FREE WORKSPACE'}
          </small>
          <h2>
            {mode === 'login'
              ? 'Sign in to your studio'
              : 'Create your administrator account'}
          </h2>
          <p>
            {mode === 'login'
              ? 'Manage your school website and keep your community connected.'
              : 'You choose your own login password to manage your school studio.'}
          </p>

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

          {mode === 'login' ? (
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
                    notify(
                      'Password reset OTP service is available on the backend.'
                    )
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
          ) : (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  First name
                  <input
                    type="text"
                    placeholder="e.g. Nadib"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                  />
                </label>
                <label>
                  Last name
                  <input
                    type="text"
                    placeholder="e.g. Rana"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                  />
                </label>
              </div>

              <label>
                Your login email address <span style={{ color: '#ef4444' }}>*</span>
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </label>

              <label>
                Create your login password <span style={{ color: '#ef4444' }}>*</span>
                <div className="password">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
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
          )}

          <div className="or">
            <span />
            or continue with
            <span />
          </div>

          <Button
            type="button"
            onClick={() =>
              notify(
                'Google OAuth is not configured. Please use your email and password.'
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
                  onClick={() => setMode('register')}
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
                  onClick={() => setMode('login')}
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
        </div>
      </div>
    </div>
  )
}
