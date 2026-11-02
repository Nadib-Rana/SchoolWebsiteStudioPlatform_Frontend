'use client'

import { StudioApp } from '@/components/studio/StudioApp'
import { StudioProvider } from '@/context/StudioContext'

export default function Home() {
  return (
    <StudioProvider>
      <StudioApp />
    </StudioProvider>
  )
}
