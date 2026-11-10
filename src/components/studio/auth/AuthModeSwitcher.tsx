'use client'

interface AuthModeSwitcherProps {
  mode: 'login' | 'register'
  onModeChange: (m: 'login' | 'register') => void
}

export function AuthModeSwitcher({ mode, onModeChange }: AuthModeSwitcherProps) {
  return (
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
        onClick={() => onModeChange('login')}
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
        onClick={() => onModeChange('register')}
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
  )
}
