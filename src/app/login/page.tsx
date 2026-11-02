'use client'

import { Login } from '@/components/studio/auth/Login'
import { StudioProvider } from '@/context/StudioContext'

export default function LoginPage() {
  return (
    <StudioProvider>
      <Login />
    </StudioProvider>
  )
}
