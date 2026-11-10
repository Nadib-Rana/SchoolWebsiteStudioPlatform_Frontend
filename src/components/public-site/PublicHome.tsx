'use client'

import { useState, useEffect } from 'react'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { THEME_CONFIGS } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'
import type { PublicSiteData } from '@/lib/public-site'
import { HomeHeroSection } from './home/HomeHeroSection'
import { HomeStatsSection } from './home/HomeStatsSection'
import { HomeIntroSection } from './home/HomeIntroSection'
import { HomePrincipalSection } from './home/HomePrincipalSection'
import { HomeNoticesSection } from './home/HomeNoticesSection'
import { HomeEventsSection } from './home/HomeEventsSection'
import { HomeGallerySection } from './home/HomeGallerySection'
import { HomeCustomSections } from './home/HomeCustomSections'
import { HomeContactSection } from './home/HomeContactSection'

export interface PublicHomeProps {
  theme?: SchoolTheme
  setPage?: (p: string) => void
  schoolSlug?: string
  schoolData?: PublicSiteData | null
}

export function PublicHome({
  theme = 'classic',
  setPage,
  schoolSlug,
  schoolData,
}: PublicHomeProps) {
  const [builderData, setBuilderData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('studio_builder_homepage_data')
        return cached ? JSON.parse(cached) : null
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('studio_builder_homepage_data')
        if (cached) setBuilderData(JSON.parse(cached))
      } catch (err) {
        console.debug('Failed to load builder homepage data:', err)
      }
    }
  }, [])

  const activeCfg = THEME_CONFIGS[theme] || THEME_CONFIGS.modern
  const isCustomizedForTheme = !builderData?.appliedTheme || builderData?.appliedTheme === theme

  const schoolName =
    schoolData?.school?.name ||
    (isCustomizedForTheme && builderData?.schoolName ? builderData.schoolName : activeCfg.schoolName)
  const motto =
    schoolData?.profile?.motto ||
    (isCustomizedForTheme && builderData?.eyebrow ? builderData.eyebrow : activeCfg.eyebrow)
  const establishedYear = schoolData?.profile?.established || 1983
  const address =
    schoolData?.profile?.address || builderData?.footerAddress || '27 Lakeview Avenue, Riverdale, NY 10471'

  const heroHeading =
    isCustomizedForTheme && builderData?.heading ? builderData.heading : activeCfg.headline
  const heroDesc =
    isCustomizedForTheme && builderData?.description ? builderData.description : activeCfg.description
  const heroBtnLabel =
    isCustomizedForTheme && builderData?.buttonLabel ? builderData.buttonLabel : activeCfg.buttonLabel
  const currentHeroImage = builderData?.heroBg || activeCfg.heroImage || heroImage
  const heroBtnLink = builderData?.buttonLink || '/about'
  const heroOverlay = builderData?.overlayOpacity !== undefined ? builderData.overlayOpacity : 65

  const introKicker = builderData?.introKicker || `WELCOME TO ${schoolName.toUpperCase()}`
  const introTitle = builderData?.introTitle || 'Learning with purpose.\nGrowing with confidence.'
  const introDesc =
    builderData?.introDesc ||
    schoolData?.profile?.missionStatement ||
    'We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.'
  const principalName = schoolData?.profile?.principalName || builderData?.principalName || 'Dr. Farhana Noor'
  const principalTitle = schoolData?.profile?.principalTitle || builderData?.principalTitle || 'Principal & Head Administrator'
  const principalQuote =
    schoolData?.profile?.principalBio || builderData?.principalQuote ||
    `“For more than four decades, ${schoolName} has combined academic ambition with a culture of care, belonging, and purposeful growth.”`
  const principalPhoto =
    schoolData?.profile?.principalPhotoUrl || builderData?.principalPhoto ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400'

  const publishedNotices = schoolData?.notices || []
  const hasDbNotices = publishedNotices.length > 0
  const publishedEvents = schoolData?.events || []
  const hasDbEvents = publishedEvents.length > 0

  const albumPhotos = schoolData?.albums?.[0]?.photos || []
  const galleryPhoto1 = albumPhotos[0]?.url || campusImage
  const galleryPhoto2 = albumPhotos[1]?.url || interiorImage

  const statsList = builderData?.stat1Val
    ? [
        { value: builderData.stat1Val, label: builderData.stat1Label },
        { value: builderData.stat2Val, label: builderData.stat2Label },
        { value: builderData.stat3Val, label: builderData.stat3Label },
        { value: builderData.stat4Val, label: builderData.stat4Label },
      ]
    : [
        { value: '1,240', label: 'Students' },
        { value: '98%', label: 'Graduation rate' },
        { value: '42', label: 'Years of excellence' },
        { value: '16:1', label: 'Student–teacher ratio' },
      ]

  const sectionStyles = builderData?.sectionStyles || {}
  const customSections = builderData?.customSectionsData ? Object.values(builderData.customSectionsData) : []

  return (
    <>
      <HomeHeroSection
        heroOverlay={heroOverlay}
        currentHeroImage={currentHeroImage}
        sectionStyle={sectionStyles['Hero section']}
        motto={motto}
        heroHeading={heroHeading}
        heroDesc={heroDesc}
        schoolSlug={schoolSlug}
        heroBtnLink={heroBtnLink}
        heroBtnLabel={heroBtnLabel}
        setPage={setPage}
        schoolName={schoolName}
        establishedYear={establishedYear}
      />
      <HomeStatsSection sectionStyle={sectionStyles['Statistics']} statsList={statsList} />
      <HomeIntroSection
        sectionStyle={sectionStyles['School introduction']}
        schoolName={schoolName}
        establishedYear={establishedYear}
        introKicker={introKicker}
        introTitle={introTitle}
        introDesc={introDesc}
        schoolSlug={schoolSlug}
        setPage={setPage}
      />
      <HomePrincipalSection
        sectionStyle={sectionStyles['Principal message']}
        principalQuote={principalQuote}
        principalName={principalName}
        principalTitle={principalTitle}
        principalPhoto={principalPhoto}
      />
      <HomeNoticesSection
        noticesHeading={builderData?.noticesHeading || 'Latest notices & circulars'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        hasDbNotices={hasDbNotices}
        publishedNotices={publishedNotices}
        notice1Date={builderData?.notice1Date || 'Nov 05, 2026'}
        notice1Title={builderData?.notice1Title || 'Term Examination Routine & Admit Card Distribution'}
        notice2Date={builderData?.notice2Date || 'Nov 02, 2026'}
        notice2Title={builderData?.notice2Title || 'Annual Inter-School Science & Tech Fair 2026 Registration'}
      />
      <HomeEventsSection
        eventsHeading={builderData?.eventsHeading || 'Upcoming events & calendar'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        hasDbEvents={hasDbEvents}
        publishedEvents={publishedEvents}
        event1Date={builderData?.event1Date || 'Nov 15'}
        event1Title={builderData?.event1Title || 'Annual Sports & Athletics Meet 2026'}
        event1Venue={builderData?.event1Venue || 'Main Campus Stadium'}
        event2Date={builderData?.event2Date || 'Nov 22'}
        event2Title={builderData?.event2Title || 'Parent-Teacher Academic Progress Conference'}
        event2Venue={builderData?.event2Venue || 'Auditorium Hall'}
      />
      <HomeGallerySection
        schoolName={schoolName}
        galleryHeading={builderData?.galleryHeading || 'Campus life & moments'}
        gallerySub={builderData?.gallerySub || 'Explore our modern STEM labs, creative arts studios, and athletic facilities.'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        galleryPhoto1={galleryPhoto1}
        galleryPhoto2={galleryPhoto2}
      />
      <HomeCustomSections
        customSections={customSections}
        sectionStyles={sectionStyles}
        setPage={setPage}
      />
      <HomeContactSection
        schoolName={schoolName}
        address={address}
        schoolSlug={schoolSlug}
        setPage={setPage}
      />
    </>
  )
}
