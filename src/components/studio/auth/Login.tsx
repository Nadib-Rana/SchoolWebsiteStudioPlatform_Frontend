'use client'

import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import { useState } from 'react'
import { AuthAside } from './AuthAside'
import { AuthModeSwitcher } from './AuthModeSwitcher'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { AuthFooter } from './AuthFooter'

export function Login() {
  const { setView, notify, refreshSchools } = useStudio()
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
      await refreshSchools()
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

      const loginRes = await api.auth.login(regEmail.trim(), regPassword)
      notify(`Account created! Welcome, ${loginRes.data?.user?.firstName || 'Admin'}!`)
      await refreshSchools()
      setView('onboarding')
    } catch (err: any) {
      const msg = err?.message || 'Registration failed'
      setError(msg)
      notify(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError('')
  }

  return (
    <div className="auth-page">
      <AuthAside />

      <div className="auth-form">
        <div>
          <span className="mobile-auth-logo">
            <Icon name="layers" /> SchoolCanvas
          </span>

          <AuthModeSwitcher mode={mode} onModeChange={handleModeChange} />

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
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleLogin}
            />
          ) : (
            <SignUpForm
              firstName={regFirstName}
              setFirstName={setRegFirstName}
              lastName={regLastName}
              setLastName={setRegLastName}
              email={regEmail}
              setEmail={setRegEmail}
              password={regPassword}
              setPassword={setRegPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleRegister}
            />
          )}

          <AuthFooter mode={mode} onModeChange={handleModeChange} />
        </div>
      </div>
    </div>
  )
}
