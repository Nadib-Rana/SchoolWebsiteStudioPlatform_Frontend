'use client'

import { PublicSite } from '@/components/public-site/PublicSite'
import { StudioProvider } from '@/context/StudioContext'

export default function PreviewPage() {
  return (
    <StudioProvider>
      <PublicSite />
    </StudioProvider>
  )
}
