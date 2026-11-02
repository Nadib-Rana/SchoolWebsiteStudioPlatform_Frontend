'use client'

import { Onboarding } from '@/components/studio/onboarding/Onboarding'
import { StudioProvider } from '@/context/StudioContext'

export default function OnboardingPage() {
  return (
    <StudioProvider>
      <Onboarding />
    </StudioProvider>
  )
}
