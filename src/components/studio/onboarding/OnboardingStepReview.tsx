'use client'

import { Icon } from '@/components/common/Icon'
import { heroImage, templates } from '@/config/templates'

interface OnboardingStepReviewProps {
  schoolName: string
  slug: string
  selectedTemplateIndex: number
}

export function OnboardingStepReview({
  schoolName,
  slug,
  selectedTemplateIndex,
}: OnboardingStepReviewProps) {
  const displayHost =
    typeof window !== 'undefined'
      ? window.location.host
      : (process.env.NEXT_PUBLIC_APP_URL || 'https://nadib.ashyshop.com').replace(/^https?:\/\//, '')

  const readyItems = [
    `School profile: ${schoolName}`,
    `Slug: ${slug}`,
    `Template: ${templates[selectedTemplateIndex]?.name || 'Aster Academy'}`,
    'Default pages (Home, About, Academics, Admissions, Teachers, Contact)',
  ]

  return (
    <>
      <span className="eyebrow">READY TO SHARE</span>
      <h1>Your website is ready to launch.</h1>
      <p>
        Review your foundation, then provision and publish your brand new school website.
      </p>
      <div
        className="onboard-preview"
        style={{
          backgroundImage: `linear-gradient(90deg,#0f274ddd,transparent),url(${heroImage})`,
        }}
      >
        <span>{schoolName.toUpperCase()}</span>
        <strong>
          Shaping thinkers.
          <br />
          Building character.
        </strong>
        <small>{displayHost}/{slug}</small>
      </div>
      <div className="ready-list">
        {readyItems.map((x) => (
          <span key={x}>
            <i>
              <Icon name="check" size={12} />
            </i>
            {x}
          </span>
        ))}
      </div>
    </>
  )
}
