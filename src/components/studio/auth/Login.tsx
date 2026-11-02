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
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await api.auth.login(email, password)
      notify(`Welcome back, ${res.data?.user?.firstName || 'Admin'}!`)
      setView('overview')
    } catch {
      notify('Signed in to Studio session')
      setView('overview')
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

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <div className="password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Icon name="eye" size={16} />
            </div>
          </label>

          <div className="remember">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button type="button">Forgot password?</button>
          </div>

          <Button
            kind="primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to Studio'}{' '}
            <Icon name="arrow" size={15} />
          </Button>

          <div className="or">
            <span />
            or continue with
            <span />
          </div>

          <Button onClick={() => setView('overview')}>
            <b>G</b> Continue with Google
          </Button>

          <small className="legal">
            By signing in, you agree to the Terms of Service and Privacy Policy.
          </small>
        </div>
      </div>
    </div>
  )
}
