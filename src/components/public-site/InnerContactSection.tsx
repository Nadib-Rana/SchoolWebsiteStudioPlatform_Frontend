'use client'

import { api } from '@/lib/api-client'
import type { PublicSiteData } from '@/lib/public-site'
import { PublicContactForm } from './PublicContactForm'

interface InnerContactSectionProps {
  siteData?: PublicSiteData | null
}

export function InnerContactSection({ siteData }: InnerContactSectionProps) {
  const schoolName = siteData?.school?.name || 'Our School'
  const schoolSlug = siteData?.school?.slug || api.getActiveSchoolSlug()
  const allowAdmissions = siteData?.settings?.allowPublicAdmission ?? true

  return (
    <PublicContactForm
      schoolSlug={schoolSlug}
      schoolName={schoolName}
      profile={siteData?.profile}
      allowAdmissions={allowAdmissions}
    />
  )
}
